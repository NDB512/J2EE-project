package com.example.appointment.Service;

import java.util.List;

import com.example.appointment.Dto.PrescriptionDetails;
import com.example.appointment.Dto.PrescriptionDto;
import com.example.appointment.Exception.ApException;

public interface PrescriptionService {
    public Long savePrescription(PrescriptionDto prescriptionDto);
    public PrescriptionDto getPrescriptionByAppointmentId(Long appointmentId) throws ApException;
    public PrescriptionDto getPrescriptionById(Long prescriptionId);
    public List<PrescriptionDetails> getPrescriptionsByPatientId(Long patientId) throws ApException;
    public List<PrescriptionDetails> getPrescriptions() throws ApException;
    public void markAsSold(Long id);
}
