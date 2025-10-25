package com.example.pharmacy.Api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.pharmacy.Dto.MedicineInventoryDto;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Service.MedicineInventoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pharmacy/inventory")
@RequiredArgsConstructor
public class MedicineInventoryApi {

    private final MedicineInventoryService medicineInventoryService;

    // Lấy danh sách toàn bộ tồn kho thuốc
    @GetMapping
    public ResponseEntity<List<MedicineInventoryDto>> getAllMedicineInventories() throws PyException {
        return new ResponseEntity<>(medicineInventoryService.getAllMedicineInventories(), HttpStatus.OK);
    }

    // Lấy tồn kho theo ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicineInventoryDto> getMedicineInventoryById(@PathVariable Long id) throws PyException {
        return new ResponseEntity<>(medicineInventoryService.getMedicineInventoryById(id), HttpStatus.OK);
    }

    // Thêm tồn kho mới
    @PostMapping
    public ResponseEntity<MedicineInventoryDto> addMedicineInventory(@RequestBody MedicineInventoryDto medicineInventoryDto) throws PyException {
        return new ResponseEntity<>(medicineInventoryService.addMedicineInventory(medicineInventoryDto), HttpStatus.CREATED);
    }

    // Cập nhật tồn kho
    @PutMapping
    public ResponseEntity<MedicineInventoryDto> updateMedicineInventory(
            @RequestBody MedicineInventoryDto medicineInventoryDto) throws PyException {
        return new ResponseEntity<>(medicineInventoryService.updateMedicineInventory(medicineInventoryDto), HttpStatus.OK);
    }

    // Xoá tồn kho
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicineInventory(@PathVariable Long id) {
        medicineInventoryService.deleteMedicineInventory(id);
        return ResponseEntity.noContent().build();
    }
}
