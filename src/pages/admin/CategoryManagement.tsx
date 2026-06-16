import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, InputNumber, Upload, Avatar, Typography, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOpenOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { CampaignCategory, PaginatedResponse } from '../../types';
import { slugify, getBase64, validateImage, getErrorMessages } from '../../lib/utils';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Title, Text } = Typography;

const CategoryManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CampaignCategory | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    // Fetch data
    const { data, isLoading } = useQuery<PaginatedResponse<CampaignCategory>>({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const response = await api.get('/campaign-categories');
            return response.data;
        },
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (formData: FormData) => api.post('/admin/campaign-categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Category created successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
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
            return api.post(`/admin/campaign-categories/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Category updated successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
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
        mutationFn: (id: number) => api.delete(`/admin/campaign-categories/${id}`),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Category deleted',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
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

    // Handlers
    const showModal = (category?: CampaignCategory) => {
        if (category) {
            setEditingCategory(category);
            form.setFieldsValue({
                name: category.name,
                slug: category.slug,
                is_active: category.is_active,
                order_index: category.order_index,
            });
            if (category.icon_url) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'current-icon.png',
                        status: 'done',
                        url: category.icon_url,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else {
            setEditingCategory(null);
            form.resetFields();
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
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
        formData.append('name', values.name);
        formData.append('slug', values.slug);
        formData.append('is_active', values.is_active ? '1' : '0');
        if (values.order_index !== undefined) formData.append('order_index', values.order_index.toString());
        
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('icon', fileList[0].originFileObj);
        }

        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const columns = [
        {
            title: 'Icon',
            dataIndex: 'icon_url',
            key: 'icon',
            render: (url: string) => (
                <Avatar 
                    src={url} 
                    shape="square" 
                    size={48} 
                    style={{ background: '#f1f5f9', padding: 4 }}
                    icon={<FolderOpenOutlined style={{ color: '#4f46e5' }} />} 
                />
            ),
        },
        { 
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        { title: 'Slug', dataIndex: 'slug', key: 'slug', render: (text: string) => <Tag>{text}</Tag> },
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
            render: (_: any, record: CampaignCategory) => (
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
                                title: 'Delete Category?',
                                content: 'Are you sure you want to delete this category? This action cannot be undone.',
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
                    <Title level={2} style={{ margin: 0 }}>Campaign Categories</Title>
                    <Text type="secondary">Manage groups for your fundraising campaigns.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
                    Add Category
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
                title={editingCategory ? "Edit Category" : "Add New Category"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ is_active: true, order_index: 0 }}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
                        <Input 
                            placeholder="e.g. Bencana Alam" 
                            onChange={(e) => {
                                if (!editingCategory) {
                                    form.setFieldsValue({ slug: slugify(e.target.value) });
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please enter slug' }]}>
                        <Input placeholder="e.g. bencana-alam" disabled />
                    </Form.Item>
                    <Form.Item name="order_index" label="Order Index">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="is_active" label="Active Status" valuePropName="checked">
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                    <Form.Item label="Category Icon">
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
                            {editingCategory ? "Update Category" : "Create Category"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)} centered title="Icon Preview">
                <img alt="preview" style={{ width: '100%', borderRadius: 8 }} src={previewImage} />
            </Modal>
        </Space>
    );
};

export default CategoryManagement;
