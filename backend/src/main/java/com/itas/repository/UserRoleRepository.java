package com.itas.repository;

import com.itas.model.User;
import com.itas.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByRoleName(String roleName);
    List<UserRole> findByUser(User user);
    List<UserRole> findByUserId(Long userId);
    boolean existsByUserIdAndRoleName(Long userId, String roleName);
}