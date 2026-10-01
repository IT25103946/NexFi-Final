package lk.nexfi.store;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lk.nexfi.domain.CashTransaction;
import lk.nexfi.domain.Payable;
import lk.nexfi.domain.Receivable;
import lk.nexfi.domain.RecurringExpense;

@Component
public class DataStore {

    private final InMemoryCollection<CashTransaction> transactions = new InMemoryCollection<>();
    private final InMemoryCollection<Receivable> receivables = new InMemoryCollection<>();
    private final InMemoryCollection<Payable> payables = new InMemoryCollection<>();
    private final InMemoryCollection<RecurringExpense> recurringExpenses = new InMemoryCollection<>();
    private final BigDecimal openingBalance;

    public DataStore(@Value("${nexfi.opening-balance:500000}") BigDecimal openingBalance) {
        this.openingBalance = openingBalance;
    }

    public InMemoryCollection<CashTransaction> transactions() {
        return transactions;
    }

    public InMemoryCollection<Receivable> receivables() {
        return receivables;
    }

    public InMemoryCollection<Payable> payables() {
        return payables;
    }

    public InMemoryCollection<RecurringExpense> recurringExpenses() {
        return recurringExpenses;
    }

    /** Cash in the bank before any recorded transaction. */
    public BigDecimal openingBalance() {
        return openingBalance;
    }
}
