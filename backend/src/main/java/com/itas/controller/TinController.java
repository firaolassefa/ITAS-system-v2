package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.service.TinVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tin")
public class TinController {

    @Autowired
    private TinVerificationService tinService;

    /**
     * Verify a TIN number — called from the registration page.
     * Public endpoint (no auth required) so users can verify before registering.
     * GET /api/tin/verify/{tin}
     */
    @GetMapping("/verify/{tin}")
    public ResponseEntity<?> verifyTin(@PathVariable String tin) {
        try {
            TinVerificationService.TinInfo info = tinService.verifyTin(tin);
            if (info == null) {
                return ResponseEntity.ok(new ApiResponse<>("TIN not found", Map.of(
                    "found", false,
                    "tin", tin
                )));
            }
            return ResponseEntity.ok(new ApiResponse<>("TIN verified", Map.of(
                "found", true,
                "tin", info.getTin(),
                "fullName", info.getFullName() != null ? info.getFullName() : "",
                "businessName", info.getBusinessName() != null ? info.getBusinessName() : "",
                "taxpayerType", info.getTaxpayerType() != null ? info.getTaxpayerType() : "",
                "region", info.getRegion() != null ? info.getRegion() : "",
                "subCity", info.getSubCity() != null ? info.getSubCity() : "",
                "status", info.getStatus() != null ? info.getStatus() : "Active"
            )));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("TIN verification failed: " + e.getMessage(), null));
        }
    }
}
