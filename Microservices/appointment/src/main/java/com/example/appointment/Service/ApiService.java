package com.example.appointment.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.appointment.Dto.DoctorDto;
import com.example.appointment.Dto.PatientDto;

import reactor.core.publisher.Mono;

@Service
public class ApiService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ApiService.class);

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${internal.secret}")
    private String internalSecret;

    public Mono<Boolean> doctorExists(Long id) {
    String url = "http://localhost:9100/profile/doctor/exists/" + id;
    System.out.println("🔍 Calling: " + url);
    return webClientBuilder.build()
        .get()
        .uri(url)
        .header("X-Internal-Secret", internalSecret)
        .retrieve()
        .onStatus(HttpStatusCode::is4xxClientError, res -> {
            System.err.println("❌ 4xx error calling ProfileMS");
            return Mono.error(new RuntimeException("ProfileMS 4xx error"));
        })
        .onStatus(HttpStatusCode::is5xxServerError, res -> {
            System.err.println("❌ 5xx error calling ProfileMS");
            return Mono.error(new RuntimeException("ProfileMS 5xx error"));
        })
        .bodyToMono(Boolean.class)
        .doOnNext(res -> System.out.println("✅ Doctor exists: " + res))
        .doOnError(err -> System.err.println("❌ Exception: " + err.getMessage()))
        .onErrorReturn(false);
    }


    public Mono<Boolean> patientExists(Long id) {
        return webClientBuilder.build()
            .get()
            .uri("http://localhost:9100/profile/patient/exists/" + id)
            .header("X-Internal-Secret", internalSecret)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, res -> Mono.error(new RuntimeException("ProfileMS 4xx error")))
            .onStatus(HttpStatusCode::is5xxServerError, res -> Mono.error(new RuntimeException("ProfileMS 5xx error")))
            .bodyToMono(Boolean.class)
            .onErrorReturn(false);
    }

    public Mono<DoctorDto> getDoctorById(Long id) {
        return webClientBuilder.build()
            .get()
            .uri("http://localhost:9100/profile/doctor/get/" + id)
            .header("X-Internal-Secret", internalSecret)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, res -> Mono.error(new RuntimeException("ProfileMS 4xx error")))
            .onStatus(HttpStatusCode::is5xxServerError, res -> Mono.error(new RuntimeException("ProfileMS 5xx error")))
            .bodyToMono(DoctorDto.class)
            .onErrorResume(e -> {
                log.error("Error calling Profile service: {}", e.getMessage());
                return Mono.just(new DoctorDto());
            });
    }

   public Mono<PatientDto> getPatientById(Long id) {
        return webClientBuilder.build()
            .get()
            .uri("http://localhost:9100/profile/patient/get/" + id)
            .header("X-Internal-Secret", internalSecret)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, res -> Mono.error(new RuntimeException("ProfileMS 4xx error")))
            .onStatus(HttpStatusCode::is5xxServerError, res -> Mono.error(new RuntimeException("ProfileMS 5xx error")))
            .bodyToMono(PatientDto.class)
            .onErrorResume(e -> {
                log.error("Error calling Profile service: {}", e.getMessage());
                return Mono.just(new PatientDto());
            });
    }
}