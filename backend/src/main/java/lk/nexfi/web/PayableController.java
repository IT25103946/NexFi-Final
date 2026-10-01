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
import lk.nexfi.domain.Payable;
import lk.nexfi.service.CashFlowService;
import lk.nexfi.store.DataStore;
import lk.nexfi.store.InMemoryCollection;

@RestController
@RequestMapping("/api/payables")
public class PayableController {

    private final InMemoryCollection<Payable> payables;
    private final CashFlowService cashFlowService;

    public PayableController(DataStore store, CashFlowService cashFlowService) {
        this.payables = store.payables();
        this.cashFlowService = cashFlowService;
    }

    @GetMapping
    public List<PayableView> list() {
        LocalDate today = cashFlowService.today();
        return payables.sorted(Comparator.comparing(Payable::getDueDate))
                .stream()
                .map(payable -> toView(payable, today))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PayableView create(@Valid @RequestBody PayableRequest request) {
        Payable saved = payables.save(toEntity(new Payable(), request));
        return toView(saved, cashFlowService.today());
    }

    @PutMapping("/{id}")
    public PayableView update(@PathVariable long id, @Valid @RequestBody PayableRequest request) {
        Payable existing = payables.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Payable " + id + " was not found"));
        return toView(payables.save(toEntity(existing, request)), cashFlowService.today());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        payables.delete(id);
    }

    private Payable toEntity(Payable payable, PayableRequest request) {
        payable.setSupplierName(request.supplierName().trim());
        payable.setAmount(request.amount());
        payable.setDueDate(request.dueDate());
        payable.setStatus(request.status());
        return payable;
    }

    private PayableView toView(Payable payable, LocalDate today) {
        return new PayableView(
                payable.getId(),
                payable.getSupplierName(),
                payable.getAmount(),
                payable.getDueDate(),
                payable.getStatus(),
                ChronoUnit.DAYS.between(today, payable.getDueDate()));
    }
}
