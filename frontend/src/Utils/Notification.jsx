import { notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react';

const successNotification = (message) => {
    notifications.show({
        title: 'Thành công',
        message: message || 'Thao tác thành công!',
        color: 'green',
        icon: <IconCheck />,
        withCloseButton: true,
        withBorder: true,
        className: '!border-green-500',
    });
};

const errorNotification = (message) => {
    notifications.show({
        title: 'Lỗi',
        message: message || 'Đã xảy ra lỗi!',
        color: 'red',
        icon: <IconX />,
        withCloseButton: true,
        withBorder: true,
        className: '!border-red-500',
    });
};

export { successNotification, errorNotification };
