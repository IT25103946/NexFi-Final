package lk.nexfi.web;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lk.nexfi.domain.CashTransaction;
import lk.nexfi.domain.TransactionType;
import lk.nexfi.store.DataStore;
import lk.nexfi.store.InMemoryCollection;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final InMemoryCollection<CashTransaction> transactions;

    public TransactionController(DataStore store) {
        this.transactions = store.transactions();
    }

    @GetMapping
    public List<CashTransaction> list(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q) {
        String search = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        return transactions.sorted(Comparator.comparing(CashTransaction::getDate)
                        .thenComparing(CashTransaction::getId)
                        .reversed())
                .stream()
                .filter(transaction -> type == null || transaction.getType() == type)
                .filter(transaction -> category == null || category.isBlank()
                        || transaction.getCategory().equalsIgnoreCase(category))
                .filter(transaction -> search.isEmpty()
                        || transaction.getDescription().toLowerCase(Locale.ROOT).contains(search))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CashTransaction create(@Valid @RequestBody TransactionRequest request) {
        return transactions.save(toEntity(new CashTransaction(), request));
    }

    @PutMapping("/{id}")
    public CashTransaction update(@PathVariable long id, @Valid @RequestBody TransactionRequest request) {
        CashTransaction existing = transactions.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction " + id + " was not found"));
        return transactions.save(toEntity(existing, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        transactions.delete(id);
    }

    private CashTransaction toEntity(CashTransaction transaction, TransactionRequest request) {
        transaction.setType(request.type());
        transaction.setDescription(request.description().trim());
        transaction.setAmount(request.amount());
        transaction.setDate(request.date());
        transaction.setCategory(request.category().trim());
        return transaction;
    }
}
