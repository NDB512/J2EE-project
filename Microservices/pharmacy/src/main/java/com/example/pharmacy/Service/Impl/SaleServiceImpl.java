package com.example.pharmacy.Service.Impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.pharmacy.Dto.SaleDto;
import com.example.pharmacy.Dto.SaleItemDto;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Model.Sale;
import com.example.pharmacy.Repository.SaleRepository;
import com.example.pharmacy.Service.SaleItemService;
import com.example.pharmacy.Service.SaleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {
    
    private final SaleRepository saleRepository;
    private final SaleItemService saleItemService;
    
    @Override
    public Long createSale(SaleDto saleDto) throws PyException {
        if (saleRepository.existsByPrescriptionId(saleDto.getPrescriptionId())) {
            throw new PyException("Đơn thuốc này đã có hóa đơn!");
        }

        // Lưu hóa đơn
        saleDto.setSaleDate(LocalDateTime.now());
        Sale sale = saleRepository.save(saleDto.toEntity());

        if (saleDto.getSaleItems() != null && !saleDto.getSaleItems().isEmpty()) {
            for (SaleItemDto item : saleDto.getSaleItems()) {
                item.setSaleId(sale.getId());
                saleItemService.createSaleItem(item);
            }
        }

        return sale.getId();
    }

    @Override
    public void updateSale(SaleDto saleDto) throws PyException {
        Sale sale = saleRepository.findById(saleDto.getId())
                .orElseThrow(() -> new PyException("Không tìm thấy hóa đơn này!"));

        sale.setSaleDate(saleDto.getSaleDate());
        sale.setTotalAmount(saleDto.getTotalAmount());
        saleRepository.save(sale);
    }

    @Override
    public SaleDto getSale(Long id) throws PyException {
        return saleRepository.findById(id)
                .orElseThrow(() -> new PyException("Không tìm thấy hóa đơn này!"))
                .toDto();
    }

    @Override
    public SaleDto getSaleByPrescriptionId(Long prescriptionId) throws PyException {
        return saleRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new PyException("Không tìm thấy hóa đơn của đơn thuốc này!"))
                .toDto();
    }
}
