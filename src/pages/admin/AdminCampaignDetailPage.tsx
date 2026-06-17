import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Typography, 
    Row, 
    Col, 
    Card, 
    Tag,
    Button, 
    Avatar, 
    Space, 
    Divider, 
    Spin, 
    Statistic,
    Empty,
    Alert,
    App,
    Input,
    Modal,
    Descriptions,
    Badge
} from 'antd';
import { 
    CalendarOutlined, 
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowLeftOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import dayjs from 'dayjs';
import type { Campaign } from '../../types';
import type {AxiosError} from "axios";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AdminCampaignDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { notification, modal } = App.useApp();
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const { data: campaign, isLoading, isError } = useQuery<Campaign>({
        queryKey: ['admin-campaign-detail', slug],
        queryFn: async () => {
            const response = await api.get(`/campaigns/${slug}`);
            return response.data.data;
        },
        enabled: !!slug,
    });

    const verifyMutation = useMutation({
        mutationFn: async ({ status, notes }: { status: 'approved' | 'rejected', notes?: string }) => {
            const response = await api.post(`/admin/campaigns/${campaign?.id}/verify`, {
                status,
                notes
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            notification.success({
                message: variables.status === 'approved' ? 'Campaign Disetujui' : 'Campaign Ditolak',
                description: `Campaign "${campaign?.title}" telah berhasil diperbarui.`,
            });
            setRejectModalVisible(false);
            setRejectReason('');
            queryClient.invalidateQueries({ queryKey: ['admin-campaign-detail', slug] });
            queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            notification.error({
                message: 'Gagal Memproses',
                description: error.response?.data?.message || 'Terjadi kesalahan.',
            });
        }
    });

    if (isLoading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Memuat detail review..." /></div>;

    if (isError || !campaign) {
        return (
            <div style={{ padding: '48px', textAlign: 'center' }}>
                <Empty description="Data campaign tidak ditemukan." />
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/campaigns')} style={{ marginTop: 24 }}>Kembali ke Daftar</Button>
            </div>
        );
    }

    const getStatusTag = (status: string) => {
        if (status === 'active') return <Tag color="success" icon={<CheckCircleOutlined />}>AKTIF</Tag>;
        if (status === 'pending') return <Tag color="warning" icon={<ClockCircleOutlined />}>MENUNGGU REVIEW</Tag>;
        if (status === 'draft') return <Tag color="default" icon={<InfoCircleOutlined />}>DRAFT</Tag>;
        if (status === 'suspended') return <Tag color="error" icon={<CloseCircleOutlined />}>DITANGGUHKAN</Tag>;
        return <Tag>{status.toUpperCase()}</Tag>;
    };

    const getVerifyStatusTag = (status: string) => {
        if (status === 'approved') return <Badge status="success" text="DISETUJUI" />;
        if (status === 'rejected') return <Badge status="error" text="DITOLAK" />;
        return <Badge status="processing" text="BELUM DIVERIFIKASI" />;
    };

    return (
        <div style={{ padding: '24px' }}>
            <Space style={{ marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/campaigns')}>
                    Kembali ke Daftar
                </Button>
                <Title level={4} style={{ margin: 0 }}>Review Campaign</Title>
            </Space>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        title="Informasi Konten" 
                        bordered={false} 
                        style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        extra={getStatusTag(campaign.status)}
                    >
                        <img 
                            src={campaign.cover_image_url} 
                            alt="Cover" 
                            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12, marginBottom: 24 }} 
                        />
                        
                        <Descriptions title="Detail Teknis" bordered column={1} size="small" style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Judul">{campaign.title}</Descriptions.Item>
                            <Descriptions.Item label="Slug">{campaign.slug}</Descriptions.Item>
                            <Descriptions.Item label="Kategori">{campaign.category?.name}</Descriptions.Item>
                            <Descriptions.Item label="Deskripsi">{campaign.description}</Descriptions.Item>
                        </Descriptions>
                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Cerita</Text>
                        <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '15px', lineHeight: '1.8' }}>
                            {campaign.story}
                        </Paragraph>

                        {campaign.tags && campaign.tags.length > 0 && (
                            <div style={{ marginTop: 24 }}>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags:</Text>
                                <Space wrap>
                                    {campaign.tags.map(t => <Tag key={t.id}>{t.name}</Tag>)}
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Card 
                            title="Tindakan Moderasi" 
                            bordered={false} 
                            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '2px solid #f0f0f0' }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <Text type="secondary">Status Saat Ini:</Text>
                                <div style={{ marginTop: 8 }}>{getVerifyStatusTag(campaign.verified_status)}</div>
                            </div>

                            {campaign.status === 'pending' || campaign.verified_status === 'pending' ? (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Button 
                                        type="primary" 
                                        block 
                                        size="large" 
                                        icon={<CheckCircleOutlined />}
                                        style={{ height: 50, borderRadius: 12, background: '#10b981', borderColor: '#10b981' }}
                                        onClick={() => {
                                            modal.confirm({
                                                title: 'Setujui Campaign?',
                                                content: 'Setelah disetujui, campaign akan langsung aktif dan bisa menerima donasi.',
                                                okText: 'Setujui',
                                                okType: 'primary',
                                                onOk: () => verifyMutation.mutate({ status: 'approved' })
                                            });
                                        }}
                                        loading={verifyMutation.isPending}
                                    >
                                        Setujui Campaign
                                    </Button>
                                    <Button 
                                        danger 
                                        block 
                                        size="large" 
                                        icon={<CloseCircleOutlined />}
                                        style={{ height: 50, borderRadius: 12 }}
                                        onClick={() => setRejectModalVisible(true)}
                                        loading={verifyMutation.isPending}
                                    >
                                        Tolak Campaign
                                    </Button>
                                </Space>
                            ) : (
                                <Alert 
                                    message="Sudah Diproses" 
                                    description={`Campaign ini telah berstatus ${campaign.status}.`}
                                    type="info" 
                                    showIcon 
                                />
                            )}
                        </Card>

                        <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <Statistic 
                                title="Target Dana" 
                                value={campaign.goal_amount} 
                                formatter={v => `Rp ${new Intl.NumberFormat('id-ID').format(Number(v))}`} 
                                valueStyle={{ fontWeight: 800 }}
                            />
                            <Divider style={{ margin: '12px 0' }} />
                            <Statistic 
                                title="Deadline" 
                                value={dayjs(campaign.deadline).format('DD MMM YYYY')} 
                                prefix={<CalendarOutlined />} 
                            />
                        </Card>

                        <Card title="Pemilik Campaign" bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <Space align="start">
                                <Avatar size={64} src={campaign.user?.avatar_url} icon={<UserOutlined />} />
                                <div>
                                    <Text strong style={{ fontSize: 16, display: 'block' }}>{campaign.user?.name}</Text>
                                    <Text type="secondary" style={{ display: 'block' }}>{campaign.user?.email}</Text>
                                    <Tag color="blue" style={{ marginTop: 8 }}>Terverifikasi</Tag>
                                </div>
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>

            <Modal
                title="Tolak Campaign"
                open={rejectModalVisible}
                onOk={() => {
                    if (!rejectReason) return notification.warning({ message: 'Alasan wajib diisi' });
                    verifyMutation.mutate({ status: 'rejected', notes: rejectReason });
                }}
                onCancel={() => setRejectModalVisible(false)}
                okText="Kirim Penolakan"
                okType="danger"
                confirmLoading={verifyMutation.isPending}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text>Berikan alasan penolakan agar user dapat memperbaiki campaign mereka:</Text>
                </div>
                <TextArea 
                    rows={4} 
                    placeholder="Contoh: Deskripsi kurang jelas, foto tidak relevan, dll." 
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default AdminCampaignDetailPage;
