package com.example.profile.Config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final InternalRequestFilter internalRequestFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, InternalRequestFilter internalRequestFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.internalRequestFilter = internalRequestFilter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .addFilterBefore(internalRequestFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(jwtAuthenticationFilter, InternalRequestFilter.class)

            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/actuator/**",
                    "/profile/patient/add",
                    "/profile/doctor/add",
                    "/profile/pharmacy/add"
                ).permitAll()

                // Cho phép request nội bộ (có header secret)
                .requestMatchers("/profile/**").access((auth, context) -> {
                    HttpServletRequest req = context.getRequest();
                    Boolean isInternal = (Boolean) req.getAttribute("isInternal");

                    // Nếu là request nội bộ hoặc user có JWT (đã được JwtAuthenticationFilter xác thực)
                    boolean isAuthenticated = auth.get().isAuthenticated();
                    boolean allowed = Boolean.TRUE.equals(isInternal) || isAuthenticated;

                    return new AuthorizationDecision(allowed);
                })
            );

        return http.build();
    }
}
