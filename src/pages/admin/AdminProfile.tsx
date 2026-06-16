import React, { useState } from 'react';
import { Row, Col, Card, Form, Input, Button, Avatar, Upload, Typography, Space, App, Grid } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { validateImage, getBase64, getErrorMessages } from '../../lib/utils';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const AdminProfile: React.FC = () => {
    const screens = useBreakpoint();
    const { notification } = App.useApp();
    const queryClient = useQueryClient();
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const { data: admin } = useQuery({
        queryKey: ['admin-profile'],
        queryFn: async () => {
            const response = await api.get('/admin/profile');
            return response.data.data;
        },
    });

    React.useEffect(() => {
        if (admin) {
            profileForm.setFieldsValue(admin);
        }
    }, [admin, profileForm]);

    const updateProfileMutation = useMutation({
        mutationFn: (formData: FormData) => {
            formData.append('_method', 'PATCH');
            return api.post('/admin/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: (response) => {
            const updatedAdmin = response.data.data;
            localStorage.setItem('user_name', updatedAdmin.name);
            localStorage.setItem('user_avatar', updatedAdmin.avatar_url || '');
            
            window.dispatchEvent(new Event('user-profile-updated'));

            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
            
            setFileList([]);

            notification.success({
                message: 'Profile Updated',
                description: 'Your profile information has been successfully updated.',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            notification.error({
                message: 'Update Failed',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {getErrorMessages(error).map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: (values: any) => api.patch('/admin/password', values),
        onSuccess: () => {
            passwordForm.resetFields();
            notification.success({
                message: 'Password Changed',
                description: 'Your password has been successfully updated.',
                placement: 'topRight',
            });
        },
        onError: (error: any) => {
            notification.error({
                message: 'Password Update Failed',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {getErrorMessages(error).map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        }
    });

    const handleAvatarChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        const file = newFileList[0];
        if (file && !file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj);
        }
        setFileList([...newFileList]);
    };

    const onProfileFinish = (values: any) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        if (values.phone) formData.append('phone', values.phone);
        
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('avatar', fileList[0].originFileObj);
        }

        updateProfileMutation.mutate(formData);
    };

    const beforeUpload = (file: any) => {
        const validation = validateImage(file);
        if (!validation.valid) {
            notification.error({
                message: 'Upload Error',
                description: validation.message,
                placement: 'topRight',
            });
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ margin: 0 }}>Account Settings</Title>
                <Text type="secondary">Manage your profile information and security settings.</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Profile Information" bordered={false} className="shadow-sm">
                        <Form
                            form={profileForm}
                            layout="vertical"
                            initialValues={admin}
                            onFinish={onProfileFinish}
                        >
                            <Row gutter={16}>
                                <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
                                    <Space direction="vertical" align="center">
                                        <Avatar 
                                            size={100} 
                                            src={fileList[0]?.preview || fileList[0]?.url || admin?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${admin?.name || 'Admin'}`} 
                                            icon={<UserOutlined />} 
                                            style={{ border: '4px solid #f1f5f9' }}
                                        />
                                        <Upload
                                            maxCount={1}
                                            fileList={fileList}
                                            beforeUpload={beforeUpload}
                                            onChange={handleAvatarChange}
                                            showUploadList={false}
                                        >
                                            <Button icon={<UploadOutlined />}>Change Avatar</Button>
                                        </Upload>
                                    </Space>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                        <Input prefix={<UserOutlined />} placeholder="Your Name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                                        <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="phone" label="Phone Number">
                                        <Input prefix={<PhoneOutlined />} placeholder="0812..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />} 
                                loading={updateProfileMutation.isPending}
                                size="large"
                                style={{ background: '#4f46e5' }}
                                block={!screens.md}
                            >
                                Save Changes
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Change Password" bordered={false} className="shadow-sm">
                        <Paragraph type="secondary">
                            Ensure your account is using a long, random password to stay secure.
                        </Paragraph>
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={(values) => updatePasswordMutation.mutate(values)}
                        >
                            <Form.Item name="current_password" label="Current Password" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                            </Form.Item>
                            <Form.Item name="password" label="New Password" rules={[{ required: true, min: 8 }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                            </Form.Item>
                            <Form.Item 
                                name="password_confirmation" 
                                label="Confirm Password" 
                                dependencies={['password']}
                                rules={[
                                    { required: true },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                            </Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                loading={updatePasswordMutation.isPending}
                                style={{ background: '#4f46e5' }}
                            >
                                Update Password
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default AdminProfile;
