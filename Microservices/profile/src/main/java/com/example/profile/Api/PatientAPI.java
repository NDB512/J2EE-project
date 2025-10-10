package com.example.profile.Api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Service.PatientService;

@RestController
@RequestMapping("/profile/patient")
public class PatientAPI {
    @Autowired
    private PatientService patientService;

    @PostMapping("/add")
    public ResponseEntity<Long> addPatient(@RequestBody PatientDto patient) throws PrException {
        return new ResponseEntity<>(patientService.addPaient(patient), HttpStatus.OK);
    }

    @PostMapping("/get/{id}")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable Long id) throws PrException {
        return new ResponseEntity<>(patientService.getPatientById(id), HttpStatus.OK);
    }
}
