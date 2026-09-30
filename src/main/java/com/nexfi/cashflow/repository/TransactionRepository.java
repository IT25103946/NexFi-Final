package com.nexfi.cashflow.repository;

import com.nexfi.cashflow.model.Transaction;
import com.nexfi.cashflow.model.TransactionStatus;
import com.nexfi.cashflow.model.TransactionType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByOrderByDueDateAsc();

    List<Transaction> findByTypeOrderByDueDateAsc(TransactionType type);

    List<Transaction> findByStatusOrderByDueDateAsc(TransactionStatus status);

    List<Transaction> findByTypeAndStatusOrderByDueDateAsc(
            TransactionType type, TransactionStatus status);
}
