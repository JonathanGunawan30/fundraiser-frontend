import React, { useState } from 'react';
import { Typography, Row, Col, Card, Avatar, Button, Form, Input, Divider, App, Spin, Upload, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CameraOutlined, SaveOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { getErrorMessages, getImageUrl } from '../lib/utils';
import type { UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;

const UserProfile: React.FC = () => {
    const { notification } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data: userData, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await api.get('/auth/profile');
            return response.data.data;
        },
    });

    React.useEffect(() => {
        if (userData) {
            form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            });
        }
    }, [userData, form]);

    const updateProfileMutation = useMutation({
        mutationFn: async (values: { name: string; phone?: string }) => {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
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
            
            localStorage.setItem('user_name', updatedUser.name);
            localStorage.setItem('user_avatar', updatedUser.avatar_url || '');
            
            window.dispatchEvent(new Event('user-profile-updated'));
            
            setAvatarFile(null);
            setPreviewUrl(null);
            
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
            return false;
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
        <div style={{ padding: '40px 5%', maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
                <Title level={2} style={{ fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', fontSize: '2.2rem', letterSpacing: '-1px' }}>
                    Pengaturan Profil
                </Title>
                <Paragraph style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
                    Kelola informasi data diri, email, nomor telepon, dan foto profil Anda.
                </Paragraph>
            </div>
            
            <Row gutter={[32, 32]}>
                
                {/* Left Column - User Avatar Card */}
                <Col xs={24} lg={8}>
                    <Card 
                        bordered={false}
                        style={{ 
                            textAlign: 'center', 
                            borderRadius: '24px',
                            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.03)',
                            background: '#ffffff',
                            border: '1px solid #f1f5f9'
                        }}
                        bodyStyle={{ padding: '48px 32px' }}
                    >
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                            <Avatar 
                                size={140} 
                                src={previewUrl || getImageUrl(userData?.avatar_url)} 
                                icon={<UserOutlined />} 
                                style={{ 
                                    border: '6px solid #f8fafc',
                                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)'
                                }} 
                            />
                            <Upload {...uploadProps}>
                                <Button 
                                    type="primary" 
                                    shape="circle" 
                                    icon={<CameraOutlined style={{ fontSize: '16px' }} />} 
                                    size="large"
                                    style={{ 
                                        position: 'absolute', 
                                        bottom: 5, 
                                        right: 5,
                                        background: '#1677ff',
                                        boxShadow: '0 4px 12px rgba(22, 119, 255, 0.35)',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                            </Upload>
                        </div>
                        
                        <Title level={4} style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', fontSize: '1.25rem' }}>
                            {userData?.name}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b', display: 'block', marginBottom: '24px' }}>
                            Donatur & Relawan
                        </Text>
                        
                        <Divider style={{ margin: '24px 0', borderColor: '#f1f5f9' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Status Akun</Text>
                            <Tag 
                                icon={<CheckCircleFilled />} 
                                color="success" 
                                style={{ 
                                    borderRadius: '20px', 
                                    padding: '4px 14px', 
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {userData?.status || 'AKTIF'}
                            </Tag>
                        </div>
                    </Card>
                </Col>

                {/* Right Column - User Profile Form */}
                <Col xs={24} lg={16}>
                    <Card 
                        bordered={false}
                        style={{ 
                            borderRadius: '24px',
                            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.03)',
                            background: '#ffffff',
                            border: '1px solid #f1f5f9'
                        }}
                        bodyStyle={{ padding: '40px' }}
                    >
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
                                label={<span style={{ fontWeight: 700, color: '#475569' }}>Nama Lengkap</span>}
                                name="name"
                                rules={[{ required: true, message: 'Harap masukkan nama lengkap Anda' }]}
                                style={{ marginBottom: '24px' }}
                            >
                                <Input 
                                    prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                    size="large" 
                                    style={{ borderRadius: '10px', padding: '10px 16px', background: '#f8fafc' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ fontWeight: 700, color: '#475569' }}>Alamat Email (Tidak dapat diubah)</span>}
                                name="email"
                                style={{ marginBottom: '24px' }}
                            >
                                <Input 
                                    prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                    size="large" 
                                    disabled 
                                    style={{ borderRadius: '10px', padding: '10px 16px', background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ fontWeight: 700, color: '#475569' }}>Nomor Telepon</span>}
                                name="phone"
                                style={{ marginBottom: '40px' }}
                            >
                                <Input 
                                    prefix={<PhoneOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                    size="large" 
                                    placeholder="+62 ..." 
                                    style={{ borderRadius: '10px', padding: '10px 16px', background: '#f8fafc' }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    size="large" 
                                    icon={<SaveOutlined />} 
                                    block 
                                    loading={updateProfileMutation.isPending}
                                    style={{ 
                                        height: 52, 
                                        fontWeight: 700, 
                                        borderRadius: '12px',
                                        background: '#1677ff',
                                        boxShadow: '0 8px 20px -6px rgba(22, 119, 255, 0.4)',
                                        border: 'none',
                                        fontSize: '1rem'
                                    }}
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
