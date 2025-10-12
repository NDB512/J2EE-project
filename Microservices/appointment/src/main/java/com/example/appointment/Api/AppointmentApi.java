package com.example.appointment.Api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentApi {

    @Autowired
    private AppointmentService service;

    @GetMapping
    public List<AppointmentDto> getAll() {
        return service.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getById(@PathVariable Long id) {
        return service.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentDto> getByPatient(@PathVariable Long patientId) {
        return service.getByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentDto> getByDoctor(@PathVariable Long doctorId) {
        return service.getByDoctor(doctorId);
    }

    @PostMapping
    public AppointmentDto create(@RequestBody AppointmentDto dto) {
        return service.createAppointment(dto);
    }

    @PutMapping("/{id}")
    public AppointmentDto update(@PathVariable Long id, @RequestBody AppointmentDto dto) {
        return service.updateAppointment(id, dto);
    }

    @PatchMapping("/{id}/status")
    public AppointmentDto updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteAppointment(id);
    }
}
