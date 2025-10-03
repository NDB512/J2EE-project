import { PasswordInput, TextInput, Button, Tabs } from '@mantine/core'
import React from 'react'
import { useForm } from '@mantine/form'

const RegisterPage = () => {
    // Form cho user
    const userForm = useForm({
        initialValues: { email: '', password: '', confirmPassword: '' },
        validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
        password: (value) => (value.length >= 6 ? null : 'Mật khẩu phải >= 6 ký tự'),
        confirmPassword: (value, values) =>
            value !== values.password ? 'Mật khẩu xác nhận không khớp' : null,
        },
    })

    // Form cho doctor
    const doctorForm = useForm({
        initialValues: { email: '', password: '', confirmPassword: '', license: '' },
        validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
        password: (value) => (value.length >= 6 ? null : 'Mật khẩu phải >= 6 ký tự'),
        confirmPassword: (value, values) =>
            value !== values.password ? 'Mật khẩu xác nhận không khớp' : null,
        license: (value) => (value.trim() ? null : 'Vui lòng nhập mã giấy phép hành nghề'),
        },
    })

    // Form cho pharmacy
    const pharmacyForm = useForm({
        initialValues: { email: '', password: '', confirmPassword: '', pharmacyName: '' },
        validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
        password: (value) => (value.length >= 6 ? null : 'Mật khẩu phải >= 6 ký tự'),
        confirmPassword: (value, values) =>
            value !== values.password ? 'Mật khẩu xác nhận không khớp' : null,
        pharmacyName: (value) => (value.trim() ? null : 'Vui lòng nhập tên nhà thuốc'),
        },
    })

    const handleSubmit = (values, role) => {
        console.log(`✅ Dữ liệu đăng ký cho ${role}:`, values)
    }

    return (
        <div
        style={{ backgroundImage: 'url("/bg.jpeg")' }}
        className="h-screen w-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
        >
            <div className="w-[500px] bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng ký tài khoản</h1>

                <Tabs defaultValue="user" color="red">
                    <Tabs.List grow>
                        <Tabs.Tab value="user">Người dùng</Tabs.Tab>
                        <Tabs.Tab value="doctor">Bác sĩ</Tabs.Tab>
                        <Tabs.Tab value="pharmacy">Nhà thuốc</Tabs.Tab>
                    </Tabs.List>

                    {/* User */}
                    <Tabs.Panel value="user" pt="xs">
                        <form
                        className="flex flex-col gap-4 mt-4"
                        onSubmit={userForm.onSubmit((v) => handleSubmit(v, 'user'))}
                        >
                        <TextInput withAsterisk label="Email" placeholder="Nhập email" {...userForm.getInputProps('email')} />
                        <PasswordInput withAsterisk label="Mật khẩu" placeholder="Nhập mật khẩu" {...userForm.getInputProps('password')} />
                        <PasswordInput withAsterisk label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" {...userForm.getInputProps('confirmPassword')} />
                        <Button type="submit" fullWidth className="bg-red-500 hover:bg-red-600 text-white">Đăng ký người dùng</Button>
                        </form>
                    </Tabs.Panel>

                    {/* Doctor */}
                    <Tabs.Panel value="doctor" pt="xs">
                        <form
                        className="flex flex-col gap-4 mt-4"
                        onSubmit={doctorForm.onSubmit((v) => handleSubmit(v, 'doctor'))}
                        >
                        <TextInput withAsterisk label="Email" placeholder="Nhập email" {...doctorForm.getInputProps('email')} />
                        <PasswordInput withAsterisk label="Mật khẩu" placeholder="Nhập mật khẩu" {...doctorForm.getInputProps('password')} />
                        <PasswordInput withAsterisk label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" {...doctorForm.getInputProps('confirmPassword')} />
                        <TextInput withAsterisk label="Mã giấy phép hành nghề" placeholder="Nhập số giấy phép" {...doctorForm.getInputProps('license')} />
                        <Button type="submit" fullWidth className="bg-red-500 hover:bg-red-600 text-white">Đăng ký bác sĩ</Button>
                        </form>
                    </Tabs.Panel>

                    {/* Pharmacy */}
                    <Tabs.Panel value="pharmacy" pt="xs">
                        <form
                        className="flex flex-col gap-4 mt-4"
                        onSubmit={pharmacyForm.onSubmit((v) => handleSubmit(v, 'pharmacy'))}
                        >
                        <TextInput withAsterisk label="Email" placeholder="Nhập email" {...pharmacyForm.getInputProps('email')} />
                        <PasswordInput withAsterisk label="Mật khẩu" placeholder="Nhập mật khẩu" {...pharmacyForm.getInputProps('password')} />
                        <PasswordInput withAsterisk label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" {...pharmacyForm.getInputProps('confirmPassword')} />
                        <TextInput withAsterisk label="Tên nhà thuốc" placeholder="Nhập tên nhà thuốc" {...pharmacyForm.getInputProps('pharmacyName')} />
                        <Button type="submit" fullWidth className="bg-red-500 hover:bg-red-600 text-white">Đăng ký nhà thuốc</Button>
                        </form>
                    </Tabs.Panel>
                </Tabs>

                {/* Đăng nhập */}
                <div className="text-center text-sm mt-6">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <a href="/login" className="text-red-500 font-medium hover:underline">
                    Đăng nhập ngay
                </a>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
