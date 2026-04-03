package com.itas.security;

import com.itas.model.User;
import com.itas.model.UserRole;
import com.itas.repository.UserRepository;
import com.itas.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (!user.isActive()) {
            throw new UsernameNotFoundException("User account is disabled: " + username);
        }

        List<UserRole> userRoles = userRoleRepository.findByUserId(user.getId());
        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name()));

        // TAX_AGENT gets full portal access same as legacy TAXPAYER role
        if (user.getUserType() == com.itas.model.UserType.TAX_AGENT) {
            authorities.add(new SimpleGrantedAuthority("ROLE_TAXPAYER"));
        }

        for (UserRole role : userRoles) {
            if (role.getRoleName() != null) {
                authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
            }
            if (role.getPermissions() != null && !role.getPermissions().isEmpty()) {
                for (String permission : role.getPermissions().split(",")) {
                    authorities.add(new SimpleGrantedAuthority(permission.trim()));
                }
            }
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(!user.isActive())
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
}
