package com.example.pharmacy.Service;

import java.util.List;

import com.example.pharmacy.Dto.MedicineDto;
import com.example.pharmacy.Exception.PyException;

public interface MedicineService {
    public Long addMedicine(MedicineDto medicineDto) throws PyException; 
    public MedicineDto getMedicineById(Long id) throws PyException; 
    public void updateMedicine(MedicineDto medicineDto) throws PyException;
    public  List<MedicineDto> getAllMedicines() throws PyException;
    public void deleteMedicine(Long id);
    public Integer getStockById(Long id) throws PyException;
    public Integer addStock(Long id, Integer quantity) throws PyException;
    public Integer removeStock(Long id, Integer quantity) throws PyException;
}
