package lk.nexfi.domain;

import java.math.BigDecimal;

/**
 * Shop and owner details collected during onboarding.
 *
 * The financial answers (credit sales, credit purchases, recurring frequency) are stored as
 * flags rather than inferred, because the forecast needs to know whether receivables and
 * payables are relevant to this shop before any transactions exist.
 */
public class ShopProfile implements Identifiable {

    private Long id;
    private String shopName;
    private String businessType;
    private String location;
    private String contactPhone;
    private String currency;

    private BigDecimal startingBalance;
    /** DAILY or MONTHLY — how the starting balance above should be read. */
    private String balancePeriod;
    private boolean offersCreditSales;
    private boolean buysOnCredit;
    /** WEEKLY or MONTHLY. */
    private String recurringFrequency;

    private String ownerName;
    private String ownerRole;
    private String language;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getStartingBalance() {
        return startingBalance;
    }

    public void setStartingBalance(BigDecimal startingBalance) {
        this.startingBalance = startingBalance;
    }

    public String getBalancePeriod() {
        return balancePeriod;
    }

    public void setBalancePeriod(String balancePeriod) {
        this.balancePeriod = balancePeriod;
    }

    public boolean isOffersCreditSales() {
        return offersCreditSales;
    }

    public void setOffersCreditSales(boolean offersCreditSales) {
        this.offersCreditSales = offersCreditSales;
    }

    public boolean isBuysOnCredit() {
        return buysOnCredit;
    }

    public void setBuysOnCredit(boolean buysOnCredit) {
        this.buysOnCredit = buysOnCredit;
    }

    public String getRecurringFrequency() {
        return recurringFrequency;
    }

    public void setRecurringFrequency(String recurringFrequency) {
        this.recurringFrequency = recurringFrequency;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerRole() {
        return ownerRole;
    }

    public void setOwnerRole(String ownerRole) {
        this.ownerRole = ownerRole;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
