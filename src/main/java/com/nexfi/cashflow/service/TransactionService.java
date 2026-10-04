package com.nexfi.cashflow.service;

import com.nexfi.cashflow.dto.TransactionRequest;
import com.nexfi.cashflow.model.Transaction;
import com.nexfi.cashflow.model.TransactionStatus;
import com.nexfi.cashflow.model.TransactionType;
import com.nexfi.cashflow.repository.TransactionRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> findAll(TransactionType type, TransactionStatus status) {
        if (type != null && status != null) {
            return transactionRepository.findByTypeAndStatusOrderByDueDateAsc(type, status);
        }
        if (type != null) {
            return transactionRepository.findByTypeOrderByDueDateAsc(type);
        }
        if (status != null) {
            return transactionRepository.findByStatusOrderByDueDateAsc(status);
        }
        return transactionRepository.findAllByOrderByDueDateAsc();
    }

    public Transaction findById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Transaction not found"));
    }

    public Transaction create(TransactionRequest request) {
        Transaction transaction = new Transaction(
                request.type(), request.amount(), request.dueDate(),
                request.counterparty(), request.category());
        if (request.status() != null) {
            transaction.setStatus(request.status());
        }
        return transactionRepository.save(transaction);
    }

    public Transaction update(Long id, TransactionRequest request) {
        Transaction transaction = findById(id);
        transaction.setType(request.type());
        transaction.setAmount(request.amount());
        transaction.setDueDate(request.dueDate());
        transaction.setCounterparty(request.counterparty());
        transaction.setCategory(request.category());
        if (request.status() != null) {
            transaction.setStatus(request.status());
        }
        return transactionRepository.save(transaction);
    }

    public void delete(Long id) {
        Transaction transaction = findById(id);
        transactionRepository.delete(transaction);
    }
}
