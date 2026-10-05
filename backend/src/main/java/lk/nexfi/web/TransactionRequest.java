package lk.nexfi.web;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lk.nexfi.domain.TransactionType;

public record TransactionRequest(
        @NotNull(message = "Choose income or expense")
        TransactionType type,

        @NotBlank(message = "Description is required")
        @Size(max = 120, message = "Description is too long")
        String description,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be more than Rs. 0")
        BigDecimal amount,

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotBlank(message = "Category is required")
        @Size(max = 40, message = "Category is too long")
        String category) {
}
