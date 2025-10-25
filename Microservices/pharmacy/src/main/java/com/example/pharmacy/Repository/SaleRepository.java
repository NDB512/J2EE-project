package com.example.pharmacy.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.pharmacy.Model.Sale;

public interface SaleRepository extends CrudRepository<Sale, Long>{
    Boolean existsByPrescriptionId(Long prescriptionId);
    Optional<Sale> findByPrescriptionId(Long prescriptionId);
}
