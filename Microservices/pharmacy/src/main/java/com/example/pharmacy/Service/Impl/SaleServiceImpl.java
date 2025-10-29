package com.example.pharmacy.Service.Impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.pharmacy.Dto.SaleDto;
import com.example.pharmacy.Dto.SaleItemDto;
import com.example.pharmacy.Dto.SaleRequest;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Model.Sale;
import com.example.pharmacy.Repository.SaleRepository;
import com.example.pharmacy.Service.MedicineInventoryService;
import com.example.pharmacy.Service.SaleItemService;
import com.example.pharmacy.Service.SaleService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {
    
    private final SaleRepository saleRepository;
    private final SaleItemService saleItemService;
    private final MedicineInventoryService medicineInventoryService;
    private final com.example.pharmacy.Clients.ProfileClient profileClient;
    
    @Override
    @Transactional
    public Long createSale(SaleDto saleDto) throws PyException {
        if (saleDto.getPrescriptionId() != null && saleRepository.existsByPrescriptionId(saleDto.getPrescriptionId())) {
            throw new PyException("Đơn thuốc này đã có hóa đơn!");
        }

        for(SaleItemDto saleItem : saleDto.getSaleItems()){
            medicineInventoryService.sellStock(saleItem.getMedicineId(), saleItem.getQuantity());
        }

        Sale sale = new Sale(null, saleDto.getPrescriptionId(), saleDto.getBuyerName(), saleDto.getBuyerContact(), LocalDateTime.now(), saleDto.getTotalAmount());

        sale = saleRepository.save(sale);

        saleItemService.createSaveItems(sale.getId(), saleDto.getSaleItems());

        try {
            profileClient.markPrescriptionSold(saleDto.getPrescriptionId());
        } catch (Exception e) {
            throw new PyException("Không thể cập nhật trạng thái đơn thuốc!");
        }

        return sale.getId();
    }

    @Override
    public void updateSale(SaleDto saleDto) throws PyException {
        Sale sale = saleRepository.findById(saleDto.getId())
                .orElseThrow(() -> new PyException("Không tìm thấy hóa đơn này!"));

        sale.setBuyerName(saleDto.getBuyerName());
        sale.setBuyerContact(saleDto.getBuyerContact());
        for(SaleItemDto saleItemDto : saleDto.getSaleItems()){
            saleItemService.updateSaleItem(saleItemDto);
        }
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

    @Override
    public List<SaleRequest> getAllSales() throws PyException {
        return ((List<Sale>)saleRepository.findAll()).stream().map(Sale::toRequestDto).toList();
    }
}
