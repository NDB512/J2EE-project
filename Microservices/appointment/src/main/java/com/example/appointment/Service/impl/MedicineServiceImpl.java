package com.example.appointment.Service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.appointment.Dto.MedicineDto;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Models.Medicine;
import com.example.appointment.Repository.MedicineRepository;
import com.example.appointment.Service.MedicineService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineServiceImpl implements MedicineService {
    
    private final MedicineRepository medicineRepository;

    @SuppressWarnings("null")
    @Override
    public Long saveMedicine(MedicineDto medicineDto) throws ApException {
        return medicineRepository.save(medicineDto.toEntity()).getId();
    }

   @Override
    public List<MedicineDto> saveAllMedicines(List<MedicineDto> medicineDtos) throws ApException {
        @SuppressWarnings("null")
        List<Medicine> savedEntities = (List<Medicine>) medicineRepository.saveAll(
            medicineDtos.stream().map(MedicineDto::toEntity).toList()
        );
        return savedEntities.stream().map(Medicine::toDto).toList();
    }

    @Override
    public List<MedicineDto> getAllMedicinesByPrescriptionId(Long PrescriptioId) throws ApException {
        return ((List<Medicine>)medicineRepository.findAllByPrescriptionId(PrescriptioId)).stream().map(Medicine::toDto).toList();
    }

    @Override
    public List<MedicineDto> getAllMedicinesByPrescriptionIdIn(List<Long> PrescriptioIds) throws ApException {
        return ((List<Medicine>)medicineRepository.findAllByPrescriptionIdIn(PrescriptioIds)).stream().map(Medicine::toDto).toList();
    }
    
}
