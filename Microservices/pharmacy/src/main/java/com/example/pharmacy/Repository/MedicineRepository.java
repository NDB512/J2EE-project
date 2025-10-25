package com.example.pharmacy.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.pharmacy.Model.Medicine;

public interface MedicineRepository extends CrudRepository<Medicine, Long> {
    Optional<Medicine> findByNameIgnoreCaseAndDosageIgnoreCase(String name, String dosage);
    Optional<Integer> findStockById(Long id); 
}
