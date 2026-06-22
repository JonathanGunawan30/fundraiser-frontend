import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, Avatar, Progress, Tooltip, App, Radio } from 'antd';
import { 
    EyeOutlined, 
    DeleteOutlined, 
    ClockCircleOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import type { Campaign, PaginatedResponse } from '../../types';
import { getErrorMessages } from '../../lib/utils';

const { Title, Text } = Typography;

const CampaignManagement: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || undefined;
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<PaginatedResponse<Campaign>>({
        queryKey: ['admin-campaigns', page, statusFilter],
        queryFn: async () => {
            const params: Record<string, any> = { page, per_page: 10 };
            if (statusFilter) {
                params.status = statusFilter;
            }
            const response = await api.get('/admin/campaigns', { params });
            return response.data;
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
                if (status === 'approved') color = 'success';
                if (status === 'rejected') color = 'error';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: Campaign) => (
                <Space size="small">
                    <Tooltip title="Review & Detail">
                        <Button 
                            type="primary" 
                            icon={<EyeOutlined />} 
                            onClick={() => navigate(`/admin/campaigns/${record.slug}/review`)} 
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button 
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
                <Radio.Group 
                    value={statusFilter || 'all'} 
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'all') {
                            searchParams.delete('status');
                        } else {
                            searchParams.set('status', val);
                        }
                        setSearchParams(searchParams);
                        setPage(1);
                    }}
                    buttonStyle="solid"
                >
                    <Radio.Button value="all">Semua</Radio.Button>
                    <Radio.Button value="pending">Pending</Radio.Button>
                    <Radio.Button value="active">Aktif</Radio.Button>
                    <Radio.Button value="completed">Selesai</Radio.Button>
                    <Radio.Button value="suspended">Ditangguhkan</Radio.Button>
                </Radio.Group>
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
