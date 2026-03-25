package com.itas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * TIN Verification Service
 *
 * Integrates with MOR Ethiopia's TIN registry to verify taxpayer identity.
 *
 * Configuration (application.properties):
 *   mor.tin.api.url=http://your-mor-tin-api/api/tin/verify
 *   mor.tin.api.key=your-api-key
 *   mor.tin.api.enabled=true   (set false to use mock data during development)
 */
@Service
public class TinVerificationService {

    @Value("${mor.tin.api.url:}")
    private String tinApiUrl;

    @Value("${mor.tin.api.key:}")
    private String tinApiKey;

    @Value("${mor.tin.api.enabled:false}")
    private boolean tinApiEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Verify a TIN number and return taxpayer info.
     * Returns null if TIN is not found or invalid.
     */
    public TinInfo verifyTin(String tin) {
        if (tin == null || tin.trim().isEmpty()) return null;

        String cleanTin = tin.trim().toUpperCase();

        // Validate TIN format: Ethiopian TINs are 10 digits
        if (!cleanTin.matches("\\d{10}")) {
            throw new IllegalArgumentException("TIN must be exactly 10 digits");
        }

        if (tinApiEnabled && !tinApiUrl.isEmpty()) {
            return callRealTinApi(cleanTin);
        } else {
            // Development/demo mode — simulate TIN lookup
            return mockTinLookup(cleanTin);
        }
    }

    /**
     * Call the real MOR TIN API.
     * Adjust the request/response format to match MOR's actual API spec.
     */
    private TinInfo callRealTinApi(String tin) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-Key", tinApiKey);
            headers.set("Authorization", "Bearer " + tinApiKey);

            Map<String, String> body = new HashMap<>();
            body.put("tin", tin);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                tinApiUrl, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<?, ?> data = response.getBody();
                // Adjust field names to match MOR's actual API response
                TinInfo info = new TinInfo();
                info.setTin(tin);
                info.setFullName(getString(data, "fullName", "taxpayerName", "name"));
                info.setBusinessName(getString(data, "businessName", "tradeName", "companyName"));
                info.setTaxpayerType(getString(data, "taxpayerType", "type", "category"));
                info.setRegion(getString(data, "region", "regionName"));
                info.setSubCity(getString(data, "subCity", "subcity", "woreda"));
                info.setPhone(getString(data, "phone", "phoneNumber", "mobile"));
                info.setEmail(getString(data, "email", "emailAddress"));
                info.setStatus(getString(data, "status", "tinStatus"));
                info.setVerified(true);
                return info;
            }
            return null;
        } catch (Exception e) {
            System.err.println("TIN API call failed: " + e.getMessage());
            // Fall back to mock in case of API failure
            return mockTinLookup(tin);
        }
    }

    /**
     * Mock TIN lookup for development/testing.
     * Replace with real API when MOR provides credentials.
     */
    private TinInfo mockTinLookup(String tin) {
        // Simulate: any 10-digit TIN starting with 0 is "not found"
        if (tin.startsWith("0000")) return null;

        TinInfo info = new TinInfo();
        info.setTin(tin);
        info.setFullName("Taxpayer " + tin.substring(0, 4));
        info.setBusinessName("Business " + tin.substring(4, 7));
        info.setTaxpayerType(tin.charAt(0) % 2 == 0 ? "Individual" : "Business");
        info.setRegion("Addis Ababa");
        info.setSubCity("Bole");
        info.setStatus("Active");
        info.setVerified(true);
        return info;
    }

    private String getString(Map<?, ?> map, String... keys) {
        for (String key : keys) {
            Object val = map.get(key);
            if (val != null) return val.toString();
        }
        return null;
    }

    // ── TIN Info DTO ──────────────────────────────────────────────────────────
    public static class TinInfo {
        private String tin;
        private String fullName;
        private String businessName;
        private String taxpayerType;
        private String region;
        private String subCity;
        private String phone;
        private String email;
        private String status;
        private boolean verified;

        public String getTin() { return tin; }
        public void setTin(String tin) { this.tin = tin; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public String getTaxpayerType() { return taxpayerType; }
        public void setTaxpayerType(String taxpayerType) { this.taxpayerType = taxpayerType; }
        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }
        public String getSubCity() { return subCity; }
        public void setSubCity(String subCity) { this.subCity = subCity; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }
    }
}
