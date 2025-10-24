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
    const googleLogin = (accessToken, refreshToken, user) => { // Giữ param user cho tương thích, nhưng ưu tiên decode nếu cần
        const decoded = decodeToken(accessToken);
        const userData = user || {
            id: decoded?.id,
            name: decoded?.name,
            email: decoded?.email,
            role: decoded?.role,
            profileId: decoded?.profileId,
        };

        dispatch(setAuth({ accessToken, refreshToken, user: userData }));
        successNotification("Đăng nhập Google thành công!");
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

    const cancelAppointment = async (appointmentId, reason, accessToken) => {
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
                logout,
                refresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};