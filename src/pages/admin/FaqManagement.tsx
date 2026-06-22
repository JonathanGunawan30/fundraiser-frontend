import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, InputNumber, Typography, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { PaginatedResponse } from '../../types';
import { getErrorMessages } from '../../lib/utils';

const { Title, Text } = Typography;

interface Faq {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    order_index: number;
}

const FaqManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [form] = Form.useForm();

    const { data, isLoading } = useQuery<PaginatedResponse<Faq>>({
        queryKey: ['admin-faqs'],
        queryFn: async () => {
            const response = await api.get('/faqs');
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (newFaq: any) => api.post('/admin/faqs', newFaq),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'FAQ created successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
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
        mutationFn: ({ id, updatedFaq }: { id: number, updatedFaq: any }) => 
            api.put(`/admin/faqs/${id}`, updatedFaq),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'FAQ updated successfully',
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
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
        mutationFn: (id: number) => api.delete(`/admin/faqs/${id}`),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'FAQ deleted',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
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

    const showModal = (faq?: Faq) => {
        if (faq) {
            setEditingFaq(faq);
            form.setFieldsValue(faq);
        } else {
            setEditingFaq(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingFaq(null);
        form.resetFields();
    };

    const onFinish = (values: any) => {
        if (editingFaq) {
            updateMutation.mutate({ id: editingFaq.id, updatedFaq: values });
        } else {
            createMutation.mutate(values);
        }
    };

    const columns = [
        { 
            title: 'Question', 
            dataIndex: 'question', 
            key: 'question',
            render: (text: string) => <Text strong>{text}</Text>
        },
        { title: 'Order', dataIndex: 'order_index', key: 'order' },
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
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: Faq) => (
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
                                title: 'Delete FAQ?',
                                content: 'Are you sure you want to delete this FAQ? This action cannot be undone.',
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
                    <Title level={2} style={{ margin: 0 }}>Frequently Asked Questions</Title>
                    <Text type="secondary">Manage common questions and answers for your users.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
                    Add FAQ
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
                title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ is_active: true, order_index: 0 }}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Please enter question' }]}>
                        <Input placeholder="e.g. Bagaimana cara berdonasi?" />
                    </Form.Item>
                    <Form.Item name="answer" label="Answer" rules={[{ required: true, message: 'Please enter answer' }]}>
                        <Input.TextArea rows={6} placeholder="Explain the answer clearly..." />
                    </Form.Item>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="order_index" label="Order Index">
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="is_active" label="Active Status" valuePropName="checked">
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </div>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large" 
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingFaq ? "Update FAQ" : "Create FAQ"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default FaqManagement;
