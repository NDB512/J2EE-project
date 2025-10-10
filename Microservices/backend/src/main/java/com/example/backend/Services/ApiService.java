package com.example.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.example.backend.Dto.Roles;
import com.example.backend.Dto.UserDto;
import reactor.core.publisher.Mono;

@Service
public class ApiService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ApiService.class);

    @Autowired
    private WebClient.Builder webClientBuilder;

    public Mono<Long> addProfile(UserDto userDto, String token) {
        String uri;
        if (userDto.getRole().equals(Roles.Doctor)) {
            uri = "http://localhost:9100/profile/doctor/add";
        } else if (userDto.getRole().equals(Roles.Pharmacy)) {
            uri = "http://localhost:9100/profile/pharmacy/add";
        } else if (userDto.getRole().equals(Roles.Patient)) {
            uri = "http://localhost:9100/profile/patient/add";
        } else {
            return Mono.error(new IllegalArgumentException("Invalid role"));
        }

        WebClient client = webClientBuilder.build();
        return client.post()
            .uri(uri)
            .header(HttpHeaders.AUTHORIZATION, token != null ? "Bearer " + token : null)
            .body(Mono.just(userDto), UserDto.class)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, res -> 
                res.bodyToMono(String.class).doOnNext(err -> log.error("ProfileMS 4xx: {}", err)).then(Mono.error(new RuntimeException("Validation failed"))))
            .onStatus(HttpStatusCode::is5xxServerError, res -> 
                res.bodyToMono(String.class).doOnNext(err -> log.error("ProfileMS 5xx: {}", err)).then(Mono.error(new RuntimeException("Server error"))))
            .bodyToMono(Long.class)
            .doOnError(e -> log.error("WebClient error: {}", e.getMessage()))
            .onErrorReturn(-1L);
    }
}