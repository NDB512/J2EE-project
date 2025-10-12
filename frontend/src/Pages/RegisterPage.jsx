import { PasswordInput, TextInput, Button, Tabs } from '@mantine/core';
import React from 'react';
import { useForm } from '@mantine/form';
import { useAuth } from '../Content/AuthContext';
import api from '../Utils/api';
import { successNotification, errorNotification } from '../Utils/Notification';
import { jwtDecode } from 'jwt-decode'; // Thêm import jwt-decode
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const { saveLoginData } = useAuth();
    const navigate = useNavigate();

    const userForm = useForm({
        initialValues: { email: '', name: '' , password: '', confirmPassword: '' },
        validate: {
            email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Email không hợp lệ'),
            password: (v) => (v.length >= 6 ? null : 'Mật khẩu phải >= 6 ký tự'),
            confirmPassword: (v, vals) =>
                v !== vals.password ? 'Mật khẩu xác nhận không khớp' : null,
            name: (v) => (v.trim() ? null : 'Vui lòng nhập họ và tên'),
        },
    });

    const doctorForm = useForm({
        initialValues: { email: '', password: '', confirmPassword: '', licenseNumber: '' },
        validate: {
            email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Email không hợp lệ'),
            password: (v) => (v.length >= 6 ? null : 'Mật khẩu phải >= 6 ký tự'),
            confirmPassword: (v, vals) =>
                v !== vals.password ? 'Mật khẩu xác nhận không khớp' : null,
            licenseNumber: (v) =>
                v.trim() ? null : 'Vui lòng nhập mã giấy phép hành nghề',
            name: (v) => (v.trim() ? null : 'Vui lòng nhập họ và tên'),
        },
    });

    const pharmacyForm = useForm({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            licenseNumber: '',
        },
        validate: {
            email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Email không hợp lệ'),
            password: (v) => (v.length >= 6 ? null : 'Mật khẩu phải >= 6 ký tự'),
            confirmPassword: (v, vals) =>
                v !== vals.password ? 'Mật khẩu xác nhận không khớp' : null,
            licenseNumber: (v) => (v.trim() ? null : 'Vui lòng nhập giấy phép nhà thuốc'),
        },
    });

    const redirectByRole = (role) => {
        switch (role) {
            case 'Patient':
                navigate('/patient');
                break;
            case 'Doctor':
                navigate('/doctor');
                break;
            case 'Pharmacy':
                navigate('/pharmacy');
                break;
            case 'Admin':
                navigate('/admin');
                break;
            default:
                navigate('/unauthorized');
                break;
        }
    };

    const handleSubmit = async (values, role) => {
        try {
            const formattedRole =
            role === 'user'
                ? 'Patient'
                : role === 'doctor'
                ? 'Doctor'
                : role === 'pharmacy'
                ? 'Pharmacy'
                : role;

            const payload = { ...values, role: formattedRole };
            // console.log('Đăng ký với dữ liệu:', payload);

            const res = await api.post('/user/register', payload);
            const data = res.data;

            if (data.accessToken && data.refreshToken) {
            // ✅ Giải mã JWT
            const decoded = jwtDecode(data.accessToken);

            const normalizedRole =
                decoded.role?.startsWith('ROLE_')
                ? decoded.role.replace('ROLE_', '')
                : decoded.role;

            const userData = {
                id: decoded.id,
                name: decoded.name || values.email.split('@')[0],
                email: decoded.email,
                role: normalizedRole,
            };

            saveLoginData(data.accessToken, data.refreshToken, userData);

            // ⚠️ Delay nhẹ để Context kịp cập nhật
            setTimeout(() => {
                redirectByRole(userData.role);
            }, 200);
            } else {
            errorNotification('Không nhận được token từ server!');
            }
        } catch (err) {
            console.error('Lỗi đăng ký:', err);
            const msg = err?.response?.data?.message || err.message;
            errorNotification('Đăng ký thất bại: ' + msg);
        }
        };

    return (
        <div
            style={{ backgroundImage: 'url("/bg.jpeg")' }}
            className="h-screen w-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
        >
            <div className="w-[500px] bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Đăng ký tài khoản
                </h1>

                <Tabs defaultValue="user" color="red">
                    <Tabs.List grow>
                        <Tabs.Tab value="user">Người dùng</Tabs.Tab>
                        <Tabs.Tab value="doctor">Bác sĩ</Tabs.Tab>
                        <Tabs.Tab value="pharmacy">Nhà thuốc</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="user" pt="xs">
                        <form
                            className="flex flex-col gap-4 mt-4"
                            onSubmit={userForm.onSubmit((v) => handleSubmit(v, 'user'))}
                        >
                            <TextInput
                                withAsterisk
                                label="Email"
                                placeholder="Nhập email"
                                {...userForm.getInputProps('email')}
                            />
                            <TextInput
                                withAsterisk
                                label="Họ và tên"
                                placeholder="Nhập Họ và tên"
                                {...userForm.getInputProps('name')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                {...userForm.getInputProps('password')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Xác nhận mật khẩu"
                                placeholder="Nhập lại mật khẩu"
                                {...userForm.getInputProps('confirmPassword')}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Đăng ký người dùng
                            </Button>
                        </form>
                    </Tabs.Panel>

                    <Tabs.Panel value="doctor" pt="xs">
                        <form
                            className="flex flex-col gap-4 mt-4"
                            onSubmit={doctorForm.onSubmit((v) => handleSubmit(v, 'doctor'))}
                        >
                            <TextInput
                                withAsterisk
                                label="Email"
                                placeholder="Nhập email"
                                {...doctorForm.getInputProps('email')}
                            />
                             <TextInput
                                withAsterisk
                                label="Họ và tên"
                                placeholder="Nhập Họ và tên"
                                {...doctorForm.getInputProps('name')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                {...doctorForm.getInputProps('password')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Xác nhận mật khẩu"
                                placeholder="Nhập lại mật khẩu"
                                {...doctorForm.getInputProps('confirmPassword')}
                            />
                            <TextInput
                                withAsterisk
                                label="Mã giấy phép hành nghề"
                                placeholder="Nhập số giấy phép"
                                {...doctorForm.getInputProps('licenseNumber')}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Đăng ký bác sĩ
                            </Button>
                        </form>
                    </Tabs.Panel>

                    <Tabs.Panel value="pharmacy" pt="xs">
                        <form
                            className="flex flex-col gap-4 mt-4"
                            onSubmit={pharmacyForm.onSubmit((v) =>
                                handleSubmit(v, 'pharmacy')
                            )}
                        >
                            <TextInput
                                withAsterisk
                                label="Email"
                                placeholder="Nhập email"
                                {...pharmacyForm.getInputProps('email')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                {...pharmacyForm.getInputProps('password')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Xác nhận mật khẩu"
                                placeholder="Nhập lại mật khẩu"
                                {...pharmacyForm.getInputProps('confirmPassword')}
                            />
                            <TextInput
                                withAsterisk
                                label="Giấy phép nhà thuốc"
                                placeholder="Giấy phép nhà thuốc"
                                {...pharmacyForm.getInputProps('licenseNumber')} // Đã khớp
                            />
                            <Button
                                type="submit"
                                fullWidth
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Đăng ký nhà thuốc
                            </Button>
                        </form>
                    </Tabs.Panel>
                </Tabs>

                <div className="text-center text-sm mt-6">
                    <span className="text-gray-600">Đã có tài khoản? </span>
                    <a
                        href="/login"
                        className="text-red-500 font-medium hover:underline"
                    >
                        Đăng nhập ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;