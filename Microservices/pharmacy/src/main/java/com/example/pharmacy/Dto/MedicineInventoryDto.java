package com.example.pharmacy.Dto;

import java.time.LocalDate;

import com.example.pharmacy.Model.Medicine;
import com.example.pharmacy.Model.MedicineInventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineInventoryDto {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String batchNo;
    private Integer quantity;
    private LocalDate expiryDate;
    private LocalDate addDate;
    private Integer initialQuantity;
    private StockStatus stockStatus;

    public MedicineInventory toEntity() {
        MedicineInventory inventory = new MedicineInventory();
        inventory.setId(this.id);
        inventory.setMedicine(new Medicine(medicineId));
        inventory.setBatchNo(this.batchNo);
        inventory.setQuantity(this.quantity);
        inventory.setExpiryDate(this.expiryDate);
        inventory.setAddDate(this.addDate != null ? this.addDate : LocalDate.now());
        inventory.setInitialQuantity(initialQuantity);
        inventory.setStockStatus(stockStatus);
        return inventory;
    }
}
