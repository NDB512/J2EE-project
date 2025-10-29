import React from "react";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Content/AuthContext";
import { successNotification } from "../Utils/Notification";

const UnauthorizedPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    successNotification("Đăng xuất thành công!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white p-4 sm:p-6">
      <div className="w-full max-w-sm">
        <Card
          shadow="xl"
          radius="xl"
          withBorder
          className="text-center p-8 sm:p-10 bg-white/95 backdrop-blur-lg border-red-100"
        >
          <Stack align="center" gap="md" className="mb-6">
            <div className="relative">
              <IconAlertTriangle 
                size={72} 
                className="text-red-500 mb-3 drop-shadow-lg transition-transform hover:scale-110" 
              />
              <div className="absolute -inset-2 bg-red-100 rounded-full opacity-50 animate-pulse blur"></div>
            </div>
            <Title order={1} className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">
              Không có quyền truy cập
            </Title>
            <Text size="md" c="dimmed" className="leading-relaxed">
              Bạn không được phép xem trang này. Vui lòng quay lại trang trước hoặc đăng xuất để tiếp tục.
            </Text>
          </Stack>

          <Group position="center" mt="xl" spacing="lg" className="w-full">
            <Button 
              variant="outline" 
              color="gray" 
              size="md"
              leftIcon={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
              className="flex-1 min-w-[120px] transition-all hover:shadow-md"
            >
              Quay lại
            </Button>
            <Button 
              color="red" 
              size="md"
              onClick={handleLogout}
              className="flex-1 min-w-[120px] transition-all hover:shadow-lg"
            >
              Đăng xuất
            </Button>
          </Group>
        </Card>
      </div>
    </div>
  );
};

export default UnauthorizedPage;