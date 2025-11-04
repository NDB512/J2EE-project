package com.example.profile.Api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.profile.Dto.DoctorDropdown;
import com.example.profile.Dto.DoctorDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Service.DoctorService;

@RestController
@RequestMapping("/profile/doctor")
public class DoctorAPI {
    @Autowired
    private DoctorService DoctorService;

    @PostMapping("/add")
    public ResponseEntity<Long> addDoctor(@RequestBody DoctorDto Doctor) throws PrException {
        return new ResponseEntity<>(DoctorService.addDoctor(Doctor), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Long id) throws PrException {
        return new ResponseEntity<>(DoctorService.getDoctorById(id), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DoctorDto> updateDoctor(@PathVariable Long id, @RequestBody DoctorDto doctor) throws PrException {
        return new ResponseEntity<>(DoctorService.updateDoctor(id, doctor), HttpStatus.OK);
    }

    @GetMapping("/exists/{id}")
    public Boolean doctorExists(@PathVariable Long id) {
        return DoctorService.doctorExists(id);
    }

    @GetMapping("/dropdowns")
    public ResponseEntity<List<DoctorDropdown>> getDoctorDropdowns() throws PrException{
        return new ResponseEntity<>(DoctorService.getDoctorDropdowns(), HttpStatus.OK);
    }

    @GetMapping("/getDoctorsById")
    public ResponseEntity<List<DoctorDropdown>> getDoctorsById(@RequestParam List<Long> ids) throws PrException{
        return new ResponseEntity<>(DoctorService.getDoctorsById(ids), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() throws PrException {
        return new ResponseEntity<>(DoctorService.getAllDoctors(), HttpStatus.OK);
    }
}
