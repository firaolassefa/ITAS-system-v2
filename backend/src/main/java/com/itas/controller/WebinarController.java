package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.dto.WebinarRequest;
import com.itas.model.User;
import com.itas.model.Webinar;
import com.itas.service.WebinarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/webinars")
@SecurityRequirement(name = "bearerAuth")
public class WebinarController {
    
    @Autowired
    private WebinarService webinarService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINING_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Schedule a new webinar", description = "UC-ADM-001: Schedule Live Webinar")
    public ResponseEntity<ApiResponse<Webinar>> scheduleWebinar(
            @Valid @RequestBody WebinarRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        Webinar webinar = webinarService.scheduleWebinar(request, currentUser);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Webinar scheduled successfully", webinar)
        );
    }
    
    @GetMapping
    @Operation(summary = "Get all webinars with filters")
    public ResponseEntity<ApiResponse<Page<Webinar>>> getWebinars(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            Pageable pageable) {
        
        Page<Webinar> webinars = webinarService.getWebinars(status, fromDate, toDate, pageable);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Webinars retrieved successfully", webinars)
        );
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming webinars")
    public ResponseEntity<ApiResponse<List<Webinar>>> getUpcomingWebinars(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Webinar> webinars = webinarService.getUpcomingWebinars(limit);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Upcoming webinars retrieved", webinars)
        );
    }
    
    @PostMapping("/{webinarId}/register")
    @PreAuthorize("hasRole('TAXPAYER')")
    @Operation(summary = "Register for a webinar")
    public ResponseEntity<ApiResponse<Void>> registerForWebinar(
            @PathVariable Long webinarId,
            @AuthenticationPrincipal User currentUser) {
        
        webinarService.registerForWebinar(webinarId, currentUser);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Successfully registered for webinar", null)
        );
    }
    
    @GetMapping("/{webinarId}/registrations")
    @PreAuthorize("hasAnyRole('TRAINING_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Get webinar registrations")
    public ResponseEntity<ApiResponse<Page<User>>> getRegistrations(
            @PathVariable Long webinarId,
            Pageable pageable) {
        
        Page<User> registrations = webinarService.getWebinarRegistrations(webinarId, pageable);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Registrations retrieved", registrations)
        );
    }
    
    @PostMapping("/{webinarId}/start")
    @PreAuthorize("hasAnyRole('TRAINING_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Start a webinar")
    public ResponseEntity<ApiResponse<Void>> startWebinar(
            @PathVariable Long webinarId,
            @AuthenticationPrincipal User currentUser) {
        
        webinarService.startWebinar(webinarId, currentUser);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Webinar started successfully", null)
        );
    }
    
    @PostMapping("/{webinarId}/complete")
    @PreAuthorize("hasAnyRole('TRAINING_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Mark webinar as completed")
    public ResponseEntity<ApiResponse<Void>> completeWebinar(
            @PathVariable Long webinarId,
            @AuthenticationPrincipal User currentUser) {
        
        webinarService.completeWebinar(webinarId, currentUser);
        
        return ResponseEntity.ok(
            new ApiResponse<>("Webinar marked as completed", null)
        );
    }
    
    @GetMapping("/{webinarId}/attendance")
    @PreAuthorize("hasAnyRole('TRAINING_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Get webinar attendance report")
    public ResponseEntity<ApiResponse<Object>> getAttendanceReport(@PathVariable Long webinarId) {
        Object report = webinarService.getAttendanceReport(webinarId);
        return ResponseEntity.ok(new ApiResponse<>("Attendance report", report));
    }
}