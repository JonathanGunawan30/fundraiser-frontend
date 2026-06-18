import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    Typography, 
    Row, 
    Col, 
    Card, 
    Tag, 
    Progress, 
    Button, 
    Avatar, 
    Space, 
    Divider, 
    Spin, 
    Statistic,
    Empty,
    Alert
} from 'antd';
import { 
    CalendarOutlined, 
    UserOutlined, 
    TagOutlined, 
    HeartFilled,
    ShareAltOutlined,
    EditOutlined,
    InfoCircleFilled
} from '@ant-design/icons';
import api from '../api/axios';
import type { Campaign } from '../types';
import DonationModal from '../components/DonationModal';

const { Title, Text, Paragraph } = Typography;

const CampaignDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const currentUserId = Number(localStorage.getItem('user_id'));
    const isLoggedIn = !!localStorage.getItem('token');
    const [isDonationModalVisible, setIsDonationModalVisible] = React.useState(false);

    const { data: campaign, isLoading, isError, refetch } = useQuery<Campaign>({
        queryKey: ['campaign', slug],
        queryFn: async () => {
            const response = await api.get(`/campaigns/${slug}`);
            return response.data.data;
        },
        enabled: !!slug,
    });

    const handleDonateClick = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: `/campaigns/${slug}` } });
            return;
        }
        setIsDonationModalVisible(true);
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" tip="Memuat detail campaign..." />
            </div>
        );
    }

    if (isError || !campaign) {
        return (
            <div style={{ padding: '100px' }}>
                <Empty description="Campaign tidak ditemukan atau Anda tidak memiliki akses." />
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Button type="primary" onClick={() => navigate('/')}>Kembali ke Beranda</Button>
                </div>
            </div>
        );
    }

    const percent = Math.min(Math.round((campaign.collected_amount / campaign.goal_amount) * 100), 100);
    const isOwner = campaign.user_id === currentUserId;

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
            <Row gutter={[32, 32]}>
                {/* Left Column: Image and Story */}
                <Col xs={24} lg={16}>
                    <img 
                        src={campaign.cover_image_url} 
                        alt={campaign.title} 
                        style={{ width: '100%', borderRadius: 16, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                    />
                    
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <Title level={2}>{campaign.title}</Title>
                        
                        <Space split={<Divider type="vertical" />} style={{ marginBottom: 24 }}>
                            <Space>
                                <TagOutlined />
                                <Text strong>{campaign.category?.name}</Text>
                            </Space>
                            <Space>
                                <CalendarOutlined />
                                <Text>Dibuat {new Date(campaign.created_at).toLocaleDateString('id-ID')}</Text>
                            </Space>
                        </Space>

                        <Divider />

                        <Title level={4}>Cerita Penggalangan Dana</Title>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                            {campaign.story}
                        </Paragraph>

                        {campaign.tags && campaign.tags.length > 0 && (
                            <div style={{ marginTop: 32 }}>
                                <Space size={[0, 8]} wrap>
                                    {campaign.tags.map(tag => (
                                        <Tag key={tag.id} icon={<TagOutlined />}>{tag.name}</Tag>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Right Column: Funding and Action */}
                <Col xs={24} lg={8}>
                    <Card 
                        bordered={false} 
                        style={{ 
                            borderRadius: 16, 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            position: 'sticky',
                            top: 100
                        }}
                    >
                        <Statistic 
                            title="Terkumpul" 
                            value={campaign.collected_amount} 
                            formatter={(val) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(val))}`}
                            valueStyle={{ color: '#10b981', fontWeight: 800, fontSize: '28px' }}
                        />
                        
                        <div style={{ marginTop: 16, marginBottom: 8 }}>
                            <Text type="secondary">dari target Rp {new Intl.NumberFormat('id-ID').format(campaign.goal_amount)}</Text>
                        </div>
                        
                        <Progress percent={percent} strokeColor="#10b981" status="active" />
                        
                        <Row gutter={16} style={{ marginTop: 24 }}>
                            <Col span={12}>
                                <Statistic title="Donatur" value={campaign.donor_count} prefix={<HeartFilled style={{ color: '#ef4444' }} />} />
                            </Col>
                            <Col span={12}>
                                <Statistic 
                                    title="Sisa Hari" 
                                    value={Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} 
                                    prefix={<CalendarOutlined />} 
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {campaign.status === 'active' ? (
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block 
                                    onClick={handleDonateClick}
                                    style={{ height: 50, borderRadius: 12, fontWeight: 700 }}
                                >
                                    Donasi Sekarang
                                </Button>
                            ) : (
                                <Alert 
                                    message={`Status: ${campaign.status.toUpperCase()}`}
                                    description="Campaign ini belum aktif atau telah berakhir."
                                    type="info"
                                    showIcon
                                />
                            )}
                            
                            <Button icon={<ShareAltOutlined />} size="large" block style={{ borderRadius: 12 }}>
                                Bagikan
                            </Button>

                            {isOwner && (
                                <Button 
                                    icon={<EditOutlined />} 
                                    size="large" 
                                    block 
                                    onClick={() => navigate(`/campaigns/edit/${campaign.id}`)}
                                    style={{ borderRadius: 12 }}
                                >
                                    Edit Campaign
                                </Button>
                            )}
                        </Space>

                        <Divider />

                        <Title level={5}>Penggalang Dana</Title>
                        <Space>
                            <Avatar size={48} src={campaign.user?.avatar_url} icon={<UserOutlined />} />
                            <div>
                                <Text strong style={{ display: 'block' }}>{campaign.user?.name}</Text>
                                <Tag color="blue">Identitas Terverifikasi</Tag>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <DonationModal 
                visible={isDonationModalVisible}
                onCancel={() => setIsDonationModalVisible(false)}
                campaignId={campaign.id}
                campaignTitle={campaign.title}
                onSuccess={() => refetch()}
            />
        </div>
    );
};

export default CampaignDetailPage;
