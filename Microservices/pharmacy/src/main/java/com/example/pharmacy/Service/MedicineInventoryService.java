package com.example.pharmacy.Service;

import java.util.List;

import com.example.pharmacy.Dto.MedicineInventoryDto;
import com.example.pharmacy.Exception.PyException;

public interface MedicineInventoryService {
    public List<MedicineInventoryDto> getAllMedicineInventories() throws PyException;
    public MedicineInventoryDto getMedicineInventoryById(Long id) throws PyException;
    public MedicineInventoryDto addMedicineInventory(MedicineInventoryDto medicineInventoryDto) throws PyException;
    public MedicineInventoryDto updateMedicineInventory(MedicineInventoryDto medicineInventoryDto) throws PyException;
    public void deleteMedicineInventory(Long id);
    void deleteExpiredMedicines() throws PyException;
}
