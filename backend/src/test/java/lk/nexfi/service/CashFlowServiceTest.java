package lk.nexfi.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import lk.nexfi.domain.CashStatus;
import lk.nexfi.domain.CashTransaction;
import lk.nexfi.domain.PaymentStatus;
import lk.nexfi.domain.Receivable;
import lk.nexfi.domain.RecurringExpense;
import lk.nexfi.domain.TransactionType;
import lk.nexfi.store.DataStore;

@SpringBootTest
class CashFlowServiceTest {

    @Autowired
    private CashFlowService cashFlowService;

    @Autowired
    private DataStore store;

    @Autowired
    private DemoDataSeeder demoDataSeeder;

    @BeforeEach
    void resetDemoBook() {
        demoDataSeeder.resetDemoData();
    }

    @Test
    void demoDataStartsWithFiveHundredThousandAndShowsAShortage() {
        CashFlowSnapshot snapshot = cashFlowService.snapshot(30);

        assertThat(snapshot.currentCash()).isEqualByComparingTo("500000.00");
        assertThat(snapshot.status()).isEqualTo(CashStatus.SHORTAGE);
        assertThat(snapshot.shortage()).isNotNull();
        assertThat(snapshot.shortage().negativeDate()).isNotNull();
        assertThat(snapshot.shortage().lowestBalance()).isLessThan(BigDecimal.ZERO);
    }

    @Test
    void collectingCustomerPaymentsCancelsTheShortage() {
        CashFlowSnapshot before = cashFlowService.snapshot(30);
        assertThat(before.status()).isEqualTo(CashStatus.SHORTAGE);

        store.payables().findAll().forEach(payable -> payable.setStatus(PaymentStatus.PAID));
        store.receivables().findAll().forEach(receivable -> receivable.setStatus(PaymentStatus.PAID));
        CashTransaction invoice = new CashTransaction();
        invoice.setType(TransactionType.INCOME);
        invoice.setDescription("Advance from Cargills");
        invoice.setAmount(new BigDecimal("120000"));
        invoice.setDate(cashFlowService.today().plusDays(6));
        invoice.setCategory("Sales");
        store.transactions().save(invoice);

        CashFlowSnapshot after = cashFlowService.snapshot(30);
        assertThat(after.status()).isIn(CashStatus.SAFE, CashStatus.WARNING);
        assertThat(after.shortage()).isNull();
        assertThat(after.lowestProjectedBalance()).isGreaterThanOrEqualTo(BigDecimal.ZERO);
    }

    @Test
    void recurringExpensesRepeatOnTheirDueDay() {
        RecurringExpense rent = new RecurringExpense();
        rent.setName("Shop rent");
        rent.setAmount(new BigDecimal("100000"));
        rent.setDueDay(5);
        rent.setCategory("Rent");
        store.recurringExpenses().save(rent);

        CashFlowSnapshot snapshot = cashFlowService.snapshot(30);

        long rentDays = snapshot.forecast().stream()
                .filter(point -> point.outflow().compareTo(new BigDecimal("100000")) >= 0)
                .count();
        assertThat(rentDays).isGreaterThanOrEqualTo(1);
        assertThat(snapshot.recurringInHorizon()).isGreaterThanOrEqualTo(new BigDecimal("100000"));
    }

    @Test
    void overdueReceivablesAreExpectedTheDayAfterToday() {
        Receivable overdue = new Receivable();
        overdue.setCustomerName("Sunrise Bakery");
        overdue.setAmount(new BigDecimal("40000"));
        overdue.setDueDate(cashFlowService.today().minusDays(5));
        overdue.setStatus(PaymentStatus.PENDING);
        store.receivables().save(overdue);

        CashFlowSnapshot snapshot = cashFlowService.snapshot(30);

        LocalDate tomorrow = cashFlowService.today().plusDays(1);
        assertThat(snapshot.overdueReceivable()).isGreaterThanOrEqualTo(new BigDecimal("40000"));
        assertThat(snapshot.forecast().stream()
                .filter(point -> point.date().equals(tomorrow))
                .findFirst()
                .orElseThrow()
                .inflow()).isGreaterThanOrEqualTo(new BigDecimal("40000"));
    }
}
