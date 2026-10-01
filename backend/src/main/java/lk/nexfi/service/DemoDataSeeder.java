package lk.nexfi.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import lk.nexfi.domain.CashTransaction;
import lk.nexfi.domain.Payable;
import lk.nexfi.domain.PaymentStatus;
import lk.nexfi.domain.Receivable;
import lk.nexfi.domain.RecurringExpense;
import lk.nexfi.domain.TransactionType;
import lk.nexfi.store.DataStore;

/**
 * Loads a realistic demo book for a small Colombo trading business so the dashboard shows
 * numbers straight after startup.
 *
 * <p>Demo scenario: the bank balance is Rs. 500,000 today. Rent, salaries and supplier
 * invoices land first, while several customer payments only arrive later in the month, so
 * the balance dips below the Rs. 50,000 safety buffer and goes negative 17 days out
 * (Rs. 42,500 short) before it recovers. That mid-month gap is what the shortage banner,
 * the forecast graph and the action engine exist to demonstrate, so the seed data has to
 * keep producing it.
 *
 * <p>Past transactions net to zero (Rs. 280,000 in and Rs. 280,000 out), so current cash
 * stays exactly at the configured opening balance.
 */
@Component
public class DemoDataSeeder implements ApplicationRunner {

    private final DataStore store;
    private final LocalDate today;

    public DemoDataSeeder(DataStore store, CashFlowService cashFlowService) {
        this.store = store;
        this.today = cashFlowService.today();
    }

    @Override
    public void run(ApplicationArguments args) {
        resetDemoData();
    }

    /** Clears the books and reloads the demo scenario. Used on startup and by tests. */
    public void resetDemoData() {
        store.transactions().clear();
        store.receivables().clear();
        store.payables().clear();
        store.recurringExpenses().clear();
        seedRecurringExpenses();
        seedReceivables();
        seedPayables();
        seedTransactions();
    }

    private void seedRecurringExpenses() {
        recurring("Shop rent — Colombo 3 store", "120000", 1, "Rent");
        recurring("Staff salaries", "145000", 5, "Salaries");
        recurring("Electricity bill — CEB", "28000", 10, "Utilities");
        recurring("Internet & phone — Dialog", "7500", 12, "Utilities");
    }

    private void seedReceivables() {
        receivable("Cargills (Ceylon) PLC", "220000", 19, PaymentStatus.PENDING);
        receivable("Keells Supermarket", "150000", 18, PaymentStatus.PENDING);
        receivable("Hotel Grand Cinnamon", "95000", 24, PaymentStatus.PENDING);
        receivable("Distributors Union", "60000", 26, PaymentStatus.PENDING);
        receivable("Sunrise Bakery", "48000", -6, PaymentStatus.PENDING);
        receivable("Blue Wave Restaurant", "35000", -3, PaymentStatus.PENDING);
        receivable("Cargills (Ceylon) PLC", "90000", -10, PaymentStatus.PAID);
    }

    private void seedPayables() {
        payable("Ceylon Packaging (Pvt) Ltd", "180000", 3, PaymentStatus.PENDING);
        payable("Lanka Diesel Fuel", "65000", 6, PaymentStatus.PENDING);
        payable("Suntech Distributors (Pvt) Ltd", "175000", 17, PaymentStatus.PENDING);
        payable("Lanka Ice Company", "42000", -15, PaymentStatus.PAID);
    }

    private void seedTransactions() {
        transaction(TransactionType.INCOME, "Retail counter sales — Pettah branch", "85000", -12, "Sales");
        transaction(TransactionType.INCOME, "Keells Supermarket wholesale order", "150000", -8, "Sales");
        transaction(TransactionType.INCOME, "Catering order — Blue Wave", "45000", -5, "Sales");
        transaction(TransactionType.EXPENSE, "Supplier payment — Ceylon Packaging", "120000", -9, "Suppliers");
        transaction(TransactionType.EXPENSE, "Staff salaries", "145000", -4, "Salaries");
        transaction(TransactionType.EXPENSE, "Transport & fuel", "15000", -2, "Transport");

        transaction(TransactionType.EXPENSE, "Delivery van fuel", "30000", 8, "Transport");
        transaction(TransactionType.EXPENSE, "Facebook & leaflet marketing", "20000", 11, "Marketing");
        transaction(TransactionType.INCOME, "Retail counter sales — Pettah branch", "25000", 15, "Sales");
    }

    private void recurring(String name, String amount, int dueDay, String category) {
        RecurringExpense expense = new RecurringExpense();
        expense.setName(name);
        expense.setAmount(new BigDecimal(amount));
        expense.setDueDay(dueDay);
        expense.setCategory(category);
        store.recurringExpenses().save(expense);
    }

    private void receivable(String customerName, String amount, int dayOffset, PaymentStatus status) {
        Receivable receivable = new Receivable();
        receivable.setCustomerName(customerName);
        receivable.setAmount(new BigDecimal(amount));
        receivable.setDueDate(today.plusDays(dayOffset));
        receivable.setStatus(status);
        store.receivables().save(receivable);
    }

    private void payable(String supplierName, String amount, int dayOffset, PaymentStatus status) {
        Payable payable = new Payable();
        payable.setSupplierName(supplierName);
        payable.setAmount(new BigDecimal(amount));
        payable.setDueDate(today.plusDays(dayOffset));
        payable.setStatus(status);
        store.payables().save(payable);
    }

    private void transaction(TransactionType type, String description, String amount, int dayOffset, String category) {
        CashTransaction transaction = new CashTransaction();
        transaction.setType(type);
        transaction.setDescription(description);
        transaction.setAmount(new BigDecimal(amount));
        transaction.setDate(today.plusDays(dayOffset));
        transaction.setCategory(category);
        store.transactions().save(transaction);
    }
}
