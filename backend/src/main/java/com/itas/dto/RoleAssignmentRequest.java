package com.itas.dto;

import jakarta.validation.constraints.NotNull;

public class RoleAssignmentRequest {
    
    @NotNull(message = "Role ID is required")
    private Long roleId;

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }
}