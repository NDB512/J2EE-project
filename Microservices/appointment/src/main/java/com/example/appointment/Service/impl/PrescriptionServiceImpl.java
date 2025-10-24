package com.example.appointment.Service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.appointment.Clients.ProfileClient;
import com.example.appointment.Dto.DoctorName;
import com.example.appointment.Dto.PrescriptionDetails;
import com.example.appointment.Dto.PrescriptionDto;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Models.Prescription;
import com.example.appointment.Repository.PrescriptionRepository;
import com.example.appointment.Service.MedicineService;
import com.example.appointment.Service.PrescriptionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService{
    
    private final PrescriptionRepository prescriptionRepository;

    private final MedicineService medicineService;

    private final ProfileClient profileClient;

    @Override
    public Long savePrescription(PrescriptionDto prescriptionDto) {
        Long id = prescriptionRepository.save(prescriptionDto.toEntity()).getId();
        prescriptionDto.getMedicines().forEach(medicine -> {
            medicine.setPrescriptionId(id);
        });

        medicineService.saveAllMedicines(prescriptionDto.getMedicines());
        return id;
    }

    @Override
    public PrescriptionDto getPrescriptionByAppointmentId(Long appointmentId) throws ApException {
        PrescriptionDto dto = prescriptionRepository.findByAppointment_Id(appointmentId).orElseThrow(()->new ApException("Không tìm thấy : "+ appointmentId)).toDto();
        dto.setMedicines(medicineService.getAllMedicinesByPrescriptionId(dto.getId()));
        return dto;
    }

    @Override
    public PrescriptionDto getPrescriptionById(Long prescriptionId) {
        PrescriptionDto dto = prescriptionRepository.findById(prescriptionId).orElseThrow(()->new ApException("Không tìm thấy toa thuốc với id: "+ prescriptionId)).toDto();

        dto.setMedicines(medicineService.getAllMedicinesByPrescriptionId(prescriptionId));
        return dto;
    }

    @Override
    public List<PrescriptionDetails> getPrescriptionsByPatientId(Long patientId) throws ApException {
        List<Prescription> prescriptions = prescriptionRepository.findAllByPatientId(patientId);

        List<PrescriptionDetails> prescriptionDetails = prescriptions.stream().map(Prescription::toDetails).toList();

        prescriptionDetails.forEach(details -> {
            details.setMedicines(medicineService.getAllMedicinesByPrescriptionId(details.getId()));
        });

        List<Long> doctorIds = prescriptionDetails.stream().map(PrescriptionDetails::getDoctorId).distinct().toList();

        List<DoctorName> doctorNames = profileClient.getDoctorsById(doctorIds);

        Map<Long, String> doctorMap = doctorNames.stream().collect(Collectors.toMap(DoctorName::getId, DoctorName::getName));

        prescriptionDetails.forEach(details -> {
            String doctorName = doctorMap.get(details.getDoctorId());
            if(doctorName != null){
                details.setDoctorName(doctorName);
            } else {
                details.setDoctorName("Không tìm thấy tên bác sĩ");
            }
        });

        return prescriptionDetails;
    }
}
