package com.itas.repository;

import com.itas.model.ResourceVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResourceVersionRepository extends JpaRepository<ResourceVersion, Long> {
    
    List<ResourceVersion> findByResourceIdOrderByVersionDesc(Long resourceId);
    
    Optional<ResourceVersion> findByResourceIdAndVersion(Long resourceId, Integer version);
    
    Optional<ResourceVersion> findTopByResourceIdOrderByVersionDesc(Long resourceId);
}