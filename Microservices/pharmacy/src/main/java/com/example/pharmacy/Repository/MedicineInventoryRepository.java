package com.example.pharmacy.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.pharmacy.Model.MedicineInventory;

public interface MedicineInventoryRepository extends CrudRepository<MedicineInventory, Long> {
    List<MedicineInventory> findByExpiryDateBefore(LocalDate date);
}
