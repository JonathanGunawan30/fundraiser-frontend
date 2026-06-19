import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Upload, Typography, Tag, App, Card, Row, Col, Tabs } from 'antd';
import { BankOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, UploadOutlined, FileImageOutlined, LoadingOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Withdrawal, PaginatedResponse } from '../../types';
import { getErrorMessages } from '../../lib/utils';
import type { UploadFile } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

const WithdrawalManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const { notification } = App.useApp();
    
    // State management
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    
    // Modal state
    const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
    const [processForm] = Form.useForm();
    const [processStatus, setProcessStatus] = useState<'completed' | 'rejected'>('completed');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Queries
    const { data: withdrawalsData, isLoading, refetch } = useQuery<PaginatedResponse<Withdrawal>>({
        queryKey: ['admin-withdrawals', page, activeTab],
        queryFn: async () => {
            // Since backend getAllWithdrawals doesn't filter directly on status parameter, 
            // we will query and handle filtering. But wait, we can also use search endpoint if filtering by keyword.
            const response = await api.get('/withdrawals', { 
                params: { page, per_page: 10 } 
            });
            return response.data;
        },
    });

    const { data: searchData, isFetching: isSearching } = useQuery<PaginatedResponse<Withdrawal>>({
        queryKey: ['admin-withdrawals-search', searchText],
        enabled: searchText.trim().length > 0,
        queryFn: async () => {
            const response = await api.get('/withdrawals/search', {
                params: { keyword: searchText, per_page: 50 }
            });
            return response.data;
        }
    });

    // Determine dataSource
    const displayedWithdrawals = React.useMemo(() => {
        let sourceList = withdrawalsData?.data || [];
        if (searchText.trim().length > 0) {
            sourceList = searchData?.data || [];
        }

        if (activeTab === 'all') return sourceList;
        return sourceList.filter(w => w.status === activeTab);
    }, [withdrawalsData, searchData, searchText, activeTab]);

    // Mutation for processing withdrawal
    const processMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number; formData: FormData }) => {
            return api.post(`/admin/withdrawals/${id}/process`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: `Withdrawal request status updated to ${processStatus}`,
                placement: 'topRight',
            });
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
            refetch();
        },
        onError: (error: any) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Processing Failed',
                description: messages[0] || 'An error occurred while updating the request.',
                placement: 'topRight',
            });
        }
    });

    const handleOpenProcessModal = (withdrawal: Withdrawal) => {
        setSelectedWithdrawal(withdrawal);
        setProcessStatus('completed');
        processForm.setFieldsValue({
            status: 'completed',
            rejection_reason: ''
        });
        setFileList([]);
        setIsProcessModalVisible(true);
    };

    const handleCancel = () => {
        setIsProcessModalVisible(false);
        setSelectedWithdrawal(null);
        processForm.resetFields();
        setFileList([]);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const handleSubmitProcess = async () => {
        if (!selectedWithdrawal) return;

        try {
            const values = await processForm.validateFields();
            setSubmitting(true);

            const formData = new FormData();
            formData.append('status', values.status);

            if (values.status === 'completed') {
                if (fileList.length === 0) {
                    notification.error({
                        message: 'File Required',
                        description: 'Please upload a transfer proof image to complete the withdrawal.',
                        placement: 'topRight'
                    });
                    setSubmitting(false);
                    return;
                }
                const rawFile = (fileList[0] as any).originFileObj || fileList[0];
                if (rawFile) {
                    formData.append('transfer_proof', rawFile);
                }
            } else {
                formData.append('rejection_reason', values.rejection_reason || '');
            }

            processMutation.mutate({
                id: selectedWithdrawal.id,
                formData
            });
        } catch (error) {
            console.error('Validation error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const uploadProps = {
        onRemove: () => {
            setFileList([]);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        },
        beforeUpload: (file: File) => {
            // Validate file type
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/jpg';
            if (!isJpgOrPng) {
                notification.error({
                    message: 'Format Error',
                    description: 'You can only upload JPG/PNG/WEBP files!',
                });
                return Upload.LIST_IGNORE;
            }
            
            // Validate file size (max 2MB)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                notification.error({
                    message: 'Size Error',
                    description: 'Image must be smaller than 2MB!',
                });
                return Upload.LIST_IGNORE;
            }

            setFileList([file as any]);

            // Generate local preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            return false; // Stop auto upload
        },
        fileList,
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Campaign',
            dataIndex: ['campaign', 'title'],
            key: 'campaign_title',
            render: (title: string, record: Withdrawal) => (
                <div style={{ maxWidth: 220 }}>
                    <Text strong>{title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Requested by: {record.user?.name}
                    </Text>
                </div>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <Text strong style={{ color: '#8b5cf6' }}>
                    Rp {new Intl.NumberFormat('id-ID').format(amount)}
                </Text>
            )
        },
        {
            title: 'Bank Info',
            key: 'bank_info',
            render: (_: any, record: Withdrawal) => (
                <div>
                    <Text>{record.bank_info?.bank_name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.bank_info?.account_number} a/n {record.bank_info?.account_name}
                    </Text>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: Withdrawal) => {
                let color = 'default';
                if (status === 'pending') color = 'warning';
                if (status === 'completed') color = 'success';
                if (status === 'rejected') color = 'error';
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={color}>{status.toUpperCase()}</Tag>
                        {status === 'rejected' && record.rejection_reason && (
                            <Text type="danger" style={{ fontSize: '11px', display: 'block', marginTop: '4px', maxWidth: '200px' }}>
                                Reason: {record.rejection_reason}
                            </Text>
                        )}
                    </Space>
                );
            }
        },
        {
            title: 'Requested At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_: any, record: Withdrawal) => (
                <Space>
                    {record.status === 'pending' ? (
                        <Button 
                            type="primary" 
                            size="small" 
                            style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
                            onClick={() => handleOpenProcessModal(record)}
                        >
                            Process
                        </Button>
                    ) : record.status === 'completed' && record.transfer_proof_url ? (
                        <Button 
                            type="default" 
                            size="small" 
                            icon={<FileImageOutlined />}
                            onClick={() => window.open(record.transfer_proof_url, '_blank')}
                        >
                            View Proof
                        </Button>
                    ) : (
                        <Text type="secondary">-</Text>
                    )}
                </Space>
            )
        }
    ];

    const tabItems = [
        { key: 'all', label: 'All Requests' },
        { key: 'pending', label: 'Pending' },
        { key: 'completed', label: 'Completed' },
        { key: 'rejected', label: 'Rejected' }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                        <BankOutlined style={{ marginRight: '8px' }} /> Withdrawal Requests
                    </Title>
                    <Text type="secondary">Review and disburse collected funds to campaign owners.</Text>
                </div>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '16px' }}>
                    <Col xs={24} md={12}>
                        <Tabs 
                            activeKey={activeTab} 
                            onChange={setActiveTab} 
                            items={tabItems}
                            style={{ marginBottom: 0 }}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="Search by Bank Name, Account Number or Account Holder Name..."
                            prefix={isSearching ? <LoadingOutlined /> : <SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            style={{ borderRadius: '8px' }}
                        />
                    </Col>
                </Row>

                <Table 
                    columns={columns} 
                    dataSource={displayedWithdrawals} 
                    rowKey="id" 
                    loading={isLoading}
                    pagination={{
                        total: searchText ? displayedWithdrawals.length : withdrawalsData?.meta.total,
                        pageSize: searchText ? 50 : withdrawalsData?.meta.per_page || 10,
                        current: page,
                        onChange: (p) => setPage(p),
                    }}
                    scroll={{ x: true }}
                />
            </Card>

            {selectedWithdrawal && (
                <Modal
                    title={
                        <Space>
                            <BankOutlined style={{ color: '#8b5cf6' }} />
                            <span>Process Withdrawal Request #{selectedWithdrawal.id}</span>
                        </Space>
                    }
                    open={isProcessModalVisible}
                    onCancel={handleCancel}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                            <Button onClick={handleCancel} disabled={submitting} style={{ borderRadius: '8px' }}>
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                loading={processMutation.isPending || submitting}
                                onClick={handleSubmitProcess}
                                style={{ 
                                    backgroundColor: processStatus === 'completed' ? '#10b981' : '#ef4444', 
                                    borderColor: processStatus === 'completed' ? '#10b981' : '#ef4444',
                                    borderRadius: '8px'
                                }}
                            >
                                {processStatus === 'completed' ? 'Approve & Disburse' : 'Reject Request'}
                            </Button>
                        </div>
                    }
                    width={500}
                    centered
                >
                    <div style={{ marginTop: 20, marginBottom: 24 }}>
                        <Card size="small" style={{ background: '#f8fafc', border: 'none', borderRadius: '8px', padding: '8px 12px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Text type="secondary">Campaign: </Text>
                                    <Text strong>{selectedWithdrawal.campaign?.title}</Text>
                                </div>
                                <div style={{ marginTop: 4 }}>
                                    <Text type="secondary">Amount: </Text>
                                    <Text strong style={{ color: '#8b5cf6', fontSize: '16px' }}>
                                        Rp {new Intl.NumberFormat('id-ID').format(selectedWithdrawal.amount)}
                                    </Text>
                                </div>
                                <div style={{ marginTop: 4 }}>
                                    <Text type="secondary">Destination Account: </Text>
                                    <Text strong>
                                        {selectedWithdrawal.bank_info?.bank_name} - {selectedWithdrawal.bank_info?.account_number} ({selectedWithdrawal.bank_info?.account_name})
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </div>

                    <Form
                        form={processForm}
                        layout="vertical"
                        initialValues={{ status: 'completed' }}
                        onValuesChange={(changedValues) => {
                            if (changedValues.status) {
                                setProcessStatus(changedValues.status);
                            }
                        }}
                        style={{ marginTop: 16 }}
                    >
                        <Form.Item
                            name="status"
                            label="Action status"
                            rules={[{ required: true }]}
                        >
                            <Select size="large">
                                <Select.Option value="completed">Approve (Disburse Funds)</Select.Option>
                                <Select.Option value="rejected">Reject</Select.Option>
                            </Select>
                        </Form.Item>

                        {processStatus === 'completed' ? (
                            <div style={{ marginTop: 16, marginBottom: 16 }}>
                                <Form.Item
                                    label="Upload Transfer Proof"
                                    required
                                    help="Please upload the bank transfer receipt image (JPG, PNG, WEBP, max 2MB)."
                                >
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />} size="large" style={{ width: '100%' }}>
                                            Select Image Receipt
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                {previewUrl && (
                                    <div style={{ marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Image Preview:</Text>
                                        <img 
                                            src={previewUrl} 
                                            alt="Transfer Proof Preview" 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: 200, 
                                                borderRadius: 8, 
                                                border: '1px solid #d9d9d9', 
                                                padding: 4,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                            }} 
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Form.Item
                                name="rejection_reason"
                                label="Rejection Reason"
                                rules={[
                                    { required: true, message: 'Please enter the rejection reason' },
                                    { max: 500, message: 'Reason cannot exceed 500 characters' }
                                ]}
                            >
                                <TextArea 
                                    rows={4} 
                                    placeholder="Explain why the withdrawal request is being rejected..."
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>
                        )}
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default WithdrawalManagement;
