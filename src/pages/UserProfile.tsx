import React, { useState } from 'react';
import { Typography, Row, Col, Card, Avatar, Button, Form, Input, Divider, App, Spin, Upload } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CameraOutlined, SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { getErrorMessages } from '../lib/utils';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
    const { notification } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch user details from backend
    const { data: userData, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await api.get('/auth/profile');
            return response.data.data;
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (values: { name: string; phone?: string }) => {
            const formData = new FormData();
            formData.append('_method', 'PATCH'); // Laravel handles PATCH with FormData via _method
            formData.append('name', values.name);
            if (values.phone) formData.append('phone', values.phone);
            if (avatarFile) formData.append('avatar', avatarFile);

            const response = await api.post('/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        },
        onSuccess: (updatedUser) => {
            notification.success({
                message: 'Profil Diperbarui',
                description: 'Data profil Anda telah berhasil disimpan.',
                placement: 'topRight',
            });
            
            // Sync local storage
            localStorage.setItem('user_name', updatedUser.name);
            localStorage.setItem('user_avatar', updatedUser.avatar_url || '');
            
            setAvatarFile(null);
            setPreviewUrl(null);
            
            // Refresh data
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: (error) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Gagal Memperbarui Profil',
                description: messages[0] || 'Terjadi kesalahan.',
                placement: 'topRight',
            });
        }
    });

    const onFinish = (values: { name: string; phone?: string }) => {
        updateProfileMutation.mutate(values);
    };

    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                notification.error({ message: 'Anda hanya dapat mengunggah file gambar!' });
                return Upload.LIST_IGNORE;
            }
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
                notification.error({ message: 'Gambar harus lebih kecil dari 1MB!' });
                return Upload.LIST_IGNORE;
            }

            setAvatarFile(file as File);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target?.result as string);
            reader.readAsDataURL(file);
            return false; // Prevent auto upload
        },
        showUploadList: false,
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" tip="Memuat profil..." />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2} style={{ fontWeight: 700, marginBottom: 32 }}>Pengaturan Profil</Title>
            
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card style={{ textAlign: 'center', borderRadius: 16 }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar 
                                size={120} 
                                src={previewUrl || userData?.avatar_url} 
                                icon={<UserOutlined />} 
                                style={{ border: '4px solid #f1f5f9' }} 
                            />
                            <Upload {...uploadProps}>
                                <Button 
                                    type="primary" 
                                    shape="circle" 
                                    icon={<CameraOutlined />} 
                                    size="small"
                                    style={{ position: 'absolute', bottom: 5, right: 5 }}
                                />
                            </Upload>
                        </div>
                        <Title level={4} style={{ marginTop: 16, marginBottom: 0 }}>{userData?.name}</Title>
                        <Text type="secondary">Donatur & Relawan</Text>
                        <Divider />
                        <Text style={{ fontSize: 12, color: '#94a3b8' }}>Status Akun: <Text strong style={{ color: '#10b981' }}>{userData?.status?.toUpperCase()}</Text></Text>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card style={{ borderRadius: 16 }}>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{ 
                                name: userData?.name,
                                email: userData?.email,
                                phone: userData?.phone
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Nama Lengkap"
                                name="name"
                                rules={[{ required: true, message: 'Harap masukkan nama lengkap Anda' }]}
                            >
                                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                            >
                                <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} size="large" disabled />
                            </Form.Item>

                            <Form.Item
                                label="Nomor Telepon"
                                name="phone"
                            >
                                <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} size="large" placeholder="+62 ..." />
                            </Form.Item>

                            <Divider />

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    size="large" 
                                    icon={<SaveOutlined />} 
                                    block 
                                    loading={updateProfileMutation.isPending}
                                    style={{ height: 48, fontWeight: 600 }}
                                >
                                    Simpan Perubahan
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserProfile;
