package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Certificate;
import com.itas.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/certificates")
public class CertificateController {
    
    @Autowired
    private CertificateService certificateService;
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserCertificates(@PathVariable Long userId) {
        try {
            List<Certificate> certificates = certificateService.getUserCertificates(userId);
            return ResponseEntity.ok(new ApiResponse<>("Success", certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'AUDITOR', 'MANAGER')")
    public ResponseEntity<?> getAllCertificates() {
        try {
            List<Certificate> certificates = certificateService.getAllCertificates();
            return ResponseEntity.ok(new ApiResponse<>("Success", certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/revoke")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'AUDITOR')")
    public ResponseEntity<?> revokeCertificate(@PathVariable Long id) {
        try {
            certificateService.revokeCertificate(id);
            return ResponseEntity.ok(new ApiResponse<>("Certificate revoked", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'AUDITOR')")
    public ResponseEntity<?> restoreCertificate(@PathVariable Long id) {
        try {
            certificateService.restoreCertificate(id);
            return ResponseEntity.ok(new ApiResponse<>("Certificate restored", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> generateCertificate(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long courseId = request.get("courseId");
            
            Certificate certificate = certificateService.generateCertificate(userId, courseId);
            return ResponseEntity.ok(new ApiResponse<>("Certificate generated successfully", certificate));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/verify/{certificateNumber}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String certificateNumber) {
        try {
            Map<String, Object> verificationResult = certificateService.verifyCertificate(certificateNumber);
            ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>("Verification complete", verificationResult);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("certificate", null);
            return ResponseEntity.ok(new ApiResponse<>("Certificate not found", response));
        }
    }

    /**
     * Download certificate as HTML (browser prints to PDF)
     * GET /api/certificates/{id}/download
     */
    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long id) {
        try {
            Certificate cert = certificateService.getCertificateById(id);
            String userName = cert.getUser() != null ? cert.getUser().getFullName() : "Participant";
            String courseTitle = cert.getCourse() != null ? cert.getCourse().getTitle() : "Tax Education Course";
            String certNumber = cert.getCertificateNumber() != null ? cert.getCertificateNumber() : "ITAS-CERT-" + id;
            String issuedDate = cert.getIssuedAt() != null
                ? cert.getIssuedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))
                : "N/A";
            String validUntil = cert.getValidUntil() != null
                ? cert.getValidUntil().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))
                : "N/A";

            String html = buildCertificateHtml(userName, courseTitle, certNumber, issuedDate, validUntil);
            byte[] bytes = html.getBytes(StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            headers.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"certificate-" + certNumber + ".html\"");
            headers.setContentLength(bytes.length);

            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String buildCertificateHtml(String userName, String courseTitle,
                                         String certNumber, String issuedDate, String validUntil) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'>" +
            "<title>Certificate - " + certNumber + "</title>" +
            "<style>" +
            "  @page { size: A4 landscape; margin: 0; }" +
            "  * { margin: 0; padding: 0; box-sizing: border-box; }" +
            "  body { font-family: 'Georgia', serif; background: #fff; width: 297mm; height: 210mm; display: flex; align-items: center; justify-content: center; }" +
            "  .cert { width: 270mm; height: 190mm; border: 12px solid #016396; padding: 30px 50px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }" +
            "  .cert::before { content: ''; position: absolute; inset: 8px; border: 3px solid #f59e0b; pointer-events: none; }" +
            "  .logo-row { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }" +
            "  .logo-circle { width: 64px; height: 64px; background: #016396; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold; }" +
            "  .org { font-size: 18px; font-weight: bold; color: #016396; letter-spacing: 2px; text-transform: uppercase; }" +
            "  .org-sub { font-size: 12px; color: #666; letter-spacing: 1px; }" +
            "  .divider { width: 80%; height: 2px; background: linear-gradient(90deg, transparent, #f59e0b, transparent); margin: 14px auto; }" +
            "  .title { font-size: 36px; color: #016396; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px; }" +
            "  .subtitle { font-size: 14px; color: #888; letter-spacing: 2px; margin-bottom: 20px; }" +
            "  .presented { font-size: 14px; color: #555; margin-bottom: 6px; }" +
            "  .name { font-size: 32px; color: #1a1a1a; font-style: italic; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #f59e0b; padding-bottom: 6px; display: inline-block; }" +
            "  .completed { font-size: 14px; color: #555; margin-bottom: 6px; }" +
            "  .course { font-size: 20px; color: #016396; font-weight: bold; margin-bottom: 20px; }" +
            "  .meta { display: flex; gap: 60px; justify-content: center; margin-top: 16px; }" +
            "  .meta-item { text-align: center; }" +
            "  .meta-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; }" +
            "  .meta-value { font-size: 13px; color: #333; font-weight: bold; margin-top: 2px; }" +
            "  .seal { position: absolute; bottom: 30px; right: 50px; width: 80px; height: 80px; border-radius: 50%; background: #016396; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; text-align: center; letter-spacing: 1px; border: 4px solid #f59e0b; }" +
            "  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }" +
            "</style></head><body>" +
            "<div class='cert'>" +
            "  <div class='logo-row'>" +
            "    <div class='logo-circle'>MOR</div>" +
            "    <div><div class='org'>Ministry of Revenue</div><div class='org-sub'>Federal Democratic Republic of Ethiopia</div></div>" +
            "  </div>" +
            "  <div class='divider'></div>" +
            "  <div class='title'>Certificate of Completion</div>" +
            "  <div class='subtitle'>Tax Education &amp; Compliance Training</div>" +
            "  <div class='presented'>This certifies that</div>" +
            "  <div class='name'>" + userName + "</div>" +
            "  <div class='completed'>has successfully completed the course</div>" +
            "  <div class='course'>" + courseTitle + "</div>" +
            "  <div class='meta'>" +
            "    <div class='meta-item'><div class='meta-label'>Certificate No.</div><div class='meta-value'>" + certNumber + "</div></div>" +
            "    <div class='meta-item'><div class='meta-label'>Issue Date</div><div class='meta-value'>" + issuedDate + "</div></div>" +
            "    <div class='meta-item'><div class='meta-label'>Valid Until</div><div class='meta-value'>" + validUntil + "</div></div>" +
            "  </div>" +
            "  <div class='seal'>MOR<br/>VERIFIED</div>" +
            "</div>" +
            "<script>window.onload = function(){ window.print(); }</script>" +
            "</body></html>";
    }
}

