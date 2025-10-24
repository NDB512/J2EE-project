    package com.example.appointment.Dto;

    import com.example.appointment.Models.Medicine;
    import com.example.appointment.Models.Prescription;

    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class MedicineDto {

        private Long id;
        private String name;
        private Long medicineId;
        private String dosage;
        private String frequency;
        private Integer duration;
        private String route;
        private String type;
        private String instruction;
        private Long prescriptionId;

        public Medicine toEntity() {
            Medicine entity = new Medicine();
            entity.setId(this.id);
            entity.setName(this.name);
            entity.setDosage(this.dosage);
            entity.setFrequency(this.frequency);
            entity.setDuration(this.duration);
            entity.setRoute(this.route);
            entity.setType(this.type);
            entity.setInstruction(this.instruction);
            entity.setPrescription(new Prescription(prescriptionId));
            return entity;
        }
    }