package lk.nexfi.domain;

import java.math.BigDecimal;

/**
 * A monthly cost that repeats on the same day of the month, for example rent on the 1st
 * or the electricity bill on the 10th.
 */
public class RecurringExpense implements Identifiable {

    private Long id;
    private String name;
    private BigDecimal amount;
    private int dueDay;
    private String category;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public int getDueDay() {
        return dueDay;
    }

    public void setDueDay(int dueDay) {
        this.dueDay = dueDay;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
