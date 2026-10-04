package com.nexfi.cashflow.dto;

import com.nexfi.cashflow.model.TransactionStatus;
import com.nexfi.cashflow.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull TransactionType type,
        @NotNull
        @DecimalMin("0.01")
        @Digits(integer = 17, fraction = 2)
        BigDecimal amount,
        @NotNull LocalDate dueDate,
        @Size(max = 255) String counterparty,
        @Size(max = 100) String category,
        TransactionStatus status) {
}
