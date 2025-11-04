import { PasswordInput, TextInput, Button, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useAuth } from '../Content/AuthContext';
import { errorNotification } from '../Utils/Notification';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

const LoginPage = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: { email: '', password: '' },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
            password: (value) => (value.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự'),
        },
    });

    // Hàm điều hướng theo vai trò
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

    // Đăng nhập bằng email
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const data = await login(values.email, values.password);
            redirectByRole(data.role);
        } catch (err) {
            errorNotification(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập Google
    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const idToken = credentialResponse.credential;
            const res = await fetch('http://localhost:9000/user/login/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            if (!res.ok) throw new Error('Google login failed');
            const data = await res.json();

            // Decode JWT để lấy user info
            const decoded = jwtDecode(data.accessToken);
            console.log("Decoded JWT:", decoded);
            const userData = {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
                profileId: decoded.profileId,
                profileImageUrlId: decoded.profileImageUrlId,
            };

            // Trong handleGoogleSuccess, sau googleLogin
            googleLogin(data.accessToken, data.refreshToken, userData);
            console.log("Before redirect, role:", decoded.role);  // Log này sẽ in
            setTimeout(() => {
                redirectByRole(decoded.role);
            }, 1000);
            console.log("After navigate call");  // Log này chạy?
        } catch (err) {
            errorNotification(err.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            googleLogout();
            localStorage.clear();
        }
    }, []);

    return (
        <div
            style={{ backgroundImage: 'url("/bg.jpeg")' }}
            className="h-screen w-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
        >
            <div className="w-[400px] bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10">
                <form className="flex flex-col gap-6" onSubmit={form.onSubmit(handleSubmit)}>
                    <h1 className="text-2xl font-bold text-center text-gray-800">Đăng nhập</h1>

                    <TextInput
                        withAsterisk
                        label="Email"
                        variant="filled"
                        size="md"
                        radius="md"
                        placeholder="Nhập email"
                        {...form.getInputProps('email')}
                        disabled={loading}
                    />

                    <div>
                        <PasswordInput
                            withAsterisk
                            label="Mật khẩu"
                            variant="filled"
                            size="md"
                            radius="md"
                            placeholder="Nhập mật khẩu"
                            {...form.getInputProps('password')}
                            disabled={loading}
                        />
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot" className="text-sm text-red-500 hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        radius="md"
                        size="md"
                        className="bg-red-500 hover:bg-red-600 text-white font-medium"
                        loading={loading}
                        loader={<Loader size="sm" />}
                        disabled={loading}
                    >
                        Đăng nhập
                    </Button>

                    <div className="flex items-center gap-2 my-2">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">Hoặc</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => errorNotification('Đăng nhập Google thất bại')}
                            useOneTap={false}
                            auto_select={false}
                        />

                        <Button
                            fullWidth
                            radius="md"
                            size="md"
                            className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium flex items-center justify-center gap-2"
                            leftSection={<IconBrandFacebook size={18} color="white" />}
                            disabled={loading}
                        >
                            Đăng nhập bằng Facebook
                        </Button>
                    </div>

                    <div className="text-center text-sm mt-4">
                        <span className="text-gray-600">Chưa có tài khoản? </span>
                        <Link to="/register" className="text-red-500 font-medium hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;