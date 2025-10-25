package com.example.pharmacy.Service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.pharmacy.Dto.MedicineDto;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Model.Medicine;
import com.example.pharmacy.Repository.MedicineRepository;
import com.example.pharmacy.Service.MedicineService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {
    private final MedicineRepository medicineRepository;

    @Override
    public Long addMedicine(MedicineDto medicineDto) throws PyException {
        Optional<Medicine> medicine = medicineRepository.findByNameIgnoreCaseAndDosageIgnoreCase(medicineDto.getName(), medicineDto.getDosage());
        
        if(medicine.isPresent()){
            throw new PyException("Thuốc với tên và liều lượng đã tồn tại!");
        }

        medicineDto.setStock(0);
        return medicineRepository.save(medicineDto.toEntity()).getId();
    }

    @Override
    public MedicineDto getMedicineById(Long id) throws PyException {
        return medicineRepository.findById(id).orElseThrow(()-> new PyException("Không tìm thấy thuốc")).toDto();
    }

    @Override
    public void updateMedicine(MedicineDto medicineDto) throws PyException {
        // Kiểm tra xem thuốc có tồn tại không
        Medicine existsMedicine = medicineRepository.findById(medicineDto.getId())
            .orElseThrow(() -> new PyException("Không tìm thấy thuốc!"));

        // Nếu tên hoặc liều lượng thay đổi, kiểm tra trùng lặp
        boolean isNameChanged = !medicineDto.getName().equalsIgnoreCase(existsMedicine.getName());
        boolean isDosageChanged = !medicineDto.getDosage().equalsIgnoreCase(existsMedicine.getDosage());

        if (isNameChanged || isDosageChanged) {
            Optional<Medicine> duplicate = medicineRepository
                .findByNameIgnoreCaseAndDosageIgnoreCase(medicineDto.getName(), medicineDto.getDosage());

            if (duplicate.isPresent() && !duplicate.get().getId().equals(medicineDto.getId())) {
                throw new PyException("Thuốc với tên và liều lượng này đã tồn tại!");
            }
        }

        // Cập nhật thông tin thuốc
        existsMedicine.setName(medicineDto.getName());
        existsMedicine.setDosage(medicineDto.getDosage());
        existsMedicine.setCategory(medicineDto.getCategory());
        existsMedicine.setType(medicineDto.getType());
        existsMedicine.setManufacturer(medicineDto.getManufacturer());
        existsMedicine.setUnitPrice(medicineDto.getUnitPrice());

        // Lưu thay đổi
        medicineRepository.save(existsMedicine);
    }

    @Override
    public List<MedicineDto> getAllMedicines() throws PyException {
        return ((List<Medicine>) medicineRepository.findAll()).stream().map(Medicine::toDto).toList();
    }

    @Override
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    @Override
    public Integer getStockById(Long id) throws PyException {
        return medicineRepository.findStockById(id).orElseThrow(()-> new PyException("Không tìm thấy stock của " + id));
    }

    @Override
    public Integer addStock(Long id, Integer quantity) throws PyException {
        Medicine medicine = medicineRepository.findById(id).orElseThrow(()-> new PyException("Không tìm thấy thuốc"));
        medicine.setStock(medicine.getStock() != null ? medicine.getStock() + quantity : quantity);
        medicineRepository.save(medicine);
        return medicine.getStock();
    }

    @Override
    public Integer removeStock(Long id, Integer quantity) throws PyException {
        // Kiểm tra tham số đầu vào
        if (quantity == null || quantity <= 0) {
            throw new PyException("Số lượng cần trừ phải lớn hơn 0");
        }

        Medicine medicine = medicineRepository.findById(id)
            .orElseThrow(() -> new PyException("Không tìm thấy thuốc có ID: " + id));

        Integer currentStock = medicine.getStock();
        if (currentStock == null) {
            currentStock = 0;
        }

        // Kiểm tra xem có đủ để trừ không
        if (currentStock < quantity) {
            throw new PyException("Số lượng không đủ. Hiện chỉ còn " + currentStock + " đơn vị.");
        }

        medicine.setStock(currentStock - quantity);

        medicineRepository.save(medicine);

        return medicine.getStock();
    }
    
}
