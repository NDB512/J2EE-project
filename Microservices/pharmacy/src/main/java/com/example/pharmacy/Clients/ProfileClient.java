package com.example.pharmacy.Clients;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.pharmacy.Config.FeignInternalInterceptorConfig;

@FeignClient(name = "appointment", configuration = FeignInternalInterceptorConfig.class)
public interface ProfileClient {
    @GetMapping("/appointment/report/prescriptions/markSold/{id}")
    public ResponseEntity<String> markPrescriptionSold(@PathVariable Long id);
}
