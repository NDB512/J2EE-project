package com.example.backend.Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.backend.Config.FeignInternalInterceptorConfig;
import com.example.backend.Dto.UserDto;



@FeignClient(name = "profile", configuration = FeignInternalInterceptorConfig.class)
public interface ProfileClient {
    @PostMapping("/profile/doctor/add")
    Long addDoctor(@RequestBody UserDto userDto);

    @PostMapping("/profile/pharmacy/add")
    Long addPharmacy(@RequestBody UserDto userDto);

    @PostMapping("/profile/patient/add")
    Long addPatient(@RequestBody UserDto userDto);
}
