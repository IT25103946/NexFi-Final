package lk.nexfi.web;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
import lk.nexfi.domain.Receivable;
import lk.nexfi.service.CashFlowService;
import lk.nexfi.store.DataStore;
import lk.nexfi.store.InMemoryCollection;

@RestController
@RequestMapping("/api/receivables")
public class ReceivableController {

    private final InMemoryCollection<Receivable> receivables;
    private final CashFlowService cashFlowService;

    public ReceivableController(DataStore store, CashFlowService cashFlowService) {
        this.receivables = store.receivables();
        this.cashFlowService = cashFlowService;
    }

    @GetMapping
    public List<ReceivableView> list() {
        LocalDate today = cashFlowService.today();
        return receivables.sorted(Comparator.comparing(Receivable::getDueDate))
                .stream()
                .map(receivable -> toView(receivable, today))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReceivableView create(@Valid @RequestBody ReceivableRequest request) {
        Receivable saved = receivables.save(toEntity(new Receivable(), request));
        return toView(saved, cashFlowService.today());
    }

    @PutMapping("/{id}")
    public ReceivableView update(@PathVariable long id, @Valid @RequestBody ReceivableRequest request) {
        Receivable existing = receivables.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Receivable " + id + " was not found"));
        return toView(receivables.save(toEntity(existing, request)), cashFlowService.today());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        receivables.delete(id);
    }

    private Receivable toEntity(Receivable receivable, ReceivableRequest request) {
        receivable.setCustomerName(request.customerName().trim());
        receivable.setAmount(request.amount());
        receivable.setDueDate(request.dueDate());
        receivable.setStatus(request.status());
        return receivable;
    }

    private ReceivableView toView(Receivable receivable, LocalDate today) {
        return new ReceivableView(
                receivable.getId(),
                receivable.getCustomerName(),
                receivable.getAmount(),
                receivable.getDueDate(),
                receivable.getStatus(),
                ChronoUnit.DAYS.between(today, receivable.getDueDate()));
    }
}
