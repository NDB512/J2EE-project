package com.example.appointment.Service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.example.appointment.Clients.ProfileClient;
import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Dto.DoctorDto;
import com.example.appointment.Dto.MonthlyVisitDto;
import com.example.appointment.Dto.PatientDto;
import com.example.appointment.Dto.ReasonCountDto;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Models.Appointment;
import com.example.appointment.Repository.AppointmentRepository;
import com.example.appointment.Service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;

    private final ProfileClient profileClient;

    private AppointmentDto toDto(Appointment entity) {
        if (entity == null) {
            throw new IllegalArgumentException("Entity cannot be null");
        }
        AppointmentDto dto = new AppointmentDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    private Appointment toEntity(AppointmentDto dto) {
        Appointment entity = new Appointment();
        if (dto == null) {
            throw new IllegalArgumentException("Dto cannot be null");
        }
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
        if (id == null) {
            return Optional.empty();
        }
        return repository.findById(id).map(this::toDto);
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
        if (id == null) {
            throw new IllegalArgumentException("ID không được null");
        }
        // Explicit null check for id to satisfy @NonNull contract
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn ID: " + id));

        existing.setAppointmentDate(dto.getAppointmentDate());
        existing.setReason(dto.getReason());
        existing.setNotes(dto.getNotes());

        Appointment saved = repository.save(existing);
        return toDto(saved);
    }

    @Override
    public AppointmentDto updateStatus(Long id, AppointmentStatus newStatus, String reason, LocalDateTime newDateTime) throws ApException {
        if (id == null) {
            throw new IllegalArgumentException("ID không được null");
        }
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new ApException("Không tìm thấy cuộc hẹn ID: " + id));

        AppointmentStatus currentStatus = existing.getStatus();

        // Kiểm tra trạng thái hợp lệ
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new ApException("Không thể chuyển từ " + currentStatus + " sang " + newStatus);
        }

        // Nếu hủy hoặc đổi lịch → bắt buộc nhập lý do
        if ((newStatus == AppointmentStatus.CANCELLED || newStatus == AppointmentStatus.RESCHEDULED)
                && (reason == null || reason.trim().isEmpty())) {
            throw new ApException("Cần nhập lý do khi hủy hoặc đổi lịch cuộc hẹn");
        }

        // Nếu đổi lịch → cần ngày giờ mới
        if (newStatus == AppointmentStatus.RESCHEDULED) {
            if (newDateTime == null) {
                throw new ApException("Vui lòng chọn ngày và giờ hẹn mới");
            }
            if (newDateTime.isBefore(LocalDateTime.now())) {
                throw new ApException("Không thể chọn ngày giờ trong quá khứ");
            }

            existing.setAppointmentDate(newDateTime);
        }

        // Nếu bác sĩ xác nhận lịch → tự động cập nhật nơi khám
        if (newStatus == AppointmentStatus.SCHEDULED) {
            DoctorDto doctor = profileClient.getDoctorById(existing.getDoctorId());
            if (doctor == null) {
                throw new ApException("Không tìm thấy bác sĩ với ID: " + existing.getDoctorId());
            }

            String location = doctor.getHospitalName();
            if (doctor.getDepartment() != null && !doctor.getDepartment().isEmpty()) {
                location += " - " + doctor.getDepartment();
            }

            existing.setLocation(location);
        }

        // Nếu hoàn thành → cập nhật thời gian hoàn thành
        if (newStatus == AppointmentStatus.COMPLETED) {
            existing.setCompletedAt(LocalDateTime.now());
        }

        existing.setStatus(newStatus);
        existing.setStatusReason(reason);

        existing = repository.save(existing);
        return toDto(existing);
    }


    /**
     * Kiểm tra xem có được phép chuyển trạng thái không.
     */
    private boolean isValidStatusTransition(AppointmentStatus current, AppointmentStatus target) {
        switch (current) {
            case PENDING:
                return target == AppointmentStatus.SCHEDULED ||
                    target == AppointmentStatus.CANCELLED;
            case SCHEDULED:
                return target == AppointmentStatus.RESCHEDULED ||
                    target == AppointmentStatus.COMPLETED ||
                    target == AppointmentStatus.CANCELLED ||
                    target == AppointmentStatus.NO_SHOW;
            case RESCHEDULED:
                return target == AppointmentStatus.SCHEDULED ||
                    target == AppointmentStatus.CANCELLED;
            case COMPLETED:
            case CANCELLED:
            case NO_SHOW:
                // Các trạng thái kết thúc không thể thay đổi
                return false;
            default:
                return false;
        }
    }

    @Override
    public void deleteAppointment(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID không được null");
        }
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
            dto.getLocation(),
            dto.getStatusReason(),
            dto.getCompletedAt(),
            dto.getCancelledAt()
        );
    }

    @Override
    public List<AppointmentDetails> getAllAppointmentsByPatientId(Long patientId) throws ApException {
        return repository.findAllByPatientId(patientId).stream()
            .map(appointment -> {
                try {
                    DoctorDto doctorDTO = profileClient.getDoctorById(appointment.getDoctorId());
                    appointment.setDoctorName(doctorDTO.getName());
                } catch (Exception e) {
                    appointment.setDoctorName("Không xác định");
                }
                return appointment;
            })
            .toList();
    }

    @Override
    public List<AppointmentDetails> getAllAppointmentsByDoctorId(Long doctorId) throws ApException {
        return repository.findAllByDoctorId(doctorId).stream()
            .map(appointment -> {
                try {
                    PatientDto DTO = profileClient.getPatientById(appointment.getDoctorId());
                    appointment.setPatientName(DTO.getName());
                } catch (Exception e) {
                    appointment.setPatientName("Không xác định");
                }
                return appointment;
            })
            .toList();
    }

   @Override
    public void cancelAppointment(Long id, String reason) {
        if (id == null) {
            throw new IllegalArgumentException("ID không được null");
        }
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn ID: " + id));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Không thể hủy cuộc hẹn đã hoàn thành!");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Cần nhập lý do khi hủy cuộc hẹn!");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setStatusReason(reason);
        appointment.setCancelledAt(LocalDateTime.now());

        repository.save(appointment);
    }

    @Override
    public List<MonthlyVisitDto> getAppointmentCountByPatient(Long patientId) throws ApException {
            try {
                List<MonthlyVisitDto> visitCounts = repository.countCurrentYearVisitsByPatient(patientId);
                return visitCounts;
            } catch (Exception e) {
                throw new ApException("Lỗi khi lấy số lượng cuộc hẹn hàng tháng: " + e.getMessage());
            }
    }

    @Override
    public List<MonthlyVisitDto> getAppointmentCountByDoctor(Long doctorId) throws ApException {
        try {
            List<MonthlyVisitDto> visitCounts = repository.countCurrentYearVisitsByDoctor(doctorId);
            return visitCounts;
        } catch (Exception e) {
            throw new ApException("Lỗi khi lấy số lượng cuộc hẹn hàng tháng: " + e.getMessage());
        }
    }

    @Override
    public List<MonthlyVisitDto> getAppointmentCount() throws ApException {
        try {
            List<MonthlyVisitDto> visitCounts = repository.countAllVisits();
            return visitCounts;
        } catch (Exception e) {
            throw new ApException("Lỗi khi lấy số lượng cuộc hẹn hàng tháng: " + e.getMessage());
        }
    }

    @Override
    public List<ReasonCountDto> getReasonsCountByPatient(Long patientId) throws ApException {
        try {
            List<ReasonCountDto> reasonCounts = repository.countReasonsByPatient(patientId);
            return reasonCounts;
        } catch (Exception e) {
            throw new ApException("Lỗi khi lấy số lượng lý do cuộc hẹn: " + e.getMessage());
        }
    }

    @Override
    public List<ReasonCountDto> getReasonsCountByDoctor(Long doctorId) throws ApException {
        try {
            List<ReasonCountDto> reasonCounts = repository.countReasonsByDoctor(doctorId);
            return reasonCounts;
        } catch (Exception e) {
            throw new ApException("Lỗi khi lấy số lượng lý do cuộc hẹn: " + e.getMessage());
        }
    }

    @Override
    public List<ReasonCountDto> getReasonsCountForAll() throws ApException {
        try {
            List<ReasonCountDto> reasonCounts = repository.countReasonsForAll();
            return reasonCounts;
        } catch (Exception e) {
            throw new ApException("Lỗi khi lấy số lượng lý do cuộc hẹn: " + e.getMessage());
        }
    }

    @Override
    public List<AppointmentDetails> getTodaysAppointments() throws ApException {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        return repository.findByAppointmentDateBetween(startOfDay, endOfDay).stream().map(appointment -> {
            DoctorDto doctorDto  = profileClient.getDoctorById(appointment.getDoctorId());
            PatientDto patientDto = profileClient.getPatientById(appointment.getPatientId());

            return new AppointmentDetails(appointment.getId(), appointment.getPatientId(), 
                patientDto != null ? patientDto.getName() : "Không xác định",
                appointment.getDoctorId(),
                doctorDto != null ? doctorDto.getName() : "Không xác định",
                appointment.getAppointmentDate(),
                appointment.getReason(),
                appointment.getNotes(),
                appointment.getStatus(),
                appointment.getLocation(),
                appointment.getStatusReason(),
                appointment.getCompletedAt(),
                appointment.getCancelledAt()
            );
        }).toList();
    }
}