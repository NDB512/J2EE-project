import { createContext, useContext, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, removeAuth } from "../Slices/AuthSlices";
import api from "../Utils/api";
import { successNotification, errorNotification } from "../Utils/Notification";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, accessToken, refreshToken } = useSelector((state) => state.auth);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    };

    // Login qua email + password
    const login = async (email, password) => {
        try {
            const res = await api.post("/user/login", { email, password });
            const data = res.data;

            if (data.accessToken && data.refreshToken) {
                // Decode JWT để lấy user info
                const decoded = decodeToken(data.accessToken);
                const userData = {
                    id: decoded?.id,
                    name: decoded?.name,
                    email: decoded?.email,
                    role: decoded?.role,
                    profileId: decoded?.profileId,
                    profileImageUrlId: decoded?.profileImageUrlId,
                };

                dispatch(setAuth({ ...data, user: userData }));
                successNotification("Đăng nhập thành công!");

                // Return data với user để component sử dụng (ví dụ redirect)
                return { ...data, user: userData, role: userData.role };
            }
        } catch (err) {
            errorNotification(err.response?.data?.message || "Đăng nhập thất bại!");
            throw err;
        }
    };

    // Login qua Google
    const googleLogin = async (accessToken, refreshToken, user) => {
        const decoded = decodeToken(accessToken);
        const userData = user || { ...decoded };
        dispatch(setAuth({ accessToken, refreshToken, user: userData }));
        successNotification("Đăng nhập Google thành công!");
        return userData;
    };

    // Hàm thêm mới — lưu token & user (dùng khi đăng ký)
    const saveLoginData = (accessToken, refreshToken, user) => { // Tương tự, ưu tiên decode
        const decoded = decodeToken(accessToken);
        const userData = user || {
            id: decoded?.id,
            name: decoded?.name,
            email: decoded?.email,
            role: decoded?.role,
            profileId: decoded?.profileId,
        };

        dispatch(setAuth({ accessToken, refreshToken, user: userData }));
        successNotification("Đăng ký thành công!");
    };

    // Logout
    const logout = useCallback(() => {
        dispatch(removeAuth());
        navigate("/login", { replace: true });
    }, [dispatch, navigate]);

    // Refresh token
    const refresh = useCallback(async () => {
        try {
            if (!refreshToken) return logout();
            const res = await api.post("/user/refresh", { refreshToken });
            const data = res.data;

            if (data.accessToken) {
                // Decode new accessToken để cập nhật user (nếu info thay đổi)
                const decoded = decodeToken(data.accessToken);
                const updatedUser = {
                    ...user,
                    id: decoded?.id,
                    name: decoded?.name,
                    email: decoded?.email,
                    role: decoded?.role,
                    profileId: decoded?.profileId,
                };

                dispatch(
                    setAuth({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        user: updatedUser,
                    })
                );
                return data.accessToken;
            }
        } catch {
            errorNotification("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            logout();
        }

    }, [refreshToken, user, dispatch, logout]);

    // Auto refresh trước khi token hết hạn
    useEffect(() => {
        if (!accessToken) return;
        const decoded = decodeToken(accessToken);
        if (!decoded?.exp) return;

        const expiresIn = decoded.exp * 1000 - Date.now();
        if (expiresIn > 15000) {
            const timeout = setTimeout(() => refresh(), expiresIn - 10000);
            return () => clearTimeout(timeout);
        }
    }, [accessToken, refresh]);

    const getPatientInfo = async (profliePatientId) => {
        try {
            const res = await api.get(`/profile/patient/get/${profliePatientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Lấy thông tin bệnh nhân thất bại!");
            throw err;
        }
    };

    const updatePatientInfo = async (profliePatientId, info) => {
        try {
            const res = await api.put(`/profile/patient/update/${profliePatientId}`, info, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật thông tin bệnh nhân thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật thông tin bệnh nhân thất bại!");
            throw err;
        }
    };

    const getDoctorInfo = async (profileDoctorId) => {
        try {
            const res = await api.get(`/profile/doctor/get/${profileDoctorId}`, {
            });
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Lấy thông tin bác sĩ thất bại!");
            throw err;
        }
    };

    const updateDoctorInfo = async (profileDoctorId, info) => {
        try {
            const res = await api.put(`/profile/doctor/update/${profileDoctorId}`, info, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật thông tin bác sĩ thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật thông tin bác sĩ thất bại!");
            throw err;
        }
    };
    
    const getPharmacyInfo = async (pharmacyId) => {
        try {
            const res = await api.get(`/profile/pharmacy/get/${pharmacyId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Lấy thông tin dược sĩ thất bại!");
            throw err;
        }
    };

    const updatePharmacyInfo = async (pharmacyId, info) => {
        try {
            const res = await api.put(`/profile/pharmacy/update/${pharmacyId}`, info, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật thông tin nhà thuốc thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật thông tin dược sĩ thất bại!");
            throw err;
        }
    };

    const getDoctorDropdown = async () => {
        try {
            const res = await api.get("/profile/doctor/dropdowns", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách bác sĩ!");
            throw err;
        }
    };

    const createAppointment = async (appointmentData) => {
        try {
            const res = await api.post("/appointment", appointmentData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Đặt lịch khám thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Đặt lịch khám thất bại!");
            throw err;
        }
    };

    const getAllAppointments = async () => {
        try {
            const res = await api.get("/appointment", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách lịch hẹn!");
            throw err;
        }
    };

    const getAppointmentById = async (id) => {
        try {
            const res = await api.get(`/appointment/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải chi tiết lịch hẹn!");
            throw err;
        }
    };

    const getAppointmentsByPatient = async (patientId) => {
        try {
            const res = await api.get(`/appointment/patient/${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách lịch hẹn của bệnh nhân!");
            throw err;
        }
    };

    const cancelAppointment = async (appointmentId, reason) => {
        try {
            const res = await api.put(
            `/appointment/${appointmentId}/cancel`,
            null,
            {
                params: { reason },
                headers: { Authorization: `Bearer ${accessToken}` },
            }
            );
            successNotification(`Đã hủy lịch hẹn #${appointmentId}`);
            return res.data;
        } catch (err) {
            errorNotification("Không thể hủy lịch hẹn!");
            throw err;
        }
    };

    const getAppointmentsByDoctor = async (doctorId) => {
        try {
            const res = await api.get(`/appointment/doctor/${doctorId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách lịch hẹn của bác sĩ!");
            throw err;
        }
    };

    const updateAppointment = async (id, appointmentData) => {
        try {
            const res = await api.put(`/appointment/${id}`, appointmentData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật lịch hẹn thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật lịch hẹn thất bại!");
            throw err;
        }
    };

    const updateAppointmentStatus = async (id, status, reason, newDateTime) => {
        try {
            const res = await api.patch(`/appointment/${id}/status`, null, {
                params: { status, reason, newDateTime },
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật trạng thái lịch hẹn thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật trạng thái thất bại!");
            throw err;
        }
    };

    const getAppointmentDetailsWithName = async (id) => {
        try {
            const res = await api.get(`/appointment/details/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải thông tin chi tiết lịch hẹn!");
            throw err;
        }
    };

    const createApRecord = async (ApReportDto) => {
        try {
            const res = await api.post("/appointment/report", ApReportDto, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Tạo hồ sơ khám thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Tạo hồ sơ khám thất bại!");
            throw err;
        }
    }

    const isRecordExists = async (appointmentId) => {
        try {
            const res = await api.get(`/appointment/report/isRecordExists/${appointmentId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Kiểm tra hồ sơ khám thất bại!");
            throw err;
        }
    };

    const getRecordsByPatientId = async (patientId) => {
        try {
            const res = await api.get(`/appointment/report/getRecordByPatientId/${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Lấy hồ sơ khám thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Lấy hồ sơ khám thất bại!");
            throw err;
        }
    };

    const getPrescriptionsByPatientId = async (patientId) => {
        try {
            const res = await api.get(`/appointment/report/getPrescriptionsByPatientId/${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            // successNotification("Lấy danh sách đơn thuốc thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Lấy danh sách đơn thuốc thất bại!");
            throw err;
        }
    };

    // Lấy tất cả thuốc
    const getAllMedicines = async () => {
        try {
            const res = await api.get("/pharmacy/medicines", {
            headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Lấy danh sách thuốc thất bại!");
            throw err;
        }
    };

    // Lấy thông tin thuốc theo ID
    const getMedicineById = async (id) => {
        try {
            const res = await api.get(`/pharmacy/medicines/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
                return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Không thể lấy thông tin thuốc!");
            throw err;
        }
    };

    // Thêm thuốc mới
    const addMedicine = async (medicineDto) => {
        try {
                const res = await api.post("/pharmacy/medicines", medicineDto, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
                successNotification("Thêm thuốc mới thành công!");
                return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Thêm thuốc thất bại!");
            throw err;
        }
    };

    // Cập nhật thuốc
    const updateMedicine = async (medicineDto) => {
        try {
            await api.put(`/pharmacy/medicines`, medicineDto, {
            headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật thuốc thành công!");
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật thuốc thất bại!");
            throw err;
        }
    };

    // Xóa thuốc
    const deleteMedicine = async (id) => {
        try {
            await api.delete(`/pharmacy/medicines/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Xóa thuốc thành công!");
        } catch (err) {
            errorNotification(err.response?.data?.message || "Xóa thuốc thất bại!");
            throw err;
        }
    };

    // Lấy toàn bộ tồn kho
    const getAllMedicineInventories = async () => {
    try {
        const res = await api.get("/pharmacy/inventory", {
        headers: { Authorization: `Bearer ${accessToken}` },
        });
        return res.data;
    } catch (err) {
        errorNotification("Không thể tải danh sách tồn kho!");
        throw err;
    }
    };

    // Lấy tồn kho theo ID
    const getMedicineInventoryById = async (id) => {
    try {
        const res = await api.get(`/pharmacy/inventory/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        });
        return res.data;
    } catch (err) {
        errorNotification(err.response?.data?.message || "Không thể tải chi tiết tồn kho!");
        throw err;
    }
    };

    // Thêm tồn kho mới
    const addMedicineInventory = async (data) => {
    try {
        const res = await api.post("/pharmacy/inventory", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
        });
        successNotification("Thêm tồn kho thành công!");
        return res.data;
    } catch (err) {
        errorNotification(err.response?.data?.message || "Thêm tồn kho thất bại!");
        throw err;
    }
    };

    // Cập nhật tồn kho
    const updateMedicineInventory = async (data) => {
    try {
        const res = await api.put("/pharmacy/inventory", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
        });
        successNotification("Cập nhật tồn kho thành công!");
        return res.data;
    } catch (err) {
        errorNotification(err.response?.data?.message || "Cập nhật tồn kho thất bại!");
        throw err;
    }
    };

    // Xóa tồn kho
    const deleteMedicineInventory = async (id) => {
        try {
            await api.delete(`/pharmacy/inventory/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Xóa tồn kho thành công!");
        } catch (err) {
            errorNotification(err.response?.data?.message || "Xóa tồn kho thất bại!");
            throw err;
        }
    };

    const createSale = async (saleData) => {
        try {
            const res = await api.post("/pharmacy/sales", saleData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Tạo đơn bán hàng thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Tạo đơn bán hàng thất bại!");
            throw err;
        }
    };

    const updateSale = async (saleData) => {
        try {
            const res = await api.put("/pharmacy/sales", saleData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật đơn bán hàng thành công!");
            return res.data;
        } catch (err) {
            errorNotification(err.response?.data?.message || "Cập nhật đơn bán hàng thất bại!");
            throw err;
        }
    };

    const getSaleItemsBySaleId = async (saleId) => {
        try {
            const res = await api.get(`/pharmacy/sales/getSaleItems/${saleId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải chi tiết đơn bán hàng!");
            throw err;
        }
    };

    const getSaleById = async (saleId) => {
        try {
            const res = await api.get(`/pharmacy/sales/get/${saleId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải chi tiết đơn bán hàng!");
            throw err;
        }
    };

    const getAllSales = async () => {
        try {
            const res = await api.get("/pharmacy/sales/getAll", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách đơn bán hàng!");
            throw err;
        }
    };

    const getMedicineDropdown = async () => {
        try {
            const res = await api.get("/pharmacy/medicines/dropdown", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách thuốc!");
            throw err;
        }
    };

    const getAllPrescriptions = async () => {
        try {
            const res = await api.get("/appointment/report/getAllPrescriptions", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách đơn thuốc!");
            throw err;
        }
    };

    const getMedicinesByPrescriptionId = async (prescriptionId) => {
        try {
            const res = await api.get(`/appointment/report/getMedicinesByPrescriptionId/${prescriptionId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách thuốc theo đơn thuốc!");
            throw err;
        }
    };

    const getAllPatients = async () => {
        try {
            const res = await api.get("/profile/patient/getAll", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách bệnh nhân!");
            throw err;
        }
    };

    const getAllDoctors = async () => {
        try {
            const res = await api.get("/profile/doctor/getAll", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách bác sĩ!");
            throw err;
        }
    };

    const uploadMedia = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await api.post("/media/upload", formData, {
                headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải lên tệp!");
            throw err;
        }
    };

    const getMedia = async (mediaId) => {
        try {
            const res = await api.get(`/media/${mediaId}/image`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                responseType: 'blob',  // Quan trọng: để axios trả blob cho image
            });
            return res.data;  // Blob
        } catch (err) {
            errorNotification("Không thể tải ảnh!");
            throw err;
        }
    };

    const saveImageId = async (id, imageId) => {
        try {
            const res = await api.put(`/user/saveImageId/${id}/${imageId}`);
            successNotification("Cập nhật hình ảnh thành công!");
            console.log('Save image success:', res.data); // Log để debug
            return res.data;
        } catch (err) {
            console.error('Save image error:', err); // Log để debug
            errorNotification("Cập nhật hình ảnh thất bại!");
            throw err;
        }
    };

    const getMonthlyRegistrations = async () => {
        try {
            const res = await api.get("/user/get-registrations-count", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải dữ liệu đăng ký hàng tháng!");
            throw err;
        }
    };

    const getAppointmentCountByPatient = async (patientId) => {
        try {
            const res = await api.get(`/appointment/countByPatient/${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải số lượng lịch hẹn của bệnh nhân!");
            throw err;
        }
    };

    const getAppointmentCountByDoctor = async (doctorId) => {
        try {
            const res = await api.get(`/appointment/countByDoctor/${doctorId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải số lượng lịch hẹn của bác sĩ!");
            throw err;
        }
    };

    const getAppointmentCount = async () => {
        try {
            const res = await api.get("/appointment/count", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải số lượng lịch hẹn!");
            throw err;
        }
    };

    const getReasonsCountByPatient = async (patientId) => {
        try {
            const res = await api.get(`/appointment/reasonCountByPatient//${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải số lượng lý do lịch hẹn của bệnh nhân!");
            throw err;
        }
    };

    const getReasonsCountByDoctor = async (doctorId) => {
        try {
            const res = await api.get(`/appointment/reasonCountByDoctor/${doctorId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải số lượng lý do lịch hẹn của bác sĩ!");
            throw err;
        }
    };

    const getReasonsCount = async () => {
        try {
            const res = await api.get("/appointment/reasonCount", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải số lượng lý do lịch hẹn!");
            throw err;
        }
    };

    const getMedicineByPatientId = async (patientId) => {
        try {
            const res = await api.get(`/appointment/report/getMedicinesByPatientId/${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải thông tin thuốc của bệnh nhân!");
            throw err;
        }
    };

    const getTodaysAppointments = async () => {
        try {
            const res = await api.get("/appointment/todaysAppointments", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách lịch hẹn hôm nay!");
            throw err;
        }
    };

    const getApRecordDetail = async (appointmentId) => {
        try {
            const res = await api.get(`/appointment/report/getAp/detail/${appointmentId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải chi tiết hồ sơ khám!");
            throw err;
        }
    };

    const getFamilyDetail = async (familyId) => {
        try {
            const res = await api.get(`/family/${familyId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải thông tin hồ sơ gia đình!");
            throw err;
        }
    };

    const getFamilyMembers = async (familyId) => {
        try {
            const res = await api.get(`/family/${familyId}/members`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return res.data;
        } catch (err) {
            errorNotification("Không thể tải danh sách thành viên trong gia đình!");
            throw err;
        }
    };

    const addMemberToFamily = async (payload) => {
        try {
            const res = await api.post(`/family/add-member`, payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Thêm thành viên thành công!");
            return res.data;
        } catch (err) {
            errorNotification("Không thể thêm thành viên vào gia đình!");
            throw err;
        }
    };

    const removeMemberFromFamily = async (familyId, patientId) => {
        try {
            await api.delete(`/family/${familyId}/member/${patientId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Xóa thành viên thành công!");
        } catch (err) {
            errorNotification("Không thể xóa thành viên!");
            throw err;
        }
    };

    const createFamily = async (creatorId, familyData) => {
        try {
            const res = await api.post(`/family/create/${creatorId}`, familyData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Tạo hồ sơ gia đình thành công!");
            return res.data; // id gia đình
        } catch (err) {
            errorNotification("Không thể tạo hồ sơ gia đình!");
            throw err;
        }
    };

    const updateFamily = async (familyId, familyData) => {
        try {
            const res = await api.put(`/family/update/${familyId}`, familyData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Cập nhật hồ sơ gia đình thành công!");
            return res.data;
        } catch (err) {
            errorNotification("Không thể cập nhật hồ sơ gia đình!");
            throw err;
        }
    };

    const deleteFamily = async (familyId, requesterId, requesterRole) => {
        try {
            await api.delete(`/family/delete/${familyId}`, {
                params: { requesterId, requesterRole },
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            successNotification("Xóa hồ sơ gia đình thành công!");
        } catch (err) {
            errorNotification("Không thể xóa hồ sơ gia đình!");
            throw err;
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                login,
                googleLogin,
                saveLoginData,
                getPatientInfo,
                updatePatientInfo,
                getDoctorInfo,
                updateDoctorInfo,
                getPharmacyInfo,
                updatePharmacyInfo,
                getDoctorDropdown,
                createAppointment,
                getAllAppointments,
                getAppointmentById,
                getAppointmentsByPatient,
                getAppointmentsByDoctor,
                updateAppointment,
                updateAppointmentStatus,
                getAppointmentDetailsWithName,
                cancelAppointment,
                createApRecord,
                isRecordExists,
                getRecordsByPatientId,
                getPrescriptionsByPatientId,
                getAllMedicines,
                getMedicineById,
                addMedicine,
                updateMedicine,
                deleteMedicine,
                getAllMedicineInventories,
                getMedicineInventoryById,
                addMedicineInventory,
                updateMedicineInventory,
                deleteMedicineInventory,
                createSale,
                updateSale,
                getSaleItemsBySaleId,
                getSaleById,
                getAllSales,
                getMedicineDropdown,
                getAllPrescriptions,
                getMedicinesByPrescriptionId,
                getAllPatients,
                getAllDoctors,
                uploadMedia,
                getMedia,
                saveImageId,
                getMonthlyRegistrations,
                getAppointmentCountByPatient,
                getAppointmentCountByDoctor,
                getAppointmentCount,
                getReasonsCountByPatient,
                getReasonsCountByDoctor,
                getReasonsCount,
                getMedicineByPatientId,
                getTodaysAppointments,
                getApRecordDetail,
                getFamilyDetail,
                getFamilyMembers,
                addMemberToFamily,
                removeMemberFromFamily,
                createFamily,
                updateFamily,
                deleteFamily,
                logout,
                refresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};