package lk.nexfi.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lk.nexfi.domain.CashStatus;

public record CashFlowSnapshot(
        LocalDate asOf,
        int horizonDays,
        LocalDate forecastEnd,
        BigDecimal openingBalance,
        BigDecimal currentCash,
        BigDecimal moneyCustomersOwe,
        BigDecimal overdueReceivable,
        BigDecimal upcomingReceivable,
        BigDecimal totalPayable,
        BigDecimal overduePayable,
        BigDecimal upcomingPayable,
        BigDecimal recurringInHorizon,
        BigDecimal monthlyRecurringTotal,
        BigDecimal otherExpensesInHorizon,
        BigDecimal expectedIn,
        BigDecimal expectedOut,
        BigDecimal projectedBalance,
        BigDecimal lowestProjectedBalance,
        LocalDate lowestProjectedDate,
        BigDecimal safetyBuffer,
        CashStatus status,
        ShortageWarning shortage,
        List<Advice> advice,
        List<ForecastPoint> forecast) {

    public record ForecastPoint(LocalDate date, int dayOffset, BigDecimal balance, BigDecimal inflow, BigDecimal outflow) {
    }

    public record ShortageWarning(
            String headline,
            LocalDate bufferBreachDate,
            BigDecimal bufferBreachAmount,
            LocalDate negativeDate,
            BigDecimal negativeAmount,
            BigDecimal lowestBalance,
            LocalDate lowestBalanceDate,
            BigDecimal safetyBuffer) {
    }

    public record Advice(String id, String title, String detail, String tone) {
    }
}
