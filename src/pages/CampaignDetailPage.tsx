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
    Empty,
    Alert,
    Tabs,
    Timeline,
    Image,
    message,
    Modal,
    App
} from 'antd';
import { 
    CalendarOutlined, 
    UserOutlined, 
    TagOutlined, 
    HeartFilled,
    ShareAltOutlined,
    EditOutlined,
    InfoCircleFilled,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import type { Campaign, CampaignUpdate } from '../types';
import DonationModal from '../components/DonationModal';
import CampaignUpdateModal from '../components/CampaignUpdateModal';

import { useAuth } from '../lib/AuthContext';

const { Title, Text, Paragraph } = Typography;

const CampaignDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const currentUserId = user ? Number(user.id) : null;
    const { notification } = App.useApp();
    const [isDonationModalVisible, setIsDonationModalVisible] = React.useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = React.useState(false);
    const [editingUpdate, setEditingUpdate] = React.useState<CampaignUpdate | null>(null);

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
            navigate('/auth/login', { state: { from: `/campaigns/${slug}` } });
            return;
        }
        setIsDonationModalVisible(true);
    };

    const handleDeleteUpdate = (updateId: number) => {
        Modal.confirm({
            title: 'Hapus Update?',
            content: 'Apakah Anda yakin ingin menghapus update ini?',
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await api.delete(`/auth/campaign-updates/${updateId}`);
                    notification.success({
                        message: 'Update Dihapus',
                        description: 'Update perkembangan campaign berhasil dihapus.',
                        placement: 'topRight',
                    });
                    refetch();
                } catch (error) {
                    notification.error({
                        message: 'Gagal Menghapus Update',
                        description: 'Terjadi kesalahan saat menghapus update campaign.',
                        placement: 'topRight',
                    });
                }
            }
        });
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
    const isOwner = currentUserId != null && Number(campaign.user?.id) === currentUserId;

    const tabItems = [
        {
            key: 'story',
            label: 'Cerita',
            children: (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.05rem', color: '#334155', padding: '16px 0' }}>
                    {campaign.story}
                </div>
            )
        },
        {
            key: 'updates',
            label: `Update (${campaign.updates?.length || 0})`,
            children: (
                <div style={{ paddingTop: 24 }}>
                    {isOwner && (
                        <Button 
                            type="dashed" 
                            block 
                            icon={<PlusOutlined />} 
                            onClick={() => { setEditingUpdate(null); setIsUpdateModalVisible(true); }}
                            style={{ marginBottom: 32, height: 50, borderRadius: 12 }}
                        >
                            Tambah Perkembangan Campaign
                        </Button>
                    )}
                    
                    {campaign.updates && campaign.updates.length > 0 ? (
                        <Timeline>
                            {campaign.updates.map((update: CampaignUpdate) => (
                                <Timeline.Item key={update.id} color="blue">
                                    <Card size="small" bordered={false} style={{ background: '#f8fafc', borderRadius: 16, marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {new Date(update.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </Text>
                                                <Title level={5} style={{ margin: '4px 0 12px', wordBreak: 'break-word' }}>{update.title}</Title>
                                            </div>
                                            {isOwner && (
                                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditingUpdate(update); setIsUpdateModalVisible(true); }} style={{ width: 'auto' }} />
                                                    <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteUpdate(update.id)} style={{ width: 'auto' }} />
                                                </div>
                                            )}
                                        </div>
                                        <Paragraph style={{ marginBottom: update.image_url ? 16 : 0, color: '#475569' }}>{update.content}</Paragraph>
                                        {update.image_url && (
                                            <div style={{ marginTop: 12 }}>
                                                <Image 
                                                    src={update.image_url} 
                                                    alt={update.title} 
                                                    style={{ borderRadius: 12, maxWidth: '100%', maxHeight: 400, objectFit: 'cover' }} 
                                                />
                                            </div>
                                        )}
                                    </Card>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <Empty description="Belum ada perkembangan yang dibagikan." />
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
            <Row gutter={[32, 32]}>
                {/* Left Column: Image and Tabs */}
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
                                <Text>{new Date(campaign.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                            </Space>
                        </Space>

                        <Tabs defaultActiveKey="story" items={tabItems} size="large" />
                    </Card>
                </Col>

                {/* Right Column: Donation Info */}
                <Col xs={24} lg={8}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', position: 'sticky', top: 24 }}>
                        <div style={{ marginBottom: 24 }}>
                            <Text type="secondary">Terkumpul</Text>
                            <Title level={3} style={{ margin: '4px 0', color: '#10b981' }}>
                                Rp {new Intl.NumberFormat('id-ID').format(campaign.collected_amount)}
                            </Title>
                            <Progress percent={percent} strokeColor="#10b981" showInfo={false} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text strong>{percent}%</Text>
                                <Text type="secondary">dari Rp {new Intl.NumberFormat('id-ID').format(campaign.goal_amount)}</Text>
                            </div>
                        </div>

                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={12}>
                                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 12, textAlign: 'center' }}>
                                    <Title level={4} style={{ margin: 0 }}>{campaign.donor_count}</Title>
                                    <Text type="secondary">Donatur</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 12, textAlign: 'center' }}>
                                    <Title level={4} style={{ margin: 0 }}>{Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}</Title>
                                    <Text type="secondary">Hari Lagi</Text>
                                </div>
                            </Col>
                        </Row>

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

            <CampaignUpdateModal
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                campaignId={campaign.id}
                initialData={editingUpdate}
                onSuccess={() => refetch()}
            />
        </div>
    );
};

export default CampaignDetailPage;
