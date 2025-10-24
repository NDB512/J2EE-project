package com.example.appointment.Service;

import java.util.List;

import com.example.appointment.Dto.MedicineDto;
import com.example.appointment.Exception.ApException;

public interface MedicineService {
    public Long saveMedicine (MedicineDto medicineDto) throws ApException;
    public List<MedicineDto> saveAllMedicines (List<MedicineDto> medicineDtos) throws ApException;
    public List<MedicineDto> getAllMedicinesByPrescriptionId (Long PrescriptioId) throws ApException;
}
