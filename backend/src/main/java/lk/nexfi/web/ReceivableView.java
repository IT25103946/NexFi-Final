package lk.nexfi.web;

import java.math.BigDecimal;
import java.time.LocalDate;

import lk.nexfi.domain.PaymentStatus;

public record ReceivableView(
        Long id,
        String customerName,
        BigDecimal amount,
        LocalDate dueDate,
        PaymentStatus status,
        long daysUntilDue) {
}
