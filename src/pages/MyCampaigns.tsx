import React, { useState } from 'react';
import { Typography, Card, Table, Tag, Space, Avatar, Button, App, Tooltip } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    NotificationOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import type { Campaign, PaginatedResponse } from '../types';
import { getErrorMessages } from '../lib/utils';
import CampaignUpdateModal from '../components/CampaignUpdateModal';

const { Title, Text } = Typography;

const MyCampaigns: React.FC = () => {
    const { notification, modal } = App.useApp();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    
    // For Update Modal
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<Campaign>>({
        queryKey: ['my-campaigns', page],
        queryFn: async () => {
            const response = await api.get('/auth/my-campaigns', { params: { page, per_page: 10 } });
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/auth/campaigns/${id}`),
        onSuccess: () => {
            notification.success({
                message: 'Berhasil',
                description: 'Campaign telah dihapus.',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
        },
        onError: (error) => {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Gagal Menghapus',
                description: messages[0] || 'Terjadi kesalahan.',
                placement: 'topRight',
            });
        }
    });

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Campaign) => (
                <Space align="start">
                    <Avatar shape="square" size={64} src={record.cover_image_url} />
                    <div style={{ minWidth: 250, maxWidth: 400 }}>
                        <Text strong style={{ fontSize: '16px', whiteSpace: 'normal' }}>{text}</Text>
                        <br />
                        <Tag color="blue">{record.category?.name}</Tag>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Target & Terkumpul',
            key: 'funding',
            render: (_: any, record: Campaign) => (
                <div style={{ minWidth: 150 }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Terkumpul:</Text>
                    <br />
                    <Text strong style={{ color: '#10b981' }}>
                        Rp {new Intl.NumberFormat('id-ID').format(record.collected_amount)}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>Target: Rp {new Intl.NumberFormat('id-ID').format(record.goal_amount)}</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let text = status.toUpperCase();
                let icon = null;

                if (status === 'draft') {
                    color = 'default';
                    icon = <InfoCircleOutlined />;
                    text = 'DRAFT';
                } else if (status === 'pending') {
                    color = 'warning';
                    icon = <ClockCircleOutlined />;
                    text = 'MENUNGGU REVIEW';
                } else if (status === 'active') {
                    color = 'success';
                    icon = <CheckCircleOutlined />;
                    text = 'AKTIF';
                } else if (status === 'suspended') {
                    color = 'error';
                    text = 'DITANGGUHKAN';
                }

                return <Tag color={color} icon={icon}>{text}</Tag>;
            },
        },
        {
            title: 'Verifikasi',
            dataIndex: 'verified_status',
            key: 'verified_status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'approved') color = 'success';
                if (status === 'rejected') color = 'error';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Aksi',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: Campaign) => (
                <Space size="middle">
                    {record.status === 'active' && (
                        <Tooltip title="Posting Update">
                            <Button 
                                type="text" 
                                icon={<NotificationOutlined style={{ color: '#10b981' }} />} 
                                onClick={() => {
                                    setSelectedCampaignId(record.id);
                                    setIsUpdateModalVisible(true);
                                }}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Lihat Detail">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            onClick={() => navigate(`/campaigns/${record.slug}`)} 
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button 
                            type="text" 
                            icon={<EditOutlined style={{ color: '#1677ff' }} />} 
                            onClick={() => navigate(`/campaigns/edit/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Hapus">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            disabled={record.collected_amount > 0}
                            onClick={() => {
                                modal.confirm({
                                    title: 'Hapus Campaign?',
                                    content: 'Apakah Anda yakin ingin menghapus campaign ini? Tindakan ini tidak dapat dibatalkan.',
                                    okText: 'Hapus',
                                    okType: 'danger',
                                    cancelText: 'Batal',
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
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Campaign Saya</Title>
                    <Text type="secondary">Kelola dan pantau perkembangan campaign Anda di sini.</Text>
                </div>
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<PlusOutlined />} 
                    style={{ borderRadius: '8px', fontWeight: 600 }}
                    onClick={() => navigate('/campaigns/create')}
                >
                    Mulai Campaign Baru
                </Button>
            </div>

            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Table 
                    columns={columns} 
                    dataSource={data?.data} 
                    rowKey="id" 
                    loading={isLoading}
                    pagination={{
                        total: data?.meta.total,
                        pageSize: data?.meta.per_page,
                        current: data?.meta.current_page,
                        onChange: (p) => setPage(p),
                    }}
                    scroll={{ x: true }}
                />
            </Card>

            {selectedCampaignId && (
                <CampaignUpdateModal
                    visible={isUpdateModalVisible}
                    onCancel={() => {
                        setIsUpdateModalVisible(false);
                        setSelectedCampaignId(null);
                    }}
                    campaignId={selectedCampaignId}
                    onSuccess={() => {
                        notification.success({ message: 'Update diposting', placement: 'topRight' });
                    }}
                />
            )}
        </div>
    );
};

export default MyCampaigns;
