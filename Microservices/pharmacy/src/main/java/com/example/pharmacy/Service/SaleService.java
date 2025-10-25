package com.example.pharmacy.Service;

import com.example.pharmacy.Dto.SaleDto;
import com.example.pharmacy.Exception.PyException;

public interface SaleService {
    Long createSale(SaleDto saleDto) throws PyException;
    void updateSale(SaleDto saleDto) throws PyException;
    public SaleDto getSale(Long id) throws PyException;
    public SaleDto getSaleByPrescriptionId (Long prescriptionId) throws PyException;
}
