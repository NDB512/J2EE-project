package com.example.pharmacy.Dto;

import com.example.pharmacy.Model.Medicine;
import com.example.pharmacy.Model.Sale;
import com.example.pharmacy.Model.SaleItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleItemDto {
    private Long id;
    private Long saleId;
    private Long medicineId;
    private String batchNo;
    private Integer quantity;
    private Double unitPrice;

    public SaleItem toEntity() {
        SaleItem item = new SaleItem();
        item.setId(id);
        if (saleId != null) item.setSale(new Sale(saleId));
        if (medicineId != null) item.setMedicine(new Medicine(medicineId));
        item.setBatchNo(batchNo);
        item.setQuantity(quantity);
        item.setUnitPrice(unitPrice);
        return item;
    }
}
