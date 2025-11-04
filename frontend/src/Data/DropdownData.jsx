const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const genders = ["Nam", "Nữ", "Khác"];

const maritalStatuses = ["Độc thân", "Đã kết hôn", "Ly hôn", "Góa"];

const doctorSpecializations = [
  "Tim mạch",
  "Thần kinh",
  "Cơ xương khớp",
  "Nhi khoa",
  "Da liễu",
  "Ngoại tổng quát",
  "Tâm thần",
  "Chẩn đoán hình ảnh",
  "Phụ khoa",
  "Mắt",
  "Tai - Mũi - Họng",
  "Răng - Hàm - Mặt",
  "Ung bướu",
  "Tiêu hóa",
  "Hô hấp",
  "Tiết niệu",
  "Nội tiết",
  "Huyết học",
  "Thận học",
  "Lão khoa"
];

const visitReasons = [
  "Khám tổng quát",
  "Đau đầu",
  "Sốt cao",
  "Đau bụng",
  "Khám tim mạch",
  "Tái khám định kỳ",
  "Khám da liễu",
  "Khám hô hấp",
  "Khám tiêu hóa",
  "Khám xương khớp",
  "Khám mắt",
  "Khám sản phụ khoa",
  "Khám răng miệng",
  "Khám thần kinh",
  "Khám tiết niệu",
  "Khám nội tiết",
  "Khám dinh dưỡng",
  "Khám ung bướu",
  "Tiêm phòng",
  "Tư vấn tâm lý",
  "Khám nhi khoa",
  "Khám tai mũi họng",
  "Khám da liễu trẻ em",
  "Khác"
];

const Symptoms = [
  "Sốt",
  "Ho",
  "Đau đầu",
  "Đau họng",
  "Mệt mỏi",
  "Khó thở",
  "Đau ngực",
  "Chóng mặt",
  "Buồn nôn",
  "Nôn mửa",
  "Tiêu chảy",
  "Đau bụng",
  "Đau lưng",
  "Đau khớp",
  "Đau cơ",
  "Phát ban",
  "Ngứa da",
  "Chảy nước mũi",
  "Nghẹt mũi",
  "Ho khan",
  "Ho có đờm",
  "Mất vị giác",
  "Mất khứu giác",
  "Khó ngủ",
  "Hụt hơi khi gắng sức",
  "Chán ăn",
  "Đổ mồ hôi nhiều",
  "Đau tai",
  "Ù tai",
  "Sưng hạch",
  "Đau mắt",
  "Chảy nước mắt",
  "Khó nuốt",
  "Khàn giọng",
  "Tim đập nhanh",
  "Cảm giác hồi hộp",
  "Sưng khớp",
  "Run tay",
  "Khó tập trung",
  "Cảm giác lo âu",
  "Đau rát khi tiểu",
  "Tiểu nhiều",
  "Tiểu ít",
  "Tiểu buốt",
  "Tiểu ra máu",
  "Khó chịu vùng bụng dưới",
  "Khó chịu vùng ngực",
  "Khó chịu vùng cổ",
  "Khó chịu vùng lưng"
];

const Tests = [
  // Xét nghiệm máu
  "Công thức máu (CBC)",
  "Đường huyết (Glucose)",
  "HbA1C (Đánh giá tiểu đường)",
  "Mỡ máu (Cholesterol, Triglycerid)",
  "Men gan (AST, ALT)",
  "Ure, Creatinin (Chức năng thận)",
  "Ion đồ (Na+, K+, Cl-, Ca2+)",
  "CRP (C-reactive protein)",
  "Hồng cầu, bạch cầu, tiểu cầu",

  // Xét nghiệm nước tiểu
  "Tổng phân tích nước tiểu",
  "Tìm protein trong nước tiểu",
  "Tìm glucose trong nước tiểu",

  // Xét nghiệm vi sinh
  "Xét nghiệm vi khuẩn HP",
  "Xét nghiệm COVID-19 (PCR)",
  "Test cúm nhanh",
  "Xét nghiệm lao (Mantoux, IGRA)",
  "Xét nghiệm viêm gan B",
  "Xét nghiệm viêm gan C",
  "Xét nghiệm HIV",
  "Cấy máu",
  "Cấy nước tiểu",
  "Cấy đờm",

  // Xét nghiệm nội tiết
  "TSH, FT4 (Tuyến giáp)",
  "Test testosterone",
  "Estrogen, Progesterone",
  "Cortisol máu",

  // Hình ảnh học (chẩn đoán bằng hình ảnh)
  "X-quang phổi",
  "Siêu âm bụng tổng quát",
  "Siêu âm tim",
  "Siêu âm tuyến giáp",
  "CT Scanner",
  "MRI (Cộng hưởng từ)",
  "Điện tâm đồ (ECG)",
  "Điện não đồ (EEG)",
  "Đo mật độ xương",

  // Khác
  "Test dị ứng",
  "Test máu ẩn trong phân",
  "Xét nghiệm ký sinh trùng",
  "Xét nghiệm Pap smear (Tế bào cổ tử cung)",
  "Xét nghiệm tinh dịch đồ"
];

const dosagePatternOptions = [
   // Uống 1 lần/ngày
  { value: "Sáng", label: "Sáng" },
  { value: "Trưa", label: "Trưa" },
  { value: "Tối", label: "Tối" },

  // Uống 2 lần/ngày
  { value: "Sáng - Trưa", label: "Sáng - Trưa" },
  { value: "Sáng - Tối", label: "Sáng - Tối" },
  { value: "Trưa - Tối", label: "Trưa - Tối" },

  // Uống 3 lần/ngày
  { value: "Sáng - Trưa - Tối", label: "Sáng - Trưa - Tối" },

  // Uống 4 lần/ngày
  { value: "Sáng - Trưa - Tối - Khuya", label: "Sáng - Trưa - Tối - Khuya" },

  // Đặc biệt
  { value: "Sáng - Tối (bỏ trưa, khuya)", label: "Sáng - Tối (bỏ trưa, khuya)" },
  { value: "Trưa - Khuya", label: "Trưa - Khuya" },
  { value: "Sáng - Khuya", label: "Sáng - Khuya" },

  // Theo chỉ định
  { value: "Theo chỉ định bác sĩ", label: "Theo chỉ định bác sĩ" },
];

const routeOptions = [
  { value: "uống", label: "Uống" },
  { value: "tiêm", label: "Tiêm" },
  { value: "bôi", label: "Bôi ngoài da" },
  { value: "nhỏ", label: "Nhỏ (mắt, mũi, tai...)" },
  { value: "xịt", label: "Xịt" },
  { value: "đặt", label: "Đặt (âm đạo, trực tràng...)" },
  { value: "khác", label: "Khác" },
];

const typeOptions = [
  { value: "Viên", label: "Viên" },
  { value: "Siro", label: "Siro" },
  { value: "Bột", label: "Bột" },
  { value: "Ống-tiêm", label: "Ống tiêm" },
  { value: "Kem", label: "Kem bôi" },
  { value: "Gel", label: "Gel" },
  { value: "Thuốc-nhỏ", label: "Thuốc nhỏ" },
  { value: "Viên-sủi", label: "Viên sủi" },
  { value: "Khác", label: "Khác" },
];

const categoryOptions = [
  { value: "Giảm đau", label: "Giảm đau" },
  { value: "Hạ sốt", label: "Hạ sốt" },
  { value: "Kháng sinh", label: "Kháng sinh" },
  { value: "Kháng virus", label: "Kháng virus" },
  { value: "Kháng nấm", label: "Kháng nấm" },
  { value: "Chống viêm", label: "Chống viêm" },
  { value: "Chống dị ứng", label: "Chống dị ứng" },
  { value: "Hạ huyết áp", label: "Hạ huyết áp" },
  { value: "Hạ đường huyết", label: "Hạ đường huyết" },
  { value: "Trung hòa axit dạ dày", label: "Trung hòa axit dạ dày" },
  { value: "Vitamin / Khoáng chất", label: "Vitamin / Khoáng chất" },
  { value: "Vaccine", label: "Vaccine" },
];

const data = [
  { date: '2025-10-01', appointments: 12, patients: 8, doctors: 3 },
  { date: '2025-10-02', appointments: 15, patients: 10, doctors: 4 },
  { date: '2025-10-03', appointments: 9, patients: 6, doctors: 2 },
];


export { bloodGroups, genders, maritalStatuses, doctorSpecializations, 
  visitReasons, Symptoms, Tests, dosagePatternOptions, routeOptions, typeOptions, categoryOptions, data  };