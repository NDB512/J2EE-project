package com.example.appointment.Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.appointment.Config.FeignInternalInterceptorConfig;
import com.example.appointment.Dto.DoctorDto;
import com.example.appointment.Dto.PatientDto;

@FeignClient(name = "profile", configuration = FeignInternalInterceptorConfig.class)
public interface ProfileClient {

    @GetMapping("/profile/doctor/exists/{id}")
    Boolean doctorExists(@PathVariable("id") Long id);

    @GetMapping("/profile/patient/exists/{id}")
    Boolean patientExists(@PathVariable("id") Long id);

    @GetMapping("/profile/doctor/get/{id}")
    DoctorDto getDoctorById(@PathVariable("id") Long id);

    @GetMapping("/profile/patient/get/{id}")
    PatientDto getPatientById(@PathVariable("id") Long id);
}
