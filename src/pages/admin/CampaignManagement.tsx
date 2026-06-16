import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, Avatar, Progress, Tooltip, App } from 'antd';
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    EyeOutlined, 
    DeleteOutlined, 
    ClockCircleOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Campaign, PaginatedResponse } from '../../types';
import { getErrorMessages } from '../../lib/utils';

const { Title, Text } = Typography;

const CampaignManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<PaginatedResponse<Campaign>>({
        queryKey: ['admin-campaigns', page],
        queryFn: async () => {
            const response = await api.get('/campaigns', { params: { page, per_page: 10 } });
            return response.data;
        },
    });

    const verifyMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: 'approved' | 'rejected' }) => 
            api.post(`/admin/campaigns/${id}/verify`, { status }),
        onSuccess: (_, variables) => {
            notification.success({
                message: 'Success',
                description: `Campaign ${variables.status} successfully`,
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
        },
        onError: (error: any) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Verification Error',
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
        mutationFn: (id: number) => api.delete(`/campaigns/${id}`),
        onSuccess: () => {
            notification.success({
                message: 'Success',
                description: 'Campaign deleted',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
        },
        onError: (error: any) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Action Error',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        },
    });

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Campaign) => (
                <Space>
                    <Avatar src={record.cover_image_url} shape="square" size={64} />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ display: 'block', maxWidth: 250 }} ellipsis>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>by {record.user?.name}</Text>
                        <Tag color="blue">{record.category?.name}</Tag>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Progress',
            key: 'progress',
            render: (_: any, record: Campaign) => {
                const percent = record.goal_amount > 0 ? Math.round((record.collected_amount / record.goal_amount) * 100) : 0;
                return (
                    <div style={{ width: 180 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                            <Text strong>Rp {new Intl.NumberFormat('id-ID').format(record.collected_amount)}</Text>
                            <Text type="secondary">{percent}%</Text>
                        </div>
                        <Progress percent={percent} size="small" showInfo={false} strokeColor="#4f46e5" />
                        <Text type="secondary" style={{ fontSize: 11 }}>Target: Rp {new Intl.NumberFormat('id-ID').format(record.goal_amount)}</Text>
                    </div>
                );
            }
        },
        {
            title: 'Verification',
            dataIndex: 'verified_status',
            key: 'verified_status',
            render: (status: string) => {
                let color = 'default';
                let icon = <ClockCircleOutlined />;
                if (status === 'approved') { color = 'success'; icon = <CheckCircleOutlined />; }
                if (status === 'rejected') { color = 'error'; icon = <CloseCircleOutlined />; }
                return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: Campaign) => (
                <Space size="small">
                    {record.verified_status === 'pending' && (
                        <>
                            <Tooltip title="Approve">
                                <Button 
                                    type="text" 
                                    icon={<CheckCircleOutlined style={{ color: '#059669' }} />} 
                                    onClick={() => verifyMutation.mutate({ id: record.id, status: 'approved' })}
                                    loading={verifyMutation.isPending}
                                />
                            </Tooltip>
                            <Tooltip title="Reject">
                                <Button 
                                    type="text" 
                                    danger 
                                    icon={<CloseCircleOutlined />} 
                                    onClick={() => verifyMutation.mutate({ id: record.id, status: 'rejected' })}
                                    loading={verifyMutation.isPending}
                                />
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title="View Detail">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => window.open(`/campaigns/${record.id}`, '_blank')} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => {
                                modal.confirm({
                                    title: 'Delete Campaign?',
                                    content: 'Are you sure you want to delete this campaign? This action cannot be undone.',
                                    okText: 'Delete',
                                    okType: 'danger',
                                    cancelText: 'Cancel',
                                    centered: true,
                                    onOk: () => deleteMutation.mutate(record.id),
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="page-header">
                <div>
                    <Title level={2} style={{ margin: 0 }}>Campaign Management</Title>
                    <Text type="secondary">Review and manage fundraising campaigns submitted by users.</Text>
                </div>
                <Space wrap>
                    <Button icon={<ClockCircleOutlined />}>Pending Only</Button>
                    <Button type="primary" icon={<SafetyCertificateOutlined />}>Verification Queue</Button>
                </Space>
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
                    onChange: (p) => setPage(p),
                }}
                styles={{ header: { background: '#f8fafc' } }}
            />
        </Space>
    );
};

export default CampaignManagement;
