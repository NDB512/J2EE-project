import React, { useState, useEffect } from 'react';
import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { dosagePatternOptions, routeOptions, Symptoms, Tests, typeOptions } from '../../../Data/DropdownData';
import { useAuth } from '../../../Content/AuthContext';
import { errorNotification } from '../../../Utils/Notification';

const ApReport = ({ id: appointmentId, doctorId, patientId, appointmentDate, status }) => {
  const { createApRecord, isRecordExists, getMedicineDropdown } = useAuth();

  const [medicines, setMedicines] = useState([
    { 
      medicineId: null, 
      isCustom: false,
      name: '', 
      dosage: '', 
      frequency: '', 
      customFrequency: '', 
      duration: '', 
      route: '', 
      type: '', 
      instruction: '' 
    },
  ]);
  const [availableMedicines, setAvailableMedicines] = useState([]);

  const form = useForm({
    initialValues: {
      symptoms: [],
      diagnosis: '',
      tests: [],
      notes: '',
      referal: '',
      prescriptionNotes: '',
      followUpDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    },
  });

  // Load danh sách thuốc
  const loadMedicines = async () => {
    try {
      const meds = await getMedicineDropdown();
      setAvailableMedicines(meds || []);
    } catch (err) {
      errorNotification("Không thể tải danh sách thuốc!");
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { 
        medicineId: null, 
        isCustom: false,
        name: '', 
        dosage: '', 
        frequency: '', 
        customFrequency: '', 
        duration: '', 
        route: '', 
        type: '', 
        instruction: '' 
      },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Helper để lấy options thuốc không trùng (dựa trên medicineId)
  const getFilteredMedicineOptions = (currentIndex) => {
    const selectedIds = medicines
      .filter((_, i) => i !== currentIndex)
      .map(m => m.medicineId)
      .filter(id => id !== null);
    
    const filteredMeds = availableMedicines.filter(m => !selectedIds.includes(m.id));
    
    return [
      { value: 'custom', label: 'Thuốc khác' },
      ...filteredMeds.map(m => ({
        value: m.id.toString(),
        label: `${m.name} (${m.dosage})`,
      })),
    ];
  };

  // Xử lý thay đổi thuốc (Select)
  const handleMedicineSelectChange = (index, value) => {
    const updated = [...medicines];
    if (value === 'custom') {
      // Chuyển sang custom mode
      updated[index] = {
        ...updated[index],
        medicineId: null,
        isCustom: true,
        name: '',
        dosage: '',
        type: '',
      };
    } else {
      // Chọn thuốc predefined
      const med = availableMedicines.find(m => m.id.toString() === value);
      if (med) {
        updated[index] = {
          ...updated[index],
          medicineId: med.id,
          isCustom: false,
          name: med.name,
          dosage: med.dosage,
          type: med.type,
        };
      }
    }
    setMedicines(updated);
  };

  // Xử lý thay đổi field chung (frequency, duration, route, instruction, customFrequency)
  const handleCommonFieldChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // Xử lý thay đổi name khi custom (kiểm tra trùng tên)
  const handleCustomNameChange = (index, value) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      // Kiểm tra trùng với các thuốc khác (tên case-insensitive)
      const isDuplicate = medicines.some((m, i) => 
        i !== index && 
        m.name.toLowerCase() === trimmedValue.toLowerCase()
      );
      if (isDuplicate) {
        errorNotification('Tên thuốc này đã tồn tại! Vui lòng chọn thuốc khác.');
        return;
      }
    }
    const updated = [...medicines];
    updated[index].name = value;
    setMedicines(updated);
  };

  const handleSubmit = async (values) => {
    const now = dayjs();
    const appointmentDateTime = dayjs(appointmentDate);

    // Kiểm tra điều kiện không được phép tạo hồ sơ
    if (status === 'CANCELLED' || status === 'NO_SHOW') {
      errorNotification('Không thể tạo hồ sơ khám vì cuộc hẹn đã bị hủy hoặc bệnh nhân không đến!');
      return;
    }

    if (status === 'COMPLETED') {
      errorNotification('Không thể tạo hồ sơ khám vì cuộc hẹn đã xong!');
      return;
    }

    if (now.isBefore(appointmentDateTime)) {
      errorNotification('Chưa tới thời gian hẹn, không thể tạo hồ sơ khám!');
      return;
    }

    try {
      const exists = await isRecordExists(appointmentId);
      if (exists) {
        errorNotification('Cuộc hẹn này đã có hồ sơ khám!');
        return;
      }
    } catch (err) {
      return; // lỗi đã được hiển thị trong isRecordExists
    }

    // Validate medicines: ít nhất 1 thuốc hợp lệ
    const validMedicines = medicines.filter(m => 
      (m.medicineId || (m.isCustom && m.name.trim())) && 
      m.dosage && 
      m.duration && 
      m.route && 
      m.type
    );
    if (validMedicines.length === 0) {
      errorNotification('Vui lòng thêm ít nhất một thuốc hợp lệ!');
      return;
    }

    const dto = {
      patientId,
      doctorId,
      appointmentId,
      symptoms: values.symptoms,
      diagnosis: values.diagnosis,
      tests: values.tests,
      notes: values.notes,
      referal: values.referal,
      prescriptionDto: {
        patientId,
        doctorId,
        appointmentId,
        prescriptionDate: dayjs().format('YYYY-MM-DD'),
        notes: values.prescriptionNotes,
        medicines: validMedicines.map((m) => {
          const medicineData = m.medicineId 
            ? { 
                medicineId: m.medicineId,
                unitPrice: availableMedicines.find(med => med.id === m.medicineId)?.unitPrice || 0
              } 
            : { 
                name: m.name,
                type: m.type,
                dosage: m.dosage
              };
          return {
            ...medicineData,
            frequency:
              m.frequency === "Theo chỉ định bác sĩ"
                ? (m.customFrequency?.trim() || "Theo chỉ định bác sĩ")
                : m.frequency,
            duration: Number(m.duration), // Đảm bảo là number
            route: m.route,
            instruction: m.instruction,
          };
        }),
      },
      followUpDate: values.followUpDate,
    };

    // console.log('DTO gửi lên:', dto);

    try {
      await createApRecord(dto);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
      {/* Thông tin khám */}
      <Fieldset
        className="grid gap-4 grid-cols-2"
        legend={<span className="text-lg font-medium">Thông tin khám</span>}
        variant="filled"
        radius="md"
      >
        <MultiSelect
          label="Triệu chứng"
          placeholder="Chọn triệu chứng"
          data={Symptoms}
          withAsterisk
          className="col-span-2"
          {...form.getInputProps('symptoms')}
        />
        <MultiSelect
          data={Tests}
          label="Xét nghiệm"
          placeholder="Chọn xét nghiệm"
          searchable
          clearable
          nothingFound="Không có xét nghiệm phù hợp"
          withAsterisk
          className="col-span-2"
          {...form.getInputProps('tests')}
        />
        <TextInput
          withAsterisk
          label="Chẩn đoán"
          placeholder="Nhập chẩn đoán"
          {...form.getInputProps('diagnosis')}
        />
        <TextInput
          label="Chuyển tuyến / Giới thiệu"
          placeholder="Nhập thông tin chuyển tuyến"
          {...form.getInputProps('referal')}
        />
        <Textarea
          label="Ghi chú"
          placeholder="Nhập ghi chú thêm (nếu có)"
          autosize
          className="col-span-2"
          minRows={2}
          {...form.getInputProps('notes')}
        />
      </Fieldset>

      {/* Đơn thuốc */}
      <Fieldset
        className="grid gap-5"
        legend={<span className="text-lg font-medium">Đơn thuốc</span>}
        variant="filled"
        radius="md"
      >
        {medicines.map((m, index) => (
          <div key={index} className="grid gap-4 grid-cols-2 border p-4 rounded-md relative">
            <div className="absolute top-2 right-2">
              <ActionIcon color="red" variant="light" onClick={() => handleRemoveMedicine(index)}>
                <IconTrash size={16} />
              </ActionIcon>
            </div>

            {/* Select thuốc hoặc custom */}
            <Select
              withAsterisk
              label="Tên thuốc"
              placeholder="Chọn thuốc hoặc 'Thuốc khác'"
              data={getFilteredMedicineOptions(index)}
              value={m.medicineId ? m.medicineId.toString() : (m.isCustom ? 'custom' : '')}
              onChange={(val) => handleMedicineSelectChange(index, val)}
              className="col-span-2"
            />
            {m.isCustom && (
              <TextInput
                withAsterisk
                label="Nhập Tên thuốc"
                placeholder="Nhập tên thuốc"
                value={m.name}
                onChange={(e) => handleCustomNameChange(index, e.target.value)}
                className="col-span-2"
              />
            )}

            {/* Dosage: readOnly nếu predefined, editable nếu custom */}
            <TextInput
              withAsterisk
              label="Liều lượng"
              placeholder="VD: 500mg"
              value={m.dosage}
              readOnly={!m.isCustom}
              onChange={(e) => {
                if (m.isCustom) {
                  const updated = [...medicines];
                  updated[index].dosage = e.target.value;
                  setMedicines(updated);
                }
              }}
            />

            {/* Type: readOnly nếu predefined, editable nếu custom */}
            <Select
              withAsterisk
              label="Dạng thuốc"
              placeholder="Chọn dạng thuốc"
              data={typeOptions}
              value={m.type}
              onChange={(val) => {
                if (!m.isCustom) return;
                handleCommonFieldChange(index, 'type', val);
              }}
            />

            <Select
              withAsterisk
              label="Liều dùng trong ngày"
              placeholder="Chọn liều dùng"
              data={dosagePatternOptions}
              value={m.frequency}
              onChange={(val) => handleCommonFieldChange(index, 'frequency', val)}
            />

            {m.frequency === "Theo chỉ định bác sĩ" && (
              <TextInput
                label="Nhập liều dùng tùy chỉnh"
                placeholder="VD: 1 viên sáng, 2 viên tối, cách ngày 1 lần..."
                value={m.customFrequency}
                onChange={(e) => handleCommonFieldChange(index, 'customFrequency', e.target.value)}
                className="col-span-2"
              />
            )}

            <NumberInput
              withAsterisk
              label="Số ngày dùng"
              placeholder="Nhập số ngày"
              value={Number(m.duration) || ''}
              onChange={(val) => handleCommonFieldChange(index, 'duration', val)}
            />

            <Select
              withAsterisk
              label="Cách dùng"
              placeholder="Chọn cách dùng"
              className="col-span-2"
              data={routeOptions}
              value={m.route}
              onChange={(val) => handleCommonFieldChange(index, 'route', val)}
            />

            <Textarea
              label="Hướng dẫn thêm"
              placeholder="VD: Uống sau bữa ăn sáng, tránh rượu bia..."
              autosize
              className="col-span-2"
              minRows={2}
              value={m.instruction}
              onChange={(e) => handleCommonFieldChange(index, 'instruction', e.target.value)}
            />
          </div>
        ))}

        <Button variant="outline" color="green" leftSection={<IconPlus size={16} />} onClick={handleAddMedicine}>
          Thêm thuốc
        </Button>

        <Textarea
          label="Ghi chú đơn thuốc"
          placeholder="Nhập ghi chú thêm cho đơn thuốc"
          {...form.getInputProps('prescriptionNotes')}
        />
      </Fieldset>

      <div className="flex justify-end">
        <Button color="blue" type="submit">
          Lưu hồ sơ khám
        </Button>
      </div>
    </form>
  );
};

export default ApReport;