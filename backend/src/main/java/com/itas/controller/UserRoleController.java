package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.dto.RoleAssignmentRequest;
import com.itas.model.User;
import com.itas.model.UserRole;
import com.itas.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/roles")
public class UserRoleController {
    
    @Autowired
    private RoleService roleService;
    
    @GetMapping("")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> getAllRoles() {
        List<UserRole> roles = roleService.getAllRoles();
        return ResponseEntity.ok(new ApiResponse<>("Roles retrieved", roles));
    }
    
    @PostMapping("")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> createRole(@RequestBody UserRole role) {
        UserRole createdRole = roleService.createRole(role);
        return ResponseEntity.ok(new ApiResponse<>("Role created", createdRole));
    }
    
    @PutMapping("/{roleId}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> updateRole(@PathVariable Long roleId, @RequestBody UserRole roleUpdates) {
        UserRole updatedRole = roleService.updateRole(roleId, roleUpdates);
        return ResponseEntity.ok(new ApiResponse<>("Role updated", updatedRole));
    }
    
    @DeleteMapping("/{roleId}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.ok(new ApiResponse<>("Role deleted", null));
    }
    
    @PostMapping("/users/{userId}/assign")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> assignRoleToUser(
            @PathVariable Long userId,
            @RequestBody RoleAssignmentRequest request) {
        
        roleService.assignRoleToUser(userId, request.getRoleId());
        return ResponseEntity.ok(new ApiResponse<>("Role assigned to user", null));
    }
}