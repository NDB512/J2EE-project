import { PasswordInput, TextInput, Button } from '@mantine/core'
import React from 'react'
import { useForm } from '@mantine/form'
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const LoginPage = () => {
    const form = useForm({
        initialValues: {
        email: '',
        password: '',
        },

        validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
        password: (value) =>
            value.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự',
        },
    })

    const handleSubmit = (values) => {
        console.log('✅ Dữ liệu form:', values)
    }

    return (
        <div
        style={{ backgroundImage: 'url("/bg.jpeg")' }}
        className="h-screen w-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
        >
            {/* Box login */}
            <div className="w-[400px] bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10">
                <form className="flex flex-col gap-6" onSubmit={form.onSubmit(handleSubmit)}>
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-800">Đăng nhập</h1>

                    {/* Inputs */}
                    <TextInput
                        withAsterisk
                        label="Email"
                        variant="filled"
                        size="md"
                        radius="md"
                        placeholder="Nhập email"
                        {...form.getInputProps('email')}
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
                        />
                        <div className="flex justify-end mt-1">
                        <Link to='/forgot' className="text-sm text-red-500 hover:underline">
                            Quên mật khẩu?
                        </Link>
                        </div>
                    </div>

                    {/* Button login */}
                    <Button
                        type="submit"
                        fullWidth
                        radius="md"
                        size="md"
                        className="bg-red-500 hover:bg-red-600 text-white font-medium"
                    >
                        Đăng nhập
                    </Button>

                    {/* Hoặc */}
                    <div className="flex items-center gap-2 my-2">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">Hoặc</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Social login */}
                    <div className="flex flex-col gap-3">
                        {/* Google */}
                        <GoogleLogin
                        onSuccess={credentialResponse => {
                            const idToken = credentialResponse.credential;
                            fetch('http://localhost:9000/user/login/google', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ idToken })
                            })
                            .then(res => res.json())
                            .then(user => {
                            console.log('Google login success:', user);
                            // Lưu user vào state/context, redirect
                            })
                            .catch(err => console.error('Google login error:', err));
                        }}
                        onError={() => console.log('Google login failed')}
                        />

                        {/* Facebook */}
                        <Button
                        fullWidth
                        radius="md"
                        size="md"
                        className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium flex items-center justify-center gap-2"
                        leftSection={<IconBrandFacebook size={18} color="white" />}
                        >
                        Đăng nhập bằng Facebook
                        </Button>
                    </div>

                    {/* Đăng ký */}
                    <div className="text-center text-sm mt-4">
                        <span className="text-gray-600">Chưa có tài khoản? </span>
                        <Link to="/register" className="text-red-500 font-medium hover:underline">
                        Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
