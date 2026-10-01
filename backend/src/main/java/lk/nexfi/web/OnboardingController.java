package lk.nexfi.web;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import lk.nexfi.domain.ShopProfile;
import lk.nexfi.store.ShopProfileRepository;

/**
 * Shop setup collected during onboarding.
 *
 * {@code POST /api/onboarding} upserts a single profile. {@code GET /api/shop-profile} returns
 * 404 until onboarding has been completed, which is how the frontend decides whether to show the
 * wizard or the dashboard.
 */
@RestController
@RequestMapping("/api")
public class OnboardingController {

    private final ShopProfileRepository profiles;

    public OnboardingController(ShopProfileRepository profiles) {
        this.profiles = profiles;
    }

    @GetMapping("/shop-profile")
    public ShopProfile shopProfile() {
        ShopProfile profile = profiles.current();
        if (profile == null) {
            // ApiExceptionHandler already maps NoSuchElementException to 404, which is what the
            // frontend checks to decide between the wizard and the dashboard.
            throw new NoSuchElementException("No shop profile has been created yet");
        }
        return profile;
    }

    @PostMapping("/onboarding")
    @ResponseStatus(HttpStatus.CREATED)
    public ShopProfile onboard(@Valid @RequestBody OnboardingRequest request) {
        return profiles.saveOrReplace(toProfile(request));
    }

    private static ShopProfile toProfile(OnboardingRequest request) {
        ShopProfile profile = new ShopProfile();
        profile.setShopName(request.shopName().trim());
        profile.setBusinessType(request.businessType());
        profile.setLocation(request.location().trim());
        profile.setContactPhone(request.contactPhone().trim());
        profile.setCurrency(request.currency());
        profile.setStartingBalance(request.startingBalance());
        profile.setBalancePeriod(request.balancePeriod());
        profile.setOffersCreditSales(Boolean.TRUE.equals(request.offersCreditSales()));
        profile.setBuysOnCredit(Boolean.TRUE.equals(request.buysOnCredit()));
        profile.setRecurringFrequency(request.recurringFrequency());
        profile.setOwnerName(request.ownerName().trim());
        profile.setOwnerRole(request.ownerRole());
        profile.setLanguage(request.language());
        return profile;
    }
}
