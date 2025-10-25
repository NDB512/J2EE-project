import React, { useState } from 'react';
import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { dosagePatternOptions, routeOptions, Symptoms, Tests, typeOptions } from '../../../Data/DropdownData';
import { useAuth } from '../../../Content/AuthContext';
import { errorNotification } from '../../../Utils/Notification';

const ApReport = ({ id: appointmentId, doctorId, patientId, appointmentDate, status }) => {
  const { createApRecord, isRecordExists } = useAuth();

  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', customFrequency: '', duration: '', route: '', type: '', instruction: '' },
  ]);

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

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: '', customFrequency: '', duration: '', route: '', type: '', instruction: '' },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
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
        medicines: medicines.map((m) => ({
          ...m,
          frequency:
            m.frequency === "Theo chỉ định bác sĩ"
              ? (m.customFrequency?.trim() || "Theo chỉ định bác sĩ")
              : m.frequency,
        })),
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

            <TextInput
              withAsterisk
              label="Tên thuốc"
              placeholder="Nhập tên thuốc"
              value={m.name}
              onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
            />

            <TextInput
              withAsterisk
              label="Liều lượng"
              placeholder="VD: 500mg"
              value={m.dosage}
              onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
            />

            <Select
              withAsterisk
              label="Liều dùng trong ngày"
              placeholder="Chọn liều dùng"
              data={dosagePatternOptions}
              value={m.frequency}
              onChange={(val) => handleMedicineChange(index, 'frequency', val)}
            />

            {m.frequency === "Theo chỉ định bác sĩ" && (
              <TextInput
                label="Nhập liều dùng tùy chỉnh"
                placeholder="VD: 1 viên sáng, 2 viên tối, cách ngày 1 lần..."
                value={m.customFrequency}
                onChange={(e) => handleMedicineChange(index, 'customFrequency', e.target.value)}
              />
            )}

            <NumberInput
              withAsterisk
              label="Số ngày dùng"
              placeholder="Nhập số ngày"
              value={m.duration}
              onChange={(val) => handleMedicineChange(index, 'duration', val)}
            />

            <Select
              withAsterisk
              label="Cách dùng"
              placeholder="Chọn cách dùng"
              data={routeOptions}
              value={m.route}
              onChange={(val) => handleMedicineChange(index, 'route', val)}
            />

            <Select
              withAsterisk
              label="Dạng thuốc"
              placeholder="Chọn dạng thuốc"
              data={typeOptions}
              value={m.type}
              onChange={(val) => handleMedicineChange(index, 'type', val)}
            />

            <Textarea
              label="Hướng dẫn thêm"
              placeholder="VD: Uống sau bữa ăn sáng, tránh rượu bia..."
              autosize
              className="col-span-2"
              minRows={2}
              value={m.instruction}
              onChange={(e) => handleMedicineChange(index, 'instruction', e.target.value)}
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
