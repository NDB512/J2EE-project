// package com.example.gateway;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
// import org.springframework.web.cors.reactive.CorsWebFilter;

// import java.util.List;

// @Configuration
// public class CorsGlobalConfiguration {

//     @Bean
//     public CorsWebFilter corsWebFilter() {
//         CorsConfiguration config = new CorsConfiguration();
//         config.setAllowCredentials(true);
//         config.setAllowedOrigins(List.of("http://localhost:4173", "http://localhost:5173"));
//         config.addAllowedHeader("*");
//         config.addAllowedMethod("*");
//         config.addExposedHeader("Authorization");

//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config);
//         return new CorsWebFilter(source);
//     }
// }