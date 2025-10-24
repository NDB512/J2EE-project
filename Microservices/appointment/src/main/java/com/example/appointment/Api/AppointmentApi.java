package com.example.appointment.Api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Service.AppointmentService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointment")
public class AppointmentApi {

    @Autowired
    private AppointmentService service;

    @GetMapping
    public List<AppointmentDto> getAll() {
        return service.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getById(@PathVariable Long id) throws ApException {
        return service.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDetails>> getByPatient(@PathVariable Long patientId) throws ApException {
        return new ResponseEntity<>(service.getAllAppointmentsByPatientId(patientId), HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDetails>> getByDoctor(@PathVariable Long doctorId) throws ApException {
        return new ResponseEntity<>(service.getAllAppointmentsByDoctorId(doctorId), HttpStatus.OK);
    }

    @PostMapping
    public AppointmentDto create(@RequestBody AppointmentDto dto) throws ApException {
        return service.createAppointment(dto);
    }

    @PutMapping("/{id}")
    public AppointmentDto update(@PathVariable Long id, @RequestBody AppointmentDto dto) throws ApException {
        return service.updateAppointment(id, dto);
    }

    @PatchMapping("/{id}/status")
    public AppointmentDto updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDateTime
    ) throws ApException {
        return service.updateStatus(id, status, reason, newDateTime);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getAppointmentDetailsWithName(@PathVariable Long id) throws ApException {
        return new ResponseEntity<>(service.getAppointmentDetailsWithName(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelAppointment(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        service.cancelAppointment(id, reason);
        return ResponseEntity.ok("Đã hủy cuộc hẹn ID: " + id + " - Lý do: " + reason);
    }
}
