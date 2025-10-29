package com.example.pharmacy.Api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pharmacy.Dto.MedicineDropdownDto;
import com.example.pharmacy.Dto.MedicineDto;
import com.example.pharmacy.Dto.MedicineListDto;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Service.MedicineService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pharmacy/medicines")
@RequiredArgsConstructor
public class MedicineApi {
    
    private final MedicineService medicineService;

    // Lấy danh sách tất cả thuốc
    @GetMapping
    public ResponseEntity<List<MedicineListDto>> getAllMedicines() throws PyException {
        return new ResponseEntity<>(medicineService.getAllMedicines(), HttpStatus.OK);
    }

    // Lấy thông tin thuốc theo ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicineDto> getMedicineById(@PathVariable Long id) throws PyException {
        return new ResponseEntity<>(medicineService.getMedicineById(id), HttpStatus.OK);
    }

    // Thêm thuốc mới
    @PostMapping
    public ResponseEntity<Long> addMedicine(@RequestBody MedicineDto medicineDto) throws PyException {
        return new ResponseEntity<>(medicineService.addMedicine(medicineDto), HttpStatus.CREATED);
    }

    // Cập nhật thông tin thuốc
    @PutMapping
    public ResponseEntity<String> updateMedicine(@RequestBody MedicineDto medicineDto) throws PyException {
        // // đảm bảo DTO có id khớp với path variable
        // medicineDto.setId(id);
        medicineService.updateMedicine(medicineDto);
        return ResponseEntity.ok("Cập nhật thuốc thành công!");
    }

    // Xóa thuốc
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) throws PyException {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Xóa thuốc thành công!");
    }

    @GetMapping("/dropdown")
    public ResponseEntity<List<MedicineDropdownDto>> getMedicineDropdown() {
        return ResponseEntity.ok(medicineService.getDropdownList());
    }
}
