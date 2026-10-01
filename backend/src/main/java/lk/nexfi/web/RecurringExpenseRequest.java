package lk.nexfi.web;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RecurringExpenseRequest(
        @NotBlank(message = "Expense name is required")
        @Size(max = 80, message = "Expense name is too long")
        String name,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be more than Rs. 0")
        BigDecimal amount,

        @NotNull(message = "Due day is required")
        @Min(value = 1, message = "Due day must be between 1 and 28")
        @Max(value = 28, message = "Due day must be between 1 and 28")
        Integer dueDay,

        @NotBlank(message = "Category is required")
        @Size(max = 40, message = "Category is too long")
        String category) {
}
