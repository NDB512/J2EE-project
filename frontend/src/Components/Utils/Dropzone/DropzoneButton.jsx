import { useRef, useState } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Text, useMantineTheme, Image, Center, Loader } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from './DropzoneButton.module.css';
import { useAuth } from '../../../Content/AuthContext';

export function DropzoneButton({ close, form, fieldName, onUploadComplete }) {
    const theme = useMantineTheme();
    const openRef = useRef();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { uploadMedia } = useAuth();

    const handleDrop = (acceptedFiles) => {
        const previewFiles = acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setFiles(previewFiles);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setLoading(true);
        try {
            const result = await uploadMedia(files[0]); // upload
            form.setFieldValue(fieldName, result.id); // gán id ảnh vào form
            console.log("Image ID sau khi upload:", result.id);
            onUploadComplete?.(result.id); // Gọi callback để lưu vào updateUserInfo
            close?.(); // đóng modal nếu có
        } catch (error) {
            console.error('Lỗi upload:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.wrapper}>
            {files.length === 0 ? (
                <>
                    <Dropzone
                        openRef={openRef}
                        onDrop={handleDrop}
                        className={classes.dropzone}
                        radius="md"
                        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp]}
                        maxSize={5 * 1024 ** 2}
                    >
                        <div style={{ pointerEvents: 'none' }}>
                            <Group justify="center">
                                <Dropzone.Accept>
                                    <IconDownload size={60} color={theme.colors.blue[6]} stroke={1.5} />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX size={60} color={theme.colors.red[6]} stroke={1.5} />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconCloudUpload size={60} stroke={1.5} className={classes.icon} />
                                </Dropzone.Idle>
                            </Group>

                            <Text ta="center" fw={700} fz="xl" mt="xl">
                                <Dropzone.Accept>Thả ảnh vào đây để tải lên</Dropzone.Accept>
                                <Dropzone.Reject>Chỉ chấp nhận ảnh dưới 5MB</Dropzone.Reject>
                                <Dropzone.Idle>Chọn hoặc kéo thả ảnh để tải lên</Dropzone.Idle>
                            </Text>

                            <Text className={classes.description}>
                                Kéo thả ảnh vào đây để tải lên. Hỗ trợ <i>.png, .jpg, .jpeg, .webp</i> (tối đa <b>5MB</b>).
                            </Text>
                        </div>
                    </Dropzone>

                    <Button
                        className={classes.control}
                        size="md"
                        radius="xl"
                        onClick={() => openRef.current?.()}
                    >
                        Chọn ảnh
                    </Button>
                </>
            ) : (
                <Center mt="xl" style={{ gap: 24, flexWrap: 'wrap' }}>
                    {files.map((file, index) => (
                        <Image
                            key={index}
                            src={file.preview}
                            alt={file.name}
                            radius="lg"
                            width={300}
                            height={300}
                            fit="cover"
                            withPlaceholder
                            style={{
                                boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                                border: `2px solid ${theme.colors.gray[3]}`,
                            }}
                        />
                    ))}
                </Center>
            )}

            {/* Nút dưới */}
            {files.length > 0 && (
                <Center mt="lg" style={{ gap: 12 }}>
                    <Button
                        size="md"
                        color="red"
                        radius="xl"
                        onClick={() => setFiles([])}
                        disabled={loading}
                    >
                        Sửa ảnh
                    </Button>

                    <Button
                        radius="xl"
                        size="md"
                        color="green"
                        onClick={handleUpload}
                        loading={loading}
                    >
                        Lưu ảnh
                    </Button>
                </Center>
            )}
        </div>
    );
}