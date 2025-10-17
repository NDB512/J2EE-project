package com.example.appointment.Service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.appointment.Clients.ProfileClient;
import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Dto.DoctorDto;
import com.example.appointment.Dto.PatientDto;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Models.Appointment;
import com.example.appointment.Repository.AppointmentRepository;
import com.example.appointment.Service.AppointmentService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository repository;

    @Autowired
    private ProfileClient profileClient;

    private AppointmentDto toDto(Appointment entity) {
        AppointmentDto dto = new AppointmentDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    private Appointment toEntity(AppointmentDto dto) {
        Appointment entity = new Appointment();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }
    
    @Override
    public List<AppointmentDto> getAllAppointments() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AppointmentDto> getAppointmentById(Long id) {
        return repository.findById(id).map(this::toDto);
    }

    @Override
    public List<AppointmentDto> getByPatient(Long patientId) {
        return repository.findByPatientId(patientId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getByDoctor(Long doctorId) {
        return repository.findByDoctorId(doctorId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDto createAppointment(AppointmentDto dto) throws ApException {
        Boolean doctorExists = profileClient.doctorExists(dto.getDoctorId());
        Boolean patientExists = profileClient.patientExists(dto.getPatientId());

        if (doctorExists == null || !doctorExists) {
            throw new ApException("Bác sĩ với ID " + dto.getDoctorId() + " không tồn tại.");
        }
        if(patientExists == null || !patientExists) {
            throw new ApException("Bệnh nhân với ID " + dto.getPatientId() + " không tồn tại.");
        }

        Appointment entity = toEntity(dto);
        if (entity.getStatus() == null)
            entity.setStatus(AppointmentStatus.PENDING);
        Appointment saved = repository.save(entity);
        return toDto(saved);
    }

    @Override
    public AppointmentDto updateAppointment(Long id, AppointmentDto dto) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn ID: " + id));

        existing.setAppointmentDate(dto.getAppointmentDate());
        existing.setReason(dto.getReason());
        existing.setNotes(dto.getNotes());

        Appointment saved = repository.save(existing);
        return toDto(saved);
    }

    @Override
    public AppointmentDto updateStatus(Long id, AppointmentStatus newStatus) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn ID: " + id));
        existing.setStatus(newStatus);
        return toDto(repository.save(existing));
    }

    @Override
    public void deleteAppointment(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy cuộc hẹn ID: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public AppointmentDetails getAppointmentDetailsWithName(Long id) throws ApException {
        AppointmentDto dto = this.getAppointmentById(id)
                .orElseThrow(() -> new ApException("Không tìm thấy cuộc hẹn ID: " + id));
        
        DoctorDto doctor = profileClient.getDoctorById(dto.getDoctorId());
        if (doctor == null) {
            throw new ApException("Không tìm thấy bác sĩ với ID: " + dto.getDoctorId());
        }

        PatientDto patient = profileClient.getPatientById(dto.getPatientId());
        if (patient == null) {
            throw new ApException("Không tìm thấy bệnh nhân với ID: " + dto.getPatientId());
        }

        return new AppointmentDetails(
            dto.getId(),
            dto.getPatientId(),
            patient.getName(),
            dto.getDoctorId(),
            doctor.getName(),
            dto.getAppointmentDate(),
            dto.getReason(),
            dto.getNotes(),
            dto.getStatus(),
            dto.getLocation()
        );
    }
}