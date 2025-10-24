package com.example.appointment.Service;

import java.util.List;

import com.example.appointment.Dto.ApRecordDto;
import com.example.appointment.Dto.RecordDetail;
import com.example.appointment.Exception.ApException;

public interface ApRecordService {
    public Long createApRecorad(ApRecordDto apRecordDto) throws ApException;
    public void updateApRecorad(ApRecordDto apRecordDto) throws ApException;
    public ApRecordDto getApRecordByAppointmentId(Long appointmentId) throws ApException;
    public ApRecordDto getApRecordDetailsByAppointmentId(Long appointmentId) throws ApException;
    ApRecordDto getApRecordById(Long recordId) throws ApException;
    List<RecordDetail> getApRecordByPatientId(Long patientId) throws ApException;
    public Boolean isRecordExists(Long appointmentId) throws ApException;
}
