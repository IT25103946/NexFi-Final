package com.nexfi.cashflow.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_balances", uniqueConstraints = {
        @UniqueConstraint(name = "uk_daily_balance_date", columnNames = "balance_date")
})
public class DailyBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "balance_date", nullable = false)
    private LocalDate balanceDate;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    protected DailyBalance() {
    }

    public DailyBalance(LocalDate balanceDate, BigDecimal balance) {
        this.balanceDate = balanceDate;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getBalanceDate() {
        return balanceDate;
    }

    public void setBalanceDate(LocalDate balanceDate) {
        this.balanceDate = balanceDate;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
