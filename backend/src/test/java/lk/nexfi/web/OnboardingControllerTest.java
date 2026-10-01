package lk.nexfi.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import lk.nexfi.store.ShopProfileRepository;

@SpringBootTest
@AutoConfigureMockMvc
class OnboardingControllerTest {

    private static final String VALID_BODY = """
            {
              "shopName": "Nimal Grocery",
              "businessType": "RETAIL",
              "location": "Pettah, Colombo",
              "contactPhone": "+94771234567",
              "currency": "LKR",
              "startingBalance": 500000,
              "balancePeriod": "MONTHLY",
              "offersCreditSales": true,
              "buysOnCredit": false,
              "recurringFrequency": "MONTHLY",
              "ownerName": "Nimal Silva",
              "ownerRole": "OWNER",
              "language": "si"
            }
            """;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ShopProfileRepository profiles;

    @BeforeEach
    void resetProfile() {
        // The repository holds one shop for the life of the app, so each test starts from a
        // known-empty state rather than inheriting whatever the previous test submitted.
        profiles.clear();
    }

    @Test
    void shopProfileIs404BeforeOnboarding() throws Exception {
        mockMvc.perform(get("/api/shop-profile"))
                .andExpect(status().isNotFound());
    }

    @Test
    void onboardingCreatesProfileAndTrimsText() throws Exception {
        mockMvc.perform(post("/api/onboarding")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.shopName").value("Nimal Grocery"))
                .andExpect(jsonPath("$.contactPhone").value("+94771234567"))
                .andExpect(jsonPath("$.currency").value("LKR"))
                .andExpect(jsonPath("$.offersCreditSales").value(true))
                .andExpect(jsonPath("$.buysOnCredit").value(false))
                .andExpect(jsonPath("$.startingBalance").value(500000))
                .andExpect(jsonPath("$.ownerRole").value("OWNER"))
                .andExpect(jsonPath("$.language").value("si"));

        // The same endpoint now answers, which is how the frontend knows onboarding is done.
        mockMvc.perform(get("/api/shop-profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shopName").value("Nimal Grocery"));
    }

    @Test
    void contactPhoneMustBeInPlus94Format() throws Exception {
        String body = VALID_BODY.replace("\"+94771234567\"", "\"0771234567\"");

        mockMvc.perform(post("/api/onboarding")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void missingCreditAnswersAreRejectedRatherThanDefaultingToNo() throws Exception {
        // A missing Boolean would silently become false and quietly change the forecast, so
        // both yes/no questions are required.
        String body = VALID_BODY.replace("\"buysOnCredit\": false,", "");

        mockMvc.perform(post("/api/onboarding")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void reOnboardingReplacesTheProfileInsteadOfCreatingASecond() throws Exception {
        mockMvc.perform(post("/api/onboarding")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated());

        String edited = VALID_BODY.replace("Nimal Grocery", "Nimal Super Centre");
        mockMvc.perform(post("/api/onboarding")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(edited))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/shop-profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shopName").value("Nimal Super Centre"));
    }

    @Test
    void unknownCurrencyIsRejected() throws Exception {
        String body = VALID_BODY.replace("\"currency\": \"LKR\"", "\"currency\": \"EUR\"");

        mockMvc.perform(post("/api/onboarding")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
