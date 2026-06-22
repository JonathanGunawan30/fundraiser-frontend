import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Typography, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Tag as TagType, PaginatedResponse } from '../../types';
import { slugify, getErrorMessages } from '../../lib/utils';

const { Title, Text } = Typography;

const TagManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);
    const [form] = Form.useForm();

    const { data, isLoading } = useQuery<PaginatedResponse<TagType>>({
        queryKey: ['admin-tags'],
        queryFn: async () => {
            const response = await api.get('/tags');
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (newTag: any) => api.post('/admin/tags', newTag),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Tag created successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
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
        mutationFn: ({ id, updatedTag }: { id: number, updatedTag: any }) => 
            api.put(`/admin/tags/${id}`, updatedTag),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Tag updated successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
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
        mutationFn: (id: number) => api.delete(`/admin/tags/${id}`),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Tag deleted',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
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

    const showModal = (tag?: TagType) => {
        if (tag) {
            setEditingTag(tag);
            form.setFieldsValue(tag);
        } else {
            setEditingTag(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingTag(null);
        form.resetFields();
    };

    const onFinish = (values: any) => {
        if (editingTag) {
            updateMutation.mutate({ id: editingTag.id, updatedTag: values });
        } else {
            createMutation.mutate(values);
        }
    };

    const columns = [
        { 
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        { 
            title: 'Slug', 
            dataIndex: 'slug', 
            key: 'slug',
            render: (text: string) => <Tag icon={<TagOutlined />}>{text}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: TagType) => (
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
                                title: 'Delete Tag?',
                                content: 'Are you sure you want to delete this tag? This action cannot be undone.',
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
                    <Title level={2} style={{ margin: 0 }}>Campaign Tags</Title>
                    <Text type="secondary">Manage tags used to categorize and search campaigns.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
                    Add Tag
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
                styles={{ header: { background: '#f8fafc' } as any }}
            />

            <Modal
                title={editingTag ? "Edit Tag" : "Add New Tag"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item name="name" label="Tag Name" rules={[{ required: true, message: 'Please enter tag name' }]}>
                        <Input 
                            placeholder="e.g. Mendesak" 
                            onChange={(e) => {
                                if (!editingTag) {
                                    form.setFieldsValue({ slug: slugify(e.target.value) });
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please enter slug' }]}>
                        <Input placeholder="e.g. mendesak" disabled />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large" 
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingTag ? "Update Tag" : "Create Tag"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default TagManagement;
