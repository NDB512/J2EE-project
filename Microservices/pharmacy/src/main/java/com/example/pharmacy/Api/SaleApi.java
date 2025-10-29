package com.example.pharmacy.Api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pharmacy.Dto.SaleDto;
import com.example.pharmacy.Dto.SaleItemDto;
import com.example.pharmacy.Dto.SaleRequest;
import com.example.pharmacy.Exception.PyException;
import com.example.pharmacy.Service.SaleItemService;
import com.example.pharmacy.Service.SaleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pharmacy/sales")
@RequiredArgsConstructor
public class SaleApi {
    
    private final SaleService saleService;
    private final SaleItemService saleItemService;

    @PostMapping
    public ResponseEntity<Long> createSale(@RequestBody SaleDto saleDto) throws PyException{
        return new ResponseEntity<>(saleService.createSale(saleDto), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<String> updateSale(@RequestBody SaleDto saleDto) throws PyException{
        saleService.updateSale(saleDto);
        return new ResponseEntity<>("Cập nhập thành công hóa đơn!", HttpStatus.OK);
    }

    @GetMapping("/getSaleItems/{saleId}")
    public ResponseEntity<List<SaleItemDto>> getSaleItems(@PathVariable Long saleId) throws PyException{
        return new ResponseEntity<>(saleItemService.getSaleItemsBySaleId(saleId), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<SaleDto> getSale(@PathVariable Long id) throws PyException{
        return new ResponseEntity<>(saleService.getSale(id), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<SaleRequest>> getAllSales() throws PyException{
        return new ResponseEntity<>(saleService.getAllSales(), HttpStatus.OK);
    }
}
