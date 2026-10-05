package lk.nexfi.web;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lk.nexfi.domain.RecurringExpense;
import lk.nexfi.store.DataStore;
import lk.nexfi.store.InMemoryCollection;

@RestController
@RequestMapping("/api/recurring-expenses")
public class RecurringExpenseController {

    private final InMemoryCollection<RecurringExpense> recurringExpenses;

    public RecurringExpenseController(DataStore store) {
        this.recurringExpenses = store.recurringExpenses();
    }

    @GetMapping
    public List<RecurringExpense> list() {
        return recurringExpenses.sorted(Comparator.comparingInt(RecurringExpense::getDueDay));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecurringExpense create(@Valid @RequestBody RecurringExpenseRequest request) {
        return recurringExpenses.save(toEntity(new RecurringExpense(), request));
    }

    @PutMapping("/{id}")
    public RecurringExpense update(@PathVariable long id, @Valid @RequestBody RecurringExpenseRequest request) {
        RecurringExpense existing = recurringExpenses.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Recurring expense " + id + " was not found"));
        return recurringExpenses.save(toEntity(existing, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        recurringExpenses.delete(id);
    }

    private RecurringExpense toEntity(RecurringExpense expense, RecurringExpenseRequest request) {
        expense.setName(request.name().trim());
        expense.setAmount(request.amount());
        expense.setDueDay(request.dueDay());
        expense.setCategory(request.category().trim());
        return expense;
    }
}
