package com.itas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserType userType = UserType.TAX_AGENT;

    // Role relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user", "assignedBy"})
    private UserRole role;

    private String taxNumber;

    private String companyName;

    @Column(name = "tin_number", unique = true)
    private String tinNumber;

    @Column(name = "tin_verified")
    private boolean tinVerified = false;

    @Column(name = "taxpayer_type")
    private String taxpayerType;

    @Column(name = "region")
    private String region;

    // âœ… ADDED phoneNumber field
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // ==============================
    // Constructors
    // ==============================

    public User() {}

    public User(String username, String password, String fullName, String email, UserType userType) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.userType = userType;
    }

    // ==============================
    // Getters and Setters
    // ==============================

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getUsername() { 
        return username; 
    }

    public void setUsername(String username) { 
        this.username = username; 
    }

    public String getPassword() { 
        return password; 
    }

    public void setPassword(String password) { 
        this.password = password; 
    }

    public String getFullName() { 
        return fullName; 
    }

    public void setFullName(String fullName) { 
        this.fullName = fullName; 
    }

    public String getEmail() { 
        return email; 
    }

    public void setEmail(String email) { 
        this.email = email; 
    }

    public UserType getUserType() { 
        return userType; 
    }

    public void setUserType(UserType userType) { 
        this.userType = userType; 
    }

    public UserRole getRole() { 
        return role; 
    }

    public void setRole(UserRole role) { 
        this.role = role; 
    }

    public String getTaxNumber() { 
        return taxNumber; 
    }

    public void setTaxNumber(String taxNumber) { 
        this.taxNumber = taxNumber; 
    }

    public String getCompanyName() { 
        return companyName; 
    }

    public void setCompanyName(String companyName) { 
        this.companyName = companyName; 
    }

    public String getTinNumber() { return tinNumber; }
    public void setTinNumber(String tinNumber) { this.tinNumber = tinNumber; }
    public boolean isTinVerified() { return tinVerified; }
    public void setTinVerified(boolean tinVerified) { this.tinVerified = tinVerified; }
    public String getTaxpayerType() { return taxpayerType; }
    public void setTaxpayerType(String taxpayerType) { this.taxpayerType = taxpayerType; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getPhoneNumber() { 
        return phoneNumber; 
    }

    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber; 
    }

    public boolean isActive() { 
        return active; 
    }

    public void setActive(boolean active) { 
        this.active = active; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }

    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }

    public LocalDateTime getLastLogin() { 
        return lastLogin; 
    }

    public void setLastLogin(LocalDateTime lastLogin) { 
        this.lastLogin = lastLogin; 
    }
}
