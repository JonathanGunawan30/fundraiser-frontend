import React from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Space, Avatar, Button, App, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
    HeartOutlined, 
    RocketOutlined, 
    LineChartOutlined, 
    WalletOutlined,
    PlusOutlined,
    ArrowRightOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import type { UserDashboardData, Campaign, Donation } from '../types';

const { Title, Text } = Typography;

const UserDashboard: React.FC = () => {
    const { notification } = App.useApp();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<UserDashboardData>({
        queryKey: ['user-dashboard'],
        queryFn: async () => {
            const response = await api.get('/auth/dashboard');
            return response.data.data;
        },
    });

    const campaignColumns = [
        {
            title: 'Campaign',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Campaign) => (
                <Space>
                    <Avatar shape="square" size="large" src={record.cover_image_url} />
                    <div>
                        <Text strong>{text}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.category?.name}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Target',
            dataIndex: 'goal_amount',
            key: 'goal_amount',
            render: (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`,
        },
        {
            title: 'Terkumpul',
            dataIndex: 'collected_amount',
            key: 'collected_amount',
            render: (amount: number) => (
                <Text type="success" strong>
                    Rp {new Intl.NumberFormat('id-ID').format(amount)}
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'active') color = 'processing';
                if (status === 'completed') color = 'success';
                if (status === 'pending') color = 'warning';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_: any, record: Campaign) => (
                <Space onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Lihat Detail">
                        <Button 
                            type="text" 
                            size="small"
                            icon={<EyeOutlined />} 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/campaigns/${record.slug}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Campaign">
                        <Button 
                            type="text" 
                            size="small"
                            icon={<EditOutlined style={{ color: '#1677ff' }} />} 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/campaigns/edit/${record.id}`);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const donationColumns = [
        {
            title: 'Donatur',
            dataIndex: 'user',
            key: 'user',
            render: (user: any) => (
                <Space>
                    <Avatar src={user?.avatar_url}>{user?.name?.[0]}</Avatar>
                    <Text>{user?.name || 'Anonim'}</Text>
                </Space>
            ),
        },
        {
            title: 'Jumlah',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`,
        },
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
            render: (campaign: Campaign) => (
                <Text ellipsis={{ tooltip: campaign.title }} style={{ maxWidth: 200 }}>
                    {campaign.title}
                </Text>
            ),
        },
        {
            title: 'Waktu',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Ringkasan Dashboard</Title>
                    <Text type="secondary">Selamat datang kembali! Ini adalah dampak yang Anda berikan.</Text>
                </div>
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<PlusOutlined />} 
                    style={{ borderRadius: '8px', fontWeight: 600 }}
                    onClick={() => navigate('/campaigns/create')}
                >
                    Buat Campaign
                </Button>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} loading={isLoading} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <Statistic
                            title={<Text type="secondary">Total Donasi Saya</Text>}
                            value={data?.overview.total_donations || 0}
                            prefix={<HeartOutlined style={{ color: '#ef4444', marginRight: '8px' }} />}
                            valueStyle={{ fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} loading={isLoading} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <Statistic
                            title={<Text type="secondary">Dana Didonasikan</Text>}
                            value={data?.overview.total_donated_amount || 0}
                            formatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(value))}`}
                            prefix={<WalletOutlined style={{ color: '#10b981', marginRight: '8px' }} />}
                            valueStyle={{ fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} loading={isLoading} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <Statistic
                            title={<Text type="secondary">Campaign Aktif</Text>}
                            value={data?.overview.active_campaigns_count || 0}
                            prefix={<RocketOutlined style={{ color: '#3b82f6', marginRight: '8px' }} />}
                            valueStyle={{ fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} loading={isLoading} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <Statistic
                            title={<Text type="secondary">Dana Terkumpul</Text>}
                            value={data?.overview.total_collected_amount || 0}
                            formatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(value))}`}
                            prefix={<LineChartOutlined style={{ color: '#8b5cf6', marginRight: '8px' }} />}
                            valueStyle={{ fontWeight: 700 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        title={<span style={{ fontWeight: 700 }}>Campaign Saya</span>} 
                        bordered={false} 
                        style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        extra={<Button type="link">Lihat Semua</Button>}
                    >
                        <Table 
                            columns={campaignColumns} 
                            dataSource={data?.my_campaigns} 
                            rowKey="id" 
                            pagination={false} 
                            loading={isLoading}
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card 
                        title={<span style={{ fontWeight: 700 }}>Donasi Terbaru</span>} 
                        bordered={false} 
                        style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    >
                        <Table 
                            columns={donationColumns} 
                            dataSource={data?.recent_donations} 
                            rowKey="id" 
                            pagination={false} 
                            loading={isLoading}
                            showHeader={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserDashboard;
