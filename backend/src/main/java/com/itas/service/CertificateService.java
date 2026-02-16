package com.itas.service;

import com.itas.model.Certificate;
import com.itas.model.Course;
import com.itas.model.User;
import com.itas.repository.CertificateRepository;
import com.itas.repository.CourseRepository;
import com.itas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CertificateService {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    public List<Certificate> getUserCertificates(Long userId) {
        return certificateRepository.findByUserId(userId);
    }
    
    public Certificate getCertificateById(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
    }
    
    @Transactional
    public Certificate generateCertificate(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if certificate already exists
        if (certificateRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
            throw new RuntimeException("Certificate already exists for this course");
        }
        
        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setCourse(course);
        
        // Generate unique certificate number
        String certNumber = generateCertificateNumber(userId, courseId);
        certificate.setCertificateNumber(certNumber);
        
        certificate.setIssuedAt(LocalDateTime.now());
        certificate.setValidUntil(LocalDateTime.now().plusYears(1));
        certificate.setVerified(true);
        
        return certificateRepository.save(certificate);
    }
    
    public Map<String, Object> verifyCertificate(String certificateNumber) {
        Certificate certificate = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElse(null);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", certificate != null && certificate.isVerified());
        
        if (certificate != null) {
            Map<String, Object> certData = new HashMap<>();
            certData.put("certificateNumber", certificate.getCertificateNumber());
            certData.put("userName", certificate.getUser().getFullName());
            certData.put("courseName", certificate.getCourse().getTitle());
            certData.put("issuedAt", certificate.getIssuedAt());
            certData.put("validUntil", certificate.getValidUntil());
            certData.put("verified", certificate.isVerified());
            
            response.put("certificate", certData);
        }
        
        return response;
    }
    
    private String generateCertificateNumber(Long userId, Long courseId) {
        String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return String.format("ITAS-CERT-%s-%s", year, uniqueId);
    }
    
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }
    
    @Transactional
    public void revokeCertificate(Long id) {
        Certificate certificate = getCertificateById(id);
        certificate.setVerified(false);
        certificateRepository.save(certificate);
    }
}
