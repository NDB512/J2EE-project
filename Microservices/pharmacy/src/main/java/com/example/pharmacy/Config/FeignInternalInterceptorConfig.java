package com.example.pharmacy.Config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignInternalInterceptorConfig {

    @Value("${internal.secret}")
    private String internalSecret;

    @Bean
    public RequestInterceptor internalRequestInterceptor() {
        return template -> {
            template.header("X-Internal-Secret", internalSecret);
        };
    }
}
