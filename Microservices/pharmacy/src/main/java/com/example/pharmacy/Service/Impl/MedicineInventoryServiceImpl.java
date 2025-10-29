package com.example.pharmacy.Service.Impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.pharmacy.Dto.MedicineInventoryDto;
import com.example.pharmacy.Dto.StockStatus;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Model.MedicineInventory;
import com.example.pharmacy.Repository.MedicineInventoryRepository;
import com.example.pharmacy.Service.MedicineInventoryService;
import com.example.pharmacy.Service.MedicineService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MedicineInventoryServiceImpl implements MedicineInventoryService {
    
    private final MedicineInventoryRepository medicineInventoryRepository;

    private final MedicineService medicineService;
    
    @Override
    public List<MedicineInventoryDto> getAllMedicineInventories() throws PyException {
        List<MedicineInventory> medicineInventories = (List<MedicineInventory>) medicineInventoryRepository.findAll();
        return medicineInventories.stream().map(MedicineInventory::toDto).toList();
    }

    @Override
    public MedicineInventoryDto getMedicineInventoryById(Long id) throws PyException {
        return medicineInventoryRepository.findById(id).orElseThrow(()-> new PyException("Không tìm thấy tồn kho của" + id)).toDto();
    }

    @Override
    public MedicineInventoryDto addMedicineInventory(MedicineInventoryDto medicineInventoryDto) throws PyException {
        medicineService.addStock(medicineInventoryDto.getMedicineId(), medicineInventoryDto.getQuantity());
        medicineInventoryDto.setInitialQuantity(medicineInventoryDto.getQuantity());
        medicineInventoryDto.setStockStatus(StockStatus.ACTIVE);
        return medicineInventoryRepository.save(medicineInventoryDto.toEntity()).toDto();
    }

    @Override
    public MedicineInventoryDto updateMedicineInventory(MedicineInventoryDto medicineInventoryDto) throws PyException {
        MedicineInventory existInventory = medicineInventoryRepository.findById(medicineInventoryDto.getId()).orElseThrow(()-> new PyException("Không tìm thấy tồn kho của" + medicineInventoryDto.getId()));

        existInventory.setBatchNo(medicineInventoryDto.getBatchNo());

        if(existInventory.getQuantity() < medicineInventoryDto.getQuantity()){
            medicineService.addStock(medicineInventoryDto.getMedicineId(), medicineInventoryDto.getQuantity() - existInventory.getQuantity());
        } else if(existInventory.getQuantity() > medicineInventoryDto.getQuantity()){
            medicineService.removeStock(medicineInventoryDto.getMedicineId(), existInventory.getQuantity() - medicineInventoryDto.getQuantity());
        }
        existInventory.setQuantity(medicineInventoryDto.getQuantity());
        existInventory.setInitialQuantity(medicineInventoryDto.getInitialQuantity());

        existInventory.setExpiryDate(medicineInventoryDto.getExpiryDate());
        return medicineInventoryRepository.save(existInventory).toDto();
    }

    @Override
    public void deleteMedicineInventory(Long id) throws PyException {
        MedicineInventory inventory = medicineInventoryRepository.findById(id)
            .orElseThrow(() -> new PyException("Không tìm thấy tồn kho của " + id));

        // Giảm stock thuốc tổng
        medicineService.removeStock(inventory.getMedicine().getId(), inventory.getQuantity());

        // Xóa lô
        medicineInventoryRepository.deleteById(id);
    }

    private void markExpired(List<MedicineInventory> inventories) throws PyException{
        for(MedicineInventory inventory : inventories){
            inventory.setStockStatus(StockStatus.EXPIRIED);
        }

        medicineInventoryRepository.saveAll(inventories);
    }

    @Override
    @Scheduled(cron = "0 0 * * * ?")
    public void deleteExpiredMedicines() throws PyException{
        System.out.println("Kiem tra thuoc xoa...");
        List<MedicineInventory> expiredMedicineInventories = medicineInventoryRepository.findByExpiryDateBefore(LocalDate.now().plusDays(1));

        for (MedicineInventory medicineInventory : expiredMedicineInventories){
            medicineService.removeStock(medicineInventory.getMedicine().getId(), medicineInventory.getQuantity());
        }

        this.markExpired(expiredMedicineInventories);
    }

    @Override
    @Transactional  
    public String sellStock(Long medicineId, Integer quantity) throws PyException {
        List<MedicineInventory> inventories =
            medicineInventoryRepository.findByMedicineIdAndExpiryDateAfterAndQuantityGreaterThanAndStockStatusOrderByExpiryDateAsc(
                medicineId, LocalDate.now(), 0, StockStatus.ACTIVE
            );

        if (inventories.isEmpty()) {
            throw new PyException("Không đủ tồn kho để bán!");
        }

        int remaining = quantity;
        StringBuilder details = new StringBuilder();

        for (MedicineInventory inv : inventories) {
            if (remaining <= 0) break;

            int available = inv.getQuantity();
            int soldNow = Math.min(available, remaining);

            inv.setQuantity(available - soldNow);
            if (inv.getQuantity() == 0) {
                inv.setStockStatus(StockStatus.SOLD_OUT);
            }
            medicineInventoryRepository.save(inv);

            details.append("Batch No: ")
                .append(inv.getBatchNo())
                .append(", Quantity Sold: ")
                .append(soldNow)
                .append("\n");

            if(inv.getQuantity() < 0){
                throw new PyException("Lỗi trong quá trình bán hàng: tồn kho âm!");
            }

            // Cập nhật tồn kho tổng ở Medicine
            medicineService.removeStock(medicineId, soldNow);

            remaining -= soldNow;
        }

        if (remaining > 0) {
            throw new PyException("Tồn kho không đủ để bán " + quantity + " sản phẩm!");
        }

        return details.toString();
    }

    // @Scheduled(cron = "0 14 19 * * ?")
    // public void print(){
    //     System.out.println("Chuong trinh dang chay...");
    // }
    
}
