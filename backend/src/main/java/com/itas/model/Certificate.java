package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String certificateId;
    private String certificateNumber;
    private String verificationCode;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    private LocalDateTime issuedAt = LocalDateTime.now();
    private LocalDateTime issuedDate;
    private LocalDateTime validUntil;
    private String downloadUrl;
    private boolean verified = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCertificateId() { return certificateId; }
    public void setCertificateId(String certificateId) { this.certificateId = certificateId; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
    public LocalDateTime getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDateTime issuedDate) { this.issuedDate = issuedDate; }
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
