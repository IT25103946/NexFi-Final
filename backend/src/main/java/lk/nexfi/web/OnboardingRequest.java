package lk.nexfi.web;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Onboarding submission. The two yes/no questions are {@code Boolean} rather than primitive
 * {@code boolean} so a missing value fails validation instead of silently defaulting to false
 * and quietly changing the forecast.
 */
public record OnboardingRequest(
        @NotBlank(message = "Shop name is required")
        @Size(max = 80, message = "Shop name is too long")
        String shopName,

        @NotBlank(message = "Business type is required")
        @Pattern(regexp = "RETAIL|WHOLESALE|SERVICE|ECOMMERCE|OTHER",
                message = "Business type must be RETAIL, WHOLESALE, SERVICE, ECOMMERCE or OTHER")
        String businessType,

        @NotBlank(message = "Location is required")
        @Size(max = 80, message = "Location is too long")
        String location,

        @NotBlank(message = "Contact number is required")
        @Pattern(regexp = "^\\+94\\d{9}$", message = "Contact number must be in +94 format")
        String contactPhone,

        @NotBlank(message = "Currency is required")
        @Pattern(regexp = "LKR|USD|INR", message = "Currency must be LKR, USD or INR")
        String currency,

        @NotNull(message = "Starting balance is required")
        @DecimalMin(value = "0.00", message = "Starting balance cannot be negative")
        BigDecimal startingBalance,

        @NotBlank(message = "Balance period is required")
        @Pattern(regexp = "DAILY|MONTHLY", message = "Balance period must be DAILY or MONTHLY")
        String balancePeriod,

        @NotNull(message = "Please answer the credit sales question")
        Boolean offersCreditSales,

        @NotNull(message = "Please answer the credit purchases question")
        Boolean buysOnCredit,

        @NotBlank(message = "Recurring expense frequency is required")
        @Pattern(regexp = "WEEKLY|MONTHLY", message = "Recurring frequency must be WEEKLY or MONTHLY")
        String recurringFrequency,

        @NotBlank(message = "Owner name is required")
        @Size(max = 60, message = "Owner name is too long")
        String ownerName,

        @NotBlank(message = "Owner role is required")
        @Pattern(regexp = "OWNER|MANAGER|ACCOUNTANT",
                message = "Owner role must be OWNER, MANAGER or ACCOUNTANT")
        String ownerRole,

        @NotBlank(message = "Language is required")
        @Pattern(regexp = "en|si|ta", message = "Language must be en, si or ta")
        String language) {
}
