package com.example.pharmacy.Service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.pharmacy.Dto.SaleItemDto;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Model.SaleItem;
import com.example.pharmacy.Repository.SaleItemRepository;
import com.example.pharmacy.Service.SaleItemService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaleItemServiceImpl implements SaleItemService {
    
    private final SaleItemRepository saleItemRepository;

    @Override
    public Long createSaleItem(SaleItemDto saleItemDto) throws PyException {
        return saleItemRepository.save(saleItemDto.toEntity()).getId();
    }


    @Override
    public void createMultipleSaleItem(Long saleId, Long medicineId, List<SaleItemDto> saleItemDtos)
            throws PyException {
        
        saleItemDtos.stream().map((saleItem) -> {
            saleItem.setSaleId(saleId);
            saleItem.setMedicineId(medicineId);

            return saleItem.toEntity();
        }).forEach(saleItemRepository::save);
    }

    @Override
    public void updateSaleItem(SaleItemDto saleItemDto) throws PyException {
        SaleItem existSaleItem = saleItemRepository.findById(saleItemDto.getId()).orElseThrow(()->new PyException("Không tìm thấy chi tiết hóa đơn"));
        existSaleItem.setQuantity(saleItemDto.getQuantity());
        existSaleItem.setUnitPrice(saleItemDto.getUnitPrice());
        saleItemRepository.save(existSaleItem);
    }

    @Override
    public List<SaleItemDto> getSaleItemsBySaleId(Long saleId) throws PyException {
        return saleItemRepository.findBySaleId(saleId).stream().map(SaleItem::toDto).toList();
    }

    @Override
    public SaleItemDto getSaleItem(Long id) throws PyException {
        return saleItemRepository.findById(id).map(SaleItem::toDto).orElseThrow(()->new PyException("Không tìm thấy chi tiết hóa đơn"));
    }
}
