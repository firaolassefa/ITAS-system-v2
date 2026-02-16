package com.itas.repository;

import com.itas.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUserId(Long userId);
    Optional<Certificate> findByCertificateId(String certificateId);
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    // Dashboard methods
    long countByUserId(Long userId);
}
