package lk.nexfi.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lk.nexfi.domain.CashStatus;
import lk.nexfi.domain.CashTransaction;
import lk.nexfi.domain.Payable;
import lk.nexfi.domain.PaymentStatus;
import lk.nexfi.domain.Receivable;
import lk.nexfi.domain.RecurringExpense;
import lk.nexfi.domain.TransactionType;
import lk.nexfi.service.CashFlowSnapshot.Advice;
import lk.nexfi.service.CashFlowSnapshot.ForecastPoint;
import lk.nexfi.service.CashFlowSnapshot.ShortageWarning;
import lk.nexfi.store.DataStore;

/**
 * Rule-based cash-flow engine. No AI and no statistical model: every number is simple
 * addition and subtraction of the records the business owner entered.
 */
@Service
public class CashFlowService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Colombo");
    private static final int MAX_HORIZON_DAYS = 180;

    private final DataStore store;
    private final BigDecimal safetyBuffer;
    private final int defaultHorizonDays;

    public CashFlowService(
            DataStore store,
            @Value("${nexfi.safety-buffer:50000}") BigDecimal safetyBuffer,
            @Value("${nexfi.forecast-days:30}") int defaultHorizonDays) {
        this.store = store;
        this.safetyBuffer = money(safetyBuffer);
        this.defaultHorizonDays = defaultHorizonDays;
    }

    public LocalDate today() {
        return LocalDate.now(BUSINESS_ZONE);
    }

    public BigDecimal safetyBuffer() {
        return safetyBuffer;
    }

    public CashFlowSnapshot snapshot() {
        return snapshot(defaultHorizonDays);
    }

    public CashFlowSnapshot snapshot(int requestedHorizonDays) {
        LocalDate today = today();
        int horizonDays = Math.max(1, Math.min(requestedHorizonDays, MAX_HORIZON_DAYS));
        LocalDate forecastEnd = today.plusDays(horizonDays);

        Map<LocalDate, DayFlow> events = new HashMap<>();
        BigDecimal recordedNet = BigDecimal.ZERO;
        BigDecimal otherExpensesInHorizon = BigDecimal.ZERO;

        for (CashTransaction transaction : store.transactions().findAll()) {
            if (transaction.getDate().isAfter(today)) {
                if (transaction.getDate().isAfter(forecastEnd)) {
                    continue;
                }
                DayFlow flow = flowFor(events, transaction.getDate());
                if (transaction.getType() == TransactionType.INCOME) {
                    flow.in = flow.in.add(transaction.getAmount());
                } else {
                    flow.out = flow.out.add(transaction.getAmount());
                    otherExpensesInHorizon = otherExpensesInHorizon.add(transaction.getAmount());
                }
            } else {
                recordedNet = recordedNet.add(signed(transaction));
            }
        }

        BigDecimal currentCash = money(store.openingBalance().add(recordedNet));

        BigDecimal moneyCustomersOwe = BigDecimal.ZERO;
        BigDecimal overdueReceivable = BigDecimal.ZERO;
        BigDecimal upcomingReceivable = BigDecimal.ZERO;
        long overdueCustomerCount = 0;
        for (Receivable receivable : unpaid(store.receivables().findAll(), Receivable::getStatus)) {
            moneyCustomersOwe = moneyCustomersOwe.add(receivable.getAmount());
            if (receivable.getDueDate().isBefore(today)) {
                overdueReceivable = overdueReceivable.add(receivable.getAmount());
                overdueCustomerCount++;
            } else if (!receivable.getDueDate().isAfter(forecastEnd)) {
                upcomingReceivable = upcomingReceivable.add(receivable.getAmount());
            }
            LocalDate expectedDate = expectedDate(receivable.getDueDate(), today);
            if (!expectedDate.isAfter(forecastEnd)) {
                DayFlow flow = flowFor(events, expectedDate);
                flow.in = flow.in.add(receivable.getAmount());
            }
        }

        BigDecimal totalPayable = BigDecimal.ZERO;
        BigDecimal overduePayable = BigDecimal.ZERO;
        BigDecimal upcomingPayable = BigDecimal.ZERO;
        for (Payable payable : unpaid(store.payables().findAll(), Payable::getStatus)) {
            totalPayable = totalPayable.add(payable.getAmount());
            if (payable.getDueDate().isBefore(today)) {
                overduePayable = overduePayable.add(payable.getAmount());
            } else if (!payable.getDueDate().isAfter(forecastEnd)) {
                upcomingPayable = upcomingPayable.add(payable.getAmount());
            }
            LocalDate expectedDate = expectedDate(payable.getDueDate(), today);
            if (!expectedDate.isAfter(forecastEnd)) {
                DayFlow flow = flowFor(events, expectedDate);
                flow.out = flow.out.add(payable.getAmount());
            }
        }

        BigDecimal recurringInHorizon = BigDecimal.ZERO;
        BigDecimal monthlyRecurringTotal = BigDecimal.ZERO;
        for (RecurringExpense expense : store.recurringExpenses().findAll()) {
            monthlyRecurringTotal = monthlyRecurringTotal.add(expense.getAmount());
            for (LocalDate occurrence : occurrences(expense, today, forecastEnd)) {
                flowFor(events, occurrence).out = flowFor(events, occurrence).out.add(expense.getAmount());
                recurringInHorizon = recurringInHorizon.add(expense.getAmount());
            }
        }

        List<ForecastPoint> forecast = buildForecast(today, horizonDays, currentCash, events);
        BigDecimal lowestBalance = forecast.get(0).balance();
        LocalDate lowestBalanceDate = today;
        BigDecimal expectedIn = BigDecimal.ZERO;
        BigDecimal expectedOut = BigDecimal.ZERO;
        for (ForecastPoint point : forecast) {
            expectedIn = expectedIn.add(point.inflow());
            expectedOut = expectedOut.add(point.outflow());
            if (point.balance().compareTo(lowestBalance) < 0) {
                lowestBalance = point.balance();
                lowestBalanceDate = point.date();
            }
        }
        BigDecimal projectedBalance = forecast.get(forecast.size() - 1).balance();

        CashStatus status = statusFor(lowestBalance);
        ShortageWarning shortage = shortageFor(forecast, lowestBalance, lowestBalanceDate, status);

        return new CashFlowSnapshot(
                today,
                horizonDays,
                forecastEnd,
                money(store.openingBalance()),
                currentCash,
                money(moneyCustomersOwe),
                money(overdueReceivable),
                money(upcomingReceivable),
                money(totalPayable),
                money(overduePayable),
                money(upcomingPayable),
                money(recurringInHorizon),
                money(monthlyRecurringTotal),
                money(otherExpensesInHorizon),
                money(expectedIn),
                money(expectedOut),
                money(projectedBalance),
                money(lowestBalance),
                lowestBalanceDate,
                safetyBuffer,
                status,
                shortage,
                buildAdvice(lowestBalance, lowestBalanceDate, status, overdueReceivable, overdueCustomerCount,
                        upcomingPayable, totalPayable, recurringInHorizon, monthlyRecurringTotal, shortage),
                forecast);
    }

    private List<ForecastPoint> buildForecast(LocalDate today, int horizonDays, BigDecimal currentCash,
            Map<LocalDate, DayFlow> events) {
        List<ForecastPoint> points = new ArrayList<>();
        BigDecimal balance = currentCash;
        points.add(new ForecastPoint(today, 0, money(balance), money(BigDecimal.ZERO), money(BigDecimal.ZERO)));
        for (int day = 1; day <= horizonDays; day++) {
            LocalDate date = today.plusDays(day);
            DayFlow flow = events.getOrDefault(date, new DayFlow());
            balance = balance.add(flow.in).subtract(flow.out);
            points.add(new ForecastPoint(date, day, money(balance), money(flow.in), money(flow.out)));
        }
        return points;
    }

    private CashStatus statusFor(BigDecimal lowestBalance) {
        if (lowestBalance.signum() < 0) {
            return CashStatus.SHORTAGE;
        }
        if (lowestBalance.compareTo(safetyBuffer) < 0) {
            return CashStatus.WARNING;
        }
        return CashStatus.SAFE;
    }

    private ShortageWarning shortageFor(List<ForecastPoint> forecast, BigDecimal lowestBalance,
            LocalDate lowestBalanceDate, CashStatus status) {
        if (status == CashStatus.SAFE) {
            return null;
        }
        LocalDate bufferBreachDate = null;
        BigDecimal bufferBreachAmount = BigDecimal.ZERO;
        LocalDate negativeDate = null;
        BigDecimal negativeAmount = BigDecimal.ZERO;
        for (ForecastPoint point : forecast) {
            if (bufferBreachDate == null && point.balance().compareTo(safetyBuffer) < 0) {
                bufferBreachDate = point.date();
                bufferBreachAmount = safetyBuffer.subtract(point.balance());
            }
            if (negativeDate == null && point.balance().signum() < 0) {
                negativeDate = point.date();
                negativeAmount = point.balance().negate();
            }
        }
        String headline = negativeDate != null ? "Cash shortage expected" : "Cash is falling below your safety buffer";
        return new ShortageWarning(headline, bufferBreachDate, money(bufferBreachAmount), negativeDate,
                money(negativeAmount), money(lowestBalance), lowestBalanceDate, safetyBuffer);
    }

    private List<Advice> buildAdvice(BigDecimal lowestBalance, LocalDate lowestBalanceDate, CashStatus status,
            BigDecimal overdueReceivable, long overdueCustomerCount, BigDecimal upcomingPayable, BigDecimal totalPayable,
            BigDecimal recurringInHorizon, BigDecimal monthlyRecurringTotal, ShortageWarning shortage) {
        List<Advice> advice = new ArrayList<>();

        if (overdueReceivable.signum() > 0) {
            advice.add(new Advice("collect-overdue", "Collect overdue customer payments",
                    "Rs. " + plain(overdueReceivable) + " from " + overdueCustomerCount
                            + (overdueCustomerCount == 1 ? " customer is" : " customers are") + " past the due date. "
                            + "Calling these customers today is the fastest way to protect your cash.",
                    "critical"));
        }

        if (shortage != null && shortage.negativeDate() != null) {
            advice.add(new Advice("plan-shortage", "Plan for the shortage on " + shortage.negativeDate(),
                    "On " + shortage.negativeDate() + " your balance is expected to run about Rs. "
                            + plain(shortage.negativeAmount()) + " below zero. Ask your bank about a short overdraft "
                            + "or move an urgent bill to a later date before that day.",
                    "critical"));
        }

        if (upcomingPayable.signum() > 0) {
            String scope = upcomingPayable.compareTo(totalPayable) == 0
                    ? "Rs. " + plain(upcomingPayable) + " is due to suppliers"
                    : "Rs. " + plain(upcomingPayable) + " of your Rs. " + plain(totalPayable) + " supplier bills are due";
            advice.add(new Advice("review-payables", "Review upcoming supplier payments",
                    scope + " within the next " + defaultHorizonDays
                            + " days. Check every bill is still necessary before you pay.",
                    "warning"));
        }

        if (status != CashStatus.SAFE) {
            advice.add(new Advice("delay-expense", "Delay a non-urgent expense",
                    "Postpone optional spending such as marketing, travel or equipment until the next customer "
                            + "payment arrives, so the balance stays above Rs. " + plain(safetyBuffer) + ".",
                    "warning"));
        }

        if (monthlyRecurringTotal.signum() > 0) {
            String insideWindow = recurringInHorizon.compareTo(monthlyRecurringTotal) == 0
                    ? "That is your monthly commitment."
                    : "Rs. " + plain(recurringInHorizon) + " of that falls inside the next " + defaultHorizonDays
                            + " days.";
            advice.add(new Advice("check-recurring", "Review your fixed monthly costs",
                    "Rs. " + plain(monthlyRecurringTotal) + " leaves your account every month in fixed costs such as "
                            + "rent and salaries. " + insideWindow,
                    "info"));
        }

        if (status == CashStatus.SAFE) {
            advice.add(new Advice("healthy", "Your cash position looks healthy",
                    "The lowest projected balance is Rs. " + plain(lowestBalance) + " on " + lowestBalanceDate
                            + ", above your Rs. " + plain(safetyBuffer) + " safety buffer. No action needed today.",
                    "success"));
            advice.add(new Advice("build-buffer", "Keep building the safety buffer",
                    "While cash is strong, keep at least Rs. " + plain(safetyBuffer)
                            + " untouched so a slow month does not force you to borrow.",
                    "info"));
        }

        advice.add(new Advice("reduce-optional", "Reduce optional spending during the low period",
                "Cut non-essential costs in the days before the next customer payment so the dip does not turn into a "
                        + "shortage.",
                status == CashStatus.SAFE ? "info" : "warning"));

        return advice.size() > 5 ? advice.subList(0, 5) : advice;
    }

    /** Overdue items are expected to be settled the day after today. */
    private LocalDate expectedDate(LocalDate dueDate, LocalDate today) {
        return dueDate.isAfter(today) ? dueDate : today.plusDays(1);
    }

    private List<LocalDate> occurrences(RecurringExpense expense, LocalDate today, LocalDate forecastEnd) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate month = LocalDate.of(today.getYear(), today.getMonth(), 1);
        LocalDate lastMonth = LocalDate.of(forecastEnd.getYear(), forecastEnd.getMonth(), 1);
        while (!month.isAfter(lastMonth)) {
            LocalDate due = LocalDate.of(month.getYear(), month.getMonth(),
                    Math.min(expense.getDueDay(), month.lengthOfMonth()));
            if (due.isAfter(today) && !due.isAfter(forecastEnd)) {
                dates.add(due);
            }
            month = month.plusMonths(1);
        }
        return dates;
    }

    private <T> List<T> unpaid(List<T> items, Function<T, PaymentStatus> status) {
        return items.stream().filter(item -> status.apply(item) != PaymentStatus.PAID).toList();
    }

    private DayFlow flowFor(Map<LocalDate, DayFlow> events, LocalDate date) {
        return events.computeIfAbsent(date, key -> new DayFlow());
    }

    private BigDecimal signed(CashTransaction transaction) {
        return transaction.getType() == TransactionType.INCOME ? transaction.getAmount() : transaction.getAmount().negate();
    }

    static BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    /** Money with thousands separators and no trailing zeros, for messages. */
    private static String plain(BigDecimal value) {
        NumberFormat format = NumberFormat.getNumberInstance(Locale.ENGLISH);
        format.setGroupingUsed(true);
        format.setMinimumFractionDigits(0);
        format.setMaximumFractionDigits(2);
        return format.format(money(value));
    }

    private static final class DayFlow {
        private BigDecimal in = BigDecimal.ZERO;
        private BigDecimal out = BigDecimal.ZERO;
    }
}
