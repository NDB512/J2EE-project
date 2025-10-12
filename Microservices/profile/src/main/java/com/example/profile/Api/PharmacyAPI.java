package com.example.profile.Api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.profile.Dto.PharmacyDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Service.PharmacyService;

@RestController
@RequestMapping("/profile/pharmacy")
public class PharmacyAPI {
    @Autowired
    private PharmacyService PharmacyService;

    @PostMapping("/add")
    public ResponseEntity<Long> addPharmacy(@RequestBody PharmacyDto Pharmacy) throws PrException {
        return new ResponseEntity<>(PharmacyService.addPharmacy(Pharmacy), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PharmacyDto> getPharmacyById(@PathVariable Long id) throws PrException {
        return new ResponseEntity<>(PharmacyService.getPharmacyById(id), HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<PharmacyDto> updatePharmacy(@PathVariable Long id, @RequestBody PharmacyDto pharmacy) throws PrException {
        return new ResponseEntity<>(PharmacyService.updatePharmacy(id, pharmacy), HttpStatus.OK);
    }
}
