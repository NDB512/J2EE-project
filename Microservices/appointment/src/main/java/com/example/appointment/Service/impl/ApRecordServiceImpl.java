package com.example.appointment.Service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.appointment.Clients.ProfileClient;
import com.example.appointment.Dto.ApRecordDto;
import com.example.appointment.Dto.DoctorName;
import com.example.appointment.Dto.RecordDetail;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Models.ApRecord;
import com.example.appointment.Models.Appointment;
import com.example.appointment.Repository.ApRecordRepository;
import com.example.appointment.Repository.AppointmentRepository;
import com.example.appointment.Service.ApRecordService;
import com.example.appointment.Service.PrescriptionService;
import com.example.appointment.Utilities.StringListCoverter;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ApRecordServiceImpl implements ApRecordService{

    private final ApRecordRepository apRecordRepository;

    private final PrescriptionService prescriptionService;

    private final AppointmentRepository appointmentRepository;

    private final ProfileClient profileClient;

    @Override
    public Long createApRecorad(ApRecordDto apRecordDto) throws ApException {
        Optional<ApRecord> existingRecord = apRecordRepository.findByAppointment_Id(apRecordDto.getAppointmentId());

        if (existingRecord.isPresent()) {
            throw new ApException("Cuộc hẹn này đã có hồ sơ khám!");
        }

        // Chuyển DTO sang entity
        ApRecord apRecord = apRecordDto.toEntity();
        apRecord.setCreatedAt(LocalDateTime.now());

        // Lấy reference đến Appointment đã tồn tại
        Appointment appointment = appointmentRepository.getReferenceById(apRecordDto.getAppointmentId());
        apRecord.setAppointment(appointment);

        // Lưu hồ sơ khám
        Long id = apRecordRepository.save(apRecord).getId();

        // Nếu có đơn thuốc thì lưu
        if (apRecordDto.getPrescriptionDto() != null) {
            apRecordDto.getPrescriptionDto().setAppointmentId(apRecordDto.getAppointmentId());
            prescriptionService.savePrescription(apRecordDto.getPrescriptionDto());
        }
        return id;
    }


    @Override
    public void updateApRecorad(ApRecordDto apRecordDto) throws ApException {
        ApRecord existingRecord = apRecordRepository.findById(apRecordDto.getId()).orElseThrow(()->new ApException("Không tìm thấy hồ sơ khám!"));

        existingRecord.setNotes(apRecordDto.getNotes());
        existingRecord.setDiagnosis(apRecordDto.getDiagnosis());
        existingRecord.setFollowUpDate(apRecordDto.getFollowUpDate());
        existingRecord.setSymptoms(StringListCoverter.coverterListToString(apRecordDto.getSymptoms()));
        existingRecord.setReferal(apRecordDto.getReferal());
        existingRecord.setTests(StringListCoverter.coverterListToString(apRecordDto.getTests()));
        existingRecord.setUpdateAt(LocalDateTime.now());
        apRecordRepository.save(existingRecord);
    }

    @Override
    public ApRecordDto getApRecordByAppointmentId(Long appointmentId) throws ApException {
        return apRecordRepository.findByAppointment_Id(appointmentId).orElseThrow(()->new ApException("Không tìm thấy hồ sơ khám!")).toDto();
    }

    @Override
    public ApRecordDto getApRecordById(Long recordId) throws ApException{
        return apRecordRepository.findById(recordId).orElseThrow(()->new ApException("Không tìm thấy hồ sơ khám!")).toDto();
    }

    @Override
    public ApRecordDto getApRecordDetailsByAppointmentId(Long appointmentId) throws ApException {
        ApRecordDto apRecordDto = apRecordRepository.findByAppointment_Id(appointmentId).orElseThrow(()->new ApException("Không tìm thấy hồ sơ khám!")).toDto();

        apRecordDto.setPrescriptionDto(prescriptionService.getPrescriptionByAppointmentId(appointmentId));

        return apRecordDto;
    }


    @Override
    public List<RecordDetail> getApRecordByPatientId(Long patientId) throws ApException {
        List<ApRecord> records = apRecordRepository.findByPatientId(patientId);

        List<RecordDetail> recordDetails = records.stream().map(ApRecord::toRecordDetail).toList();

        List<Long> doctorIds = recordDetails.stream().map(RecordDetail::getDoctorId).toList();

        List<DoctorName> doctorNames = profileClient.getDoctorsById(doctorIds);

        Map<Long, String> doctorMap = doctorNames.stream().collect(Collectors.toMap(DoctorName::getId, DoctorName::getName));

        recordDetails.forEach(record -> {String doctorName = doctorMap.get(record.getDoctorId()); 
            if(doctorName != null){
                record.setDoctorName(doctorName);
            } else {
                record.setDoctorName("Lỗi lấy tên bác sĩ");
            }
        });

        return recordDetails;
    }


    @Override
    public Boolean isRecordExists(Long appointmentId) throws ApException {
        return apRecordRepository.existsByAppointment_Id(appointmentId);
    }
}
