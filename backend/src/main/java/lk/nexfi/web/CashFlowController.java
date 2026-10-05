package lk.nexfi.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.nexfi.service.CashFlowService;
import lk.nexfi.service.CashFlowSnapshot;

@RestController
@RequestMapping("/api")
public class CashFlowController {

    private final CashFlowService cashFlowService;

    public CashFlowController(CashFlowService cashFlowService) {
        this.cashFlowService = cashFlowService;
    }

    @GetMapping("/dashboard")
    public CashFlowSnapshot dashboard() {
        return cashFlowService.snapshot();
    }

    @GetMapping("/forecast")
    public CashFlowSnapshot forecast(@RequestParam(defaultValue = "30") int days) {
        return cashFlowService.snapshot(days);
    }
}
