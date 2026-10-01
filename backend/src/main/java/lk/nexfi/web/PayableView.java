package lk.nexfi.web;

import java.math.BigDecimal;
import java.time.LocalDate;

import lk.nexfi.domain.PaymentStatus;

public record PayableView(
        Long id,
        String supplierName,
        BigDecimal amount,
        LocalDate dueDate,
        PaymentStatus status,
        long daysUntilDue) {
}
