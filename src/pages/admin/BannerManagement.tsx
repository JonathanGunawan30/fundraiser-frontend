import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, InputNumber, Upload, Avatar, DatePicker, Typography, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, PictureOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Banner, PaginatedResponse } from '../../types';
import dayjs from 'dayjs';
import { getErrorMessages, validateImage, getBase64 } from '../../lib/utils';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Title, Text } = Typography;

const BannerManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<Banner>>({
        queryKey: ['admin-banners'],
        queryFn: async () => {
            const response = await api.get('/banners');
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (formData: FormData) => api.post('/admin/banners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Banner created successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        },
        onError: (error: any) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Validation Error',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number, formData: FormData }) => {
            formData.append('_method', 'PUT');
            return api.post(`/admin/banners/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Banner updated successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        },
        onError: (error: any) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Validation Error',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/admin/banners/${id}`),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Banner deleted',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        },
        onError: (error: any) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Validation Error',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        },
    });

    const showModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            form.setFieldsValue({
                ...banner,
                start_at: banner.start_at ? dayjs(banner.start_at) : null,
                end_at: banner.end_at ? dayjs(banner.end_at) : null,
            });
            if (banner.image_url) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'current-banner.png',
                        status: 'done',
                        url: banner.image_url,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else {
            setEditingBanner(null);
            form.resetFields();
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBanner(null);
        form.resetFields();
        setFileList([]);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        const file = newFileList[0];
        if (file && !file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setFileList([...newFileList]);
    };

    const onFinish = (values: any) => {
        const formData = new FormData();
        formData.append('title', values.title);
        if (values.link_url) formData.append('link_url', values.link_url);
        formData.append('is_active', values.is_active ? '1' : '0');
        if (values.order_index !== undefined) formData.append('order_index', values.order_index.toString());
        if (values.start_at) formData.append('start_at', values.start_at.format('YYYY-MM-DD HH:mm:ss'));
        if (values.end_at) formData.append('end_at', values.end_at.format('YYYY-MM-DD HH:mm:ss'));

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('image', fileList[0].originFileObj);
        }

        if (editingBanner) {
            updateMutation.mutate({ id: editingBanner.id, formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image',
            render: (url: string) => (
                <Avatar 
                    src={url} 
                    shape="square" 
                    size={80} 
                    style={{ background: '#f1f5f9', padding: 4 }}
                    icon={<PictureOutlined style={{ color: '#4f46e5' }} />} 
                />
            ),
        },
        { 
            title: 'Title', 
            dataIndex: 'title', 
            key: 'title',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'status',
            render: (active: boolean) => (
                <Tag color={active ? 'success' : 'error'} icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            ),
        },
        { title: 'Order', dataIndex: 'order_index', key: 'order' },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: Banner) => (
                <Space size="middle">
                    <Button 
                        type="text" 
                        icon={<EditOutlined style={{ color: '#4f46e5' }} />} 
                        onClick={() => showModal(record)} 
                    />
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => {
                            modal.confirm({
                                title: 'Delete Banner?',
                                content: 'Are you sure you want to delete this banner? This action cannot be undone.',
                                okText: 'Delete',
                                okType: 'danger',
                                cancelText: 'Cancel',
                                centered: true,
                                onOk: () => deleteMutation.mutate(record.id),
                            });
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="page-header">
                <div>
                    <Title level={2} style={{ margin: 0 }}>Banner Management</Title>
                    <Text type="secondary">Manage promotional banners for the platform home page.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
                    Add Banner
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data?.data}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    total: data?.meta.total,
                    pageSize: data?.meta.per_page,
                    current: data?.meta.current_page,
                    showSizeChanger: true,
                }}
                styles={{ header: { background: '#f8fafc' } }}
            />

            <Modal
                title={editingBanner ? "Edit Banner" : "Add New Banner"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ is_active: true, order_index: 0 }}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item name="title" label="Banner Title" rules={[{ required: true, message: 'Please enter banner title' }]}>
                        <Input placeholder="e.g. Promo Ramadhan" />
                    </Form.Item>
                    <Form.Item name="link_url" label="Link URL">
                        <Input placeholder="https://..." />
                    </Form.Item>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="start_at" label="Start Date">
                            <DatePicker showTime style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="end_at" label="End Date">
                            <DatePicker showTime style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="order_index" label="Order Index">
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="is_active" label="Active Status" valuePropName="checked">
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Banner Image">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={(file) => {
                                const result = validateImage(file);
                                if (!result.valid) {
                                    notification.error({
                                        message: 'Upload Error',
                                        description: result.message,
                                        placement: 'topRight',
                                    });
                                    return Upload.LIST_IGNORE;
                                }
                                return false;
                            }}
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large" 
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingBanner ? "Update Banner" : "Create Banner"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)} centered title="Banner Preview">
                <img alt="preview" style={{ width: '100%', borderRadius: 8 }} src={previewImage} />
            </Modal>
        </Space>
    );
};

export default BannerManagement;
