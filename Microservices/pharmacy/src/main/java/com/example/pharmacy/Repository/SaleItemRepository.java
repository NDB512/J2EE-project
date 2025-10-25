package com.example.pharmacy.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.pharmacy.Model.SaleItem;

public interface SaleItemRepository extends CrudRepository<SaleItem, Long>{
    List<SaleItem> findBySaleId(Long saleId);
    List<SaleItem> findByMedicineId(Long medicineId);
}
