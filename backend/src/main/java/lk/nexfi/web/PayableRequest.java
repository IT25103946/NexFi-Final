package lk.nexfi.web;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lk.nexfi.domain.PaymentStatus;

public record PayableRequest(
        @NotBlank(message = "Supplier name is required")
        @Size(max = 80, message = "Supplier name is too long")
        String supplierName,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be more than Rs. 0")
        BigDecimal amount,

        @NotNull(message = "Due date is required")
        LocalDate dueDate,

        @NotNull(message = "Payment status is required")
        PaymentStatus status) {
}
