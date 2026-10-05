package lk.nexfi.store;

import org.springframework.stereotype.Repository;

import lk.nexfi.domain.ShopProfile;

/**
 * Stores the single shop profile produced by onboarding. Re-running onboarding replaces the
 * existing profile rather than appending a second one, so the dashboard always has exactly one
 * shop to read.
 */
@Repository
public class ShopProfileRepository extends InMemoryCollection<ShopProfile> {

    public ShopProfile current() {
        return findAll().stream().findFirst().orElse(null);
    }

    /** Upserts: a new profile when none exists, otherwise an edit of the current one. */
    public ShopProfile saveOrReplace(ShopProfile profile) {
        ShopProfile existing = current();
        if (existing != null) {
            profile.setId(existing.getId());
        }
        return save(profile);
    }
}
