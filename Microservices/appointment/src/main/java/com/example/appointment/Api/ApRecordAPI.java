package com.example.appointment.Api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.appointment.Dto.ApRecordDto;
import com.example.appointment.Dto.PrescriptionDetails;
import com.example.appointment.Dto.RecordDetail;
import com.example.appointment.Exception.ApException;
import com.example.appointment.Service.ApRecordService;
import com.example.appointment.Service.PrescriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/appointment/report")
@Validated
@RequiredArgsConstructor
public class ApRecordAPI {

    private final ApRecordService apRecordService;

    private final PrescriptionService prescriptionService;

    /**
     * Tạo hồ sơ khám mới cho một cuộc hẹn
     */
    @PostMapping
    public ResponseEntity<Long> createApRecord(@RequestBody @Validated ApRecordDto dto) throws ApException {
        return new ResponseEntity<>(apRecordService.createApRecorad(dto), HttpStatus.CREATED);
    }

    /**
     * Cập nhật hồ sơ khám
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateApRecord(@PathVariable Long id, @RequestBody @Validated ApRecordDto dto)
            throws ApException {
        apRecordService.updateApRecorad(dto);
        return new ResponseEntity<>("Cập nhật hồ sơ khám thành công!", HttpStatus.OK);
    }

    /**
     * Lấy hồ sơ khám theo ID hồ sơ
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApRecordDto> getApRecordById(@PathVariable Long id) throws ApException {
        return new ResponseEntity<>(apRecordService.getApRecordById(id), HttpStatus.OK);
    }

    /**
     * Lấy hồ sơ khám theo ID cuộc hẹn
     */
    @GetMapping("/getAp/{appointmentId}")
    public ResponseEntity<ApRecordDto> getApRecordByAppointmentId(@PathVariable Long appointmentId)
            throws ApException {
        return new ResponseEntity<>(apRecordService.getApRecordByAppointmentId(appointmentId), HttpStatus.OK);
    }

     /**
     * Lấy hồ sơ khám chi tiết theo ID cuộc hẹn
     */
    @GetMapping("/getAp/detail/{appointmentId}")
    public ResponseEntity<ApRecordDto> getApRecordDetailByAppointmentId(@PathVariable Long appointmentId)
            throws ApException {
        return new ResponseEntity<>(apRecordService.getApRecordDetailsByAppointmentId(appointmentId), HttpStatus.OK);
    }

    @GetMapping("/getRecordByPatientId/{patientId}")
    public ResponseEntity<List<RecordDetail>> getRecordsBypatientId(@PathVariable Long patientId) throws ApException{
        return new ResponseEntity<>(apRecordService.getApRecordByPatientId(patientId), HttpStatus.OK);
    }

    @GetMapping("/isRecordExists/{appointmentId}")
    public ResponseEntity<Boolean> isRecordExists(@PathVariable Long appointmentId) throws ApException{
        return new ResponseEntity<>(apRecordService.isRecordExists(appointmentId), HttpStatus.OK);
    }

    @GetMapping("/getPrescriptionsByPatientId/{patientId}")
    public ResponseEntity<List<PrescriptionDetails>> getPrescriptionsByPatientId(@PathVariable Long patientId) throws ApException{
        return new ResponseEntity<>(prescriptionService.getPrescriptionsByPatientId(patientId), HttpStatus.OK);
    }
}
