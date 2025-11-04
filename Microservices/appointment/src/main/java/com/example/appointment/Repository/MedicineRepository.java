package com.example.appointment.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.appointment.Models.Medicine;

public interface MedicineRepository extends CrudRepository<Medicine, Long>{
    List<Medicine> findAllByPrescriptionId(Long prescriptioId);
    List<Medicine> findAllByPrescriptionIdIn(List<Long> prescriptioIds);
}
