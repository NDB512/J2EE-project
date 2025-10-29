package com.example.pharmacy.Service;

import java.util.List;

import com.example.pharmacy.Dto.SaleItemDto;
import com.example.pharmacy.Exception.PyException;

public interface SaleItemService {
    Long createSaleItem(SaleItemDto saleItemDto) throws PyException;
    void createMultipleSaleItem(Long saleId, Long medicineId, List<SaleItemDto> saleItemDtos) throws PyException;
    void updateSaleItem(SaleItemDto saleItemDto) throws PyException;
    List<SaleItemDto> getSaleItemsBySaleId(Long saleId) throws PyException;
    SaleItemDto getSaleItem(Long id) throws PyException;
    public void createSaveItems(Long saveId, List<SaleItemDto> saleItemDtos) throws PyException;
}
