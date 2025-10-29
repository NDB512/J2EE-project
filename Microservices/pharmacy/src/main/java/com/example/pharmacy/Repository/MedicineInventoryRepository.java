package com.example.pharmacy.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.pharmacy.Dto.StockStatus;
import com.example.pharmacy.Model.MedicineInventory;

public interface MedicineInventoryRepository extends CrudRepository<MedicineInventory, Long> {
    List<MedicineInventory> findByExpiryDateBefore(LocalDate date);
    List<MedicineInventory> findByMedicineIdAndExpiryDateAfterAndQuantityGreaterThanAndStockStatusOrderByExpiryDateAsc(
        Long medicineId, LocalDate expiryDate, Integer minQuantity, StockStatus status
    );
}
