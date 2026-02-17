package com.itas.config;

import com.itas.security.JwtAuthenticationEntryPoint;
import com.itas.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - Note: Spring Security sees paths WITHOUT the servlet context path
                // So /api/auth/login is seen as /auth/login by Spring Security
                .requestMatchers("/", "/health", "/test-db", "/api/health", "/api/test-db").permitAll()
                .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api/swagger-ui/**", "/api/v3/api-docs/**").permitAll()
                
                // Public access to browse courses and resources (read-only)
                .requestMatchers(HttpMethod.GET, "/courses", "/courses/*", "/api/courses", "/api/courses/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/resources", "/resources/search", "/resources/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/resources", "/api/resources/search", "/api/resources/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/webinars", "/webinars/upcoming", "/webinars/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/webinars", "/api/webinars/upcoming", "/api/webinars/*").permitAll()
                .requestMatchers("/help/**", "/api/help/**").permitAll()
                
                // Dashboard endpoints - require authentication
                .requestMatchers("/dashboard/**", "/api/dashboard/**").authenticated()
                
                // Enrollment, progress, assessments, certificates require authentication
                .requestMatchers("/courses/enroll", "/courses/progress", "/courses/enrollments/**").authenticated()
                .requestMatchers("/api/courses/enroll", "/api/courses/progress", "/api/courses/enrollments/**").authenticated()
                .requestMatchers("/resources/*/download", "/api/resources/*/download").authenticated()
                .requestMatchers("/assessments/**", "/certificates/**").authenticated()
                .requestMatchers("/api/assessments/**", "/api/certificates/**").authenticated()
                .requestMatchers("/webinars/*/register", "/api/webinars/*/register").authenticated()
                
                // Content Management - Content Admin & System Admin
                .requestMatchers("/content/upload", "/content/update/**", "/api/content/upload", "/api/content/update/**").hasAnyRole("CONTENT_ADMIN", "SYSTEM_ADMIN")
                .requestMatchers("/content/archive/**", "/api/content/archive/**").hasAnyRole("CONTENT_ADMIN", "SYSTEM_ADMIN")
                
                // Internal Training - MOR Staff & System Admin
                .requestMatchers("/staff/internal-training/**", "/api/staff/internal-training/**").hasAnyRole("MOR_STAFF", "SYSTEM_ADMIN")
                .requestMatchers("/staff/compliance/**", "/api/staff/compliance/**").hasAnyRole("MOR_STAFF", "SYSTEM_ADMIN")
                
                // Webinar Management - Training Admin & System Admin
                .requestMatchers("/webinars/schedule", "/webinars/manage/**").hasAnyRole("TRAINING_ADMIN", "SYSTEM_ADMIN")
                .requestMatchers("/api/webinars/schedule", "/api/webinars/manage/**").hasAnyRole("TRAINING_ADMIN", "SYSTEM_ADMIN")
                
                // Notifications - Communication Officer & System Admin
                .requestMatchers("/notifications/send", "/api/notifications/send").hasAnyRole("COMM_OFFICER", "SYSTEM_ADMIN")
                
                // Analytics - Manager, Auditor & System Admin
                .requestMatchers("/analytics/**", "/api/analytics/**").hasAnyRole("MANAGER", "AUDITOR", "SYSTEM_ADMIN")
                
                // User Role Management - System Admin only
                .requestMatchers("/user-roles/**", "/api/user-roles/**").hasRole("SYSTEM_ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}