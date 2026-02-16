package com.itas.service;

import com.itas.dto.WebinarRequest;
import com.itas.model.User;
import com.itas.model.Webinar;
import com.itas.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WebinarService {
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }
    
    public Page<Webinar> getWebinars(String status, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        // For now, return all webinars paginated
        // In a real implementation, you would filter by status and dates
        return webinarRepository.findAll(pageable);
    }
    
    public Webinar getWebinarById(Long id) {
        return webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found with id: " + id));
    }
    
    public List<Webinar> getUpcomingWebinars(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return webinarRepository.findUpcomingWebinars(pageable);
    }
    
    @Transactional
    public Webinar scheduleWebinar(WebinarRequest request, User creator) {
        Webinar webinar = new Webinar();
        webinar.setTitle(request.getTitle());
        webinar.setDescription(request.getDescription());
        webinar.setScheduleTime(request.getScheduleTime());
        webinar.setDurationMinutes(request.getDurationMinutes());
        webinar.setPresenters(request.getPresenters());
        webinar.setMaxAttendees(request.getMaxAttendees());
        webinar.setTargetAudience(request.getTargetAudience());
        webinar.setMeetingLink(request.getMeetingLink());
        webinar.setCreatedBy(creator);
        webinar.setCreatedAt(LocalDateTime.now());
        webinar.setStatus("SCHEDULED");
        webinar.setRegistrationOpen(true);
        webinar.setRegisteredCount(0);
        
        return webinarRepository.save(webinar);
    }
    
    @Transactional
    public Webinar updateWebinar(Long id, Webinar webinarDetails) {
        Webinar webinar = getWebinarById(id);
        
        webinar.setTitle(webinarDetails.getTitle());
        webinar.setDescription(webinarDetails.getDescription());
        webinar.setScheduleTime(webinarDetails.getScheduleTime());
        webinar.setDurationMinutes(webinarDetails.getDurationMinutes());
        webinar.setPresenters(webinarDetails.getPresenters());
        webinar.setMaxAttendees(webinarDetails.getMaxAttendees());
        webinar.setTargetAudience(webinarDetails.getTargetAudience());
        webinar.setMeetingLink(webinarDetails.getMeetingLink());
        
        return webinarRepository.save(webinar);
    }
    
    @Transactional
    public void registerForWebinar(Long webinarId, User user) {
        Webinar webinar = getWebinarById(webinarId);
        
        if (!webinar.isRegistrationOpen()) {
            throw new RuntimeException("Registration is closed for this webinar");
        }
        
        if (webinar.getRegisteredCount() >= webinar.getMaxAttendees()) {
            throw new RuntimeException("Webinar is full");
        }
        
        // Increment registered count
        webinar.setRegisteredCount(webinar.getRegisteredCount() + 1);
        webinarRepository.save(webinar);
    }
    
    public Page<User> getWebinarRegistrations(Long webinarId, Pageable pageable) {
        // In a real implementation, you would have a WebinarRegistration entity
        // For now, return empty page
        return Page.empty(pageable);
    }
    
    @Transactional
    public void startWebinar(Long id, User user) {
        Webinar webinar = getWebinarById(id);
        webinar.setStatus("LIVE");
        webinarRepository.save(webinar);
    }
    
    @Transactional
    public void completeWebinar(Long id, User user) {
        Webinar webinar = getWebinarById(id);
        webinar.setStatus("COMPLETED");
        webinar.setRegistrationOpen(false);
        webinarRepository.save(webinar);
    }
    
    public Object getAttendanceReport(Long webinarId) {
        Webinar webinar = getWebinarById(webinarId);
        
        Map<String, Object> report = new HashMap<>();
        report.put("webinarId", webinar.getId());
        report.put("title", webinar.getTitle());
        report.put("scheduleTime", webinar.getScheduleTime());
        report.put("registeredCount", webinar.getRegisteredCount());
        report.put("maxAttendees", webinar.getMaxAttendees());
        report.put("status", webinar.getStatus());
        
        return report;
    }
    
    @Transactional
    public void cancelWebinar(Long id, String reason) {
        Webinar webinar = getWebinarById(id);
        webinar.setStatus("CANCELLED");
        webinar.setRegistrationOpen(false);
        webinarRepository.save(webinar);
    }
    
    @Transactional
    public void deleteWebinar(Long id) {
        Webinar webinar = getWebinarById(id);
        webinarRepository.delete(webinar);
    }
}
