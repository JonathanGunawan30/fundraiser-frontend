import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Tag, List, Avatar, Space, Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    UserOutlined, 
    BankOutlined, 
    TransactionOutlined,
    FundOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import type {Donation, Campaign} from '../types';
import { Area, Pie } from '@ant-design/charts';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard');
            return response.data.data;
        },
    });

    const donationData = React.useMemo(() => {
        if (!stats?.charts?.donations_last_30_days) return [];
        return stats.charts.donations_last_30_days.map((item: any) => ({
            date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            amount: Number(item.total_amount || 0),
        }));
    }, [stats]);

    const categoryData = React.useMemo(() => {
        return stats?.charts?.category_distribution || [];
    }, [stats]);

    const areaConfig = {
        data: donationData,
        xField: 'date',
        yField: 'amount',
        height: 300,
        autoFit: true,
        smooth: true,
    };

    const pieConfig = {
        data: categoryData,
        angleField: 'value',
        colorField: 'label',
        radius: 0.8,
        innerRadius: 0.5,
        height: 300,
        autoFit: true,
        legend: {
            position: 'bottom' as const,
        },
    };

    const donationColumns = [
        { 
            title: 'Donatur', 
            dataIndex: ['user', 'name'], 
            key: 'user',
            render: (text: string, record: Donation) => (
                <Space>
                    <Avatar src={record.user?.avatar_url} icon={<UserOutlined />} />
                    <Text strong>{text || 'Anonymous'}</Text>
                </Space>
            )
        },
        { 
            title: 'Campaign', 
            dataIndex: ['campaign', 'title'], 
            key: 'campaign',
            render: (text: string) => <Text ellipsis style={{ maxWidth: 200 }}>{text}</Text>
        },
        { 
            title: 'Jumlah', 
            dataIndex: 'amount', 
            key: 'amount',
            render: (val: number) => (
                <Text strong style={{ color: '#059669' }}>
                    Rp {new Intl.NumberFormat('id-ID').format(val)}
                </Text>
            )
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'success' ? 'success' : 'warning'} icon={status === 'success' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ margin: 0 }}>Dashboard Overview</Title>
                <Text type="secondary">Welcome back! Here's what's happening with FundRaiser today.</Text>
            </div>
            
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic
                            title={<Text type="secondary">Total Donasi</Text>}
                            value={stats?.overview?.total_donations_amount || 0}
                            precision={0}
                            valueStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                            prefix={<BankOutlined />}
                            suffix={<Text style={{ fontSize: 14, color: '#94a3b8', marginLeft: 4 }}>IDR</Text>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic
                            title={<Text type="secondary">Transaksi Sukses</Text>}
                            value={stats?.overview?.total_donations_count || 0}
                            valueStyle={{ color: '#059669', fontWeight: 'bold' }}
                            prefix={<TransactionOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic
                            title={<Text type="secondary">Campaign Aktif</Text>}
                            value={stats?.overview?.total_campaigns_active || 0}
                            valueStyle={{ color: '#0891b2', fontWeight: 'bold' }}
                            prefix={<FundOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic
                            title={<Text type="secondary">Total User</Text>}
                            value={stats?.overview?.total_users_count || 0}
                            valueStyle={{ color: '#7c3aed', fontWeight: 'bold' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={16}>
                    <Card 
                        title={<span style={{ fontWeight: 700 }}>Tren Donasi Platform (30 Hari Terakhir)</span>} 
                        bordered={false} 
                        style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        loading={isLoading}
                    >
                        {donationData.length > 0 ? (
                            <Area {...areaConfig} />
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                                <Text type="secondary">Tidak ada data tren donasi.</Text>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card 
                        title={<span style={{ fontWeight: 700 }}>Distribusi Kategori</span>} 
                        bordered={false} 
                        style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        loading={isLoading}
                    >
                        {categoryData.length > 0 ? (
                            <Pie {...pieConfig} />
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                                <Text type="secondary">Tidak ada data distribusi kategori.</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} xl={16}>
                    <Card 
                        title="Donasi Terbaru" 
                        extra={<Button type="link">Lihat Semua</Button>}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table 
                            dataSource={stats?.recent_activity?.donations} 
                            columns={donationColumns} 
                            pagination={false} 
                            loading={isLoading}
                            rowKey="id"
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={8}>
                    <Card 
                        title="Campaign Baru"
                        extra={<Button type="link" onClick={() => navigate('/admin/campaigns?status=pending')}>Kelola</Button>}
                    >
                        <List
                            loading={isLoading}
                            itemLayout="horizontal"
                            dataSource={stats?.recent_activity?.new_campaigns}
                            renderItem={(item: Campaign) => (
                                <List.Item
                                    actions={[<Button type="link" size="small" onClick={() => navigate(`/admin/campaigns/${item.slug}/review`)}>Detail</Button>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.cover_image_url} shape="square" size="large" />}
                                        title={<Text strong ellipsis style={{ maxWidth: 150 }}>{item.title}</Text>}
                                        description={<Text type="secondary" style={{ fontSize: 'small' }}>{item.user?.name}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default AdminDashboard;
