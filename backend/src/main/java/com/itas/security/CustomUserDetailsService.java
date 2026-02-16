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
import java.util.stream.Collectors;

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

        // Get user roles
        List<UserRole> userRoles = userRoleRepository.findByUser(user);
        
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Add user type as a role
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name()));
        
        // Add specific permissions
        authorities.addAll(userRoles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList()));

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
