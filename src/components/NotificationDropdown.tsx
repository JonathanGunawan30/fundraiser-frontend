import React, { useState } from 'react';
import { 
    Badge, 
    Popover, 
    List, 
    Button, 
    Spin, 
    Empty, 
    Typography, 
    Avatar, 
    Tabs, 
    Space,
    Drawer,
    Grid,
    Modal
} from 'antd';
import { 
    BellOutlined, 
    RocketOutlined, 
    BankOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    HeartOutlined,
    EyeOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { AppNotification, PaginatedResponse } from '../types';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

interface NotificationDropdownProps {
    isAdmin?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isAdmin = false }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');
    const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const screens = useBreakpoint();

    const isMobile = !screens.md; // ponytail shortcut: md and above is desktop, below is mobile drawer

    const endpointPrefix = isAdmin ? '/admin/notifications' : '/auth/notifications';

    // Query for unread notifications
    const { data: unreadData, isLoading: unreadLoading } = useQuery<PaginatedResponse<AppNotification>>({
        queryKey: ['unread-notifications', isAdmin],
        queryFn: async () => {
            const response = await api.get(`${endpointPrefix}/unread`);
            return response.data;
        },
        enabled: true,
        refetchInterval: 15000, // Refresh every 15s to keep it dynamic (ponytail shortcut: REST polling)
    });

    // Query for all notifications
    const { data: allData, isLoading: allLoading } = useQuery<PaginatedResponse<AppNotification>>({
        queryKey: ['all-notifications', isAdmin],
        queryFn: async () => {
            const response = await api.get(endpointPrefix);
            return response.data;
        },
        enabled: visible && activeTab === 'all',
    });

    // Mutation to mark a specific notification as read
    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`${endpointPrefix}/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unread-notifications', isAdmin] });
            queryClient.invalidateQueries({ queryKey: ['all-notifications', isAdmin] });
        }
    });

    // Mutation to mark all notifications as read
    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await api.post(`${endpointPrefix}/read-all`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unread-notifications', isAdmin] });
            queryClient.invalidateQueries({ queryKey: ['all-notifications', isAdmin] });
        }
    });

    const unreadCount = unreadData?.meta?.total || 0;
    const notificationsList = activeTab === 'unread' ? (unreadData?.data || []) : (allData?.data || []);
    const isLoading = activeTab === 'unread' ? unreadLoading : allLoading;

    const handleNotificationClick = async (notification: AppNotification) => {
        if (!notification.read_at) {
            await markReadMutation.mutateAsync(notification.id);
        }
        setVisible(false);
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const handleRedirect = (notification: AppNotification) => {
        const type = notification.data.type || '';
        const campaignId = notification.data.campaign_id;

        if (isAdmin) {
            if (type === 'campaign_submitted' && campaignId) {
                navigate(`/admin/campaigns/${campaignId}/review`);
            } else if (type === 'withdrawal_requested') {
                navigate('/admin/withdrawals');
            }
        } else {
            if (type === 'campaign_verified') {
                navigate('/my-campaigns');
            } else if (type === 'withdrawal_processed') {
                navigate('/dashboard'); // Under recent withdrawals history
            } else if (type === 'donation_received') {
                navigate('/my-campaigns');
            }
        }
        setIsModalOpen(false);
    };

    const getRedirectLabel = (type: string) => {
        if (isAdmin) {
            if (type === 'campaign_submitted') return 'Review Campaign';
            if (type === 'withdrawal_requested') return 'Proses Pencairan';
        } else {
            if (type === 'campaign_verified') return 'Lihat Campaign Saya';
            if (type === 'withdrawal_processed') return 'Lihat Dashboard';
            if (type === 'donation_received') return 'Lihat Campaign Saya';
        }
        return 'Buka Halaman';
    };

    const getNotificationIcon = (type: string, status?: string) => {
        switch (type) {
            case 'campaign_submitted':
                return <Avatar icon={<RocketOutlined />} style={{ backgroundColor: '#3b82f6' }} />;
            case 'withdrawal_requested':
                return <Avatar icon={<BankOutlined />} style={{ backgroundColor: '#f59e0b' }} />;
            case 'campaign_verified':
                return status === 'approved' 
                    ? <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#10b981' }} />
                    : <Avatar icon={<CloseCircleOutlined />} style={{ backgroundColor: '#ef4444' }} />;
            case 'withdrawal_processed':
                return status === 'completed' || status === 'approved'
                    ? <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#10b981' }} />
                    : <Avatar icon={<CloseCircleOutlined />} style={{ backgroundColor: '#ef4444' }} />;
            case 'donation_received':
                return <Avatar icon={<HeartOutlined />} style={{ backgroundColor: '#ec4899' }} />;
            default:
                return <Avatar icon={<BellOutlined />} style={{ backgroundColor: '#64748b' }} />;
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffMin < 1) return 'Baru saja';
        if (diffMin < 60) return `${diffMin} menit yang lalu`;
        if (diffHr < 24) return `${diffHr} jam yang lalu`;
        return `${diffDay} hari yang lalu`;
    };

    const listContent = (
        <List
            itemLayout="horizontal"
            dataSource={notificationsList}
            style={{ 
                overflowY: 'auto', 
                flex: isMobile ? 1 : undefined,
                maxHeight: isMobile ? undefined : 320, 
                paddingRight: 4 
            }}
            renderItem={(item: AppNotification) => (
                <List.Item
                    onClick={() => handleNotificationClick(item)}
                    style={{ 
                        padding: '12px', 
                        cursor: 'pointer', 
                        borderRadius: 12,
                        transition: 'all 0.2s',
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: item.read_at ? 'transparent' : 'rgba(22, 119, 255, 0.04)',
                        marginBottom: 6
                    }}
                    className="notification-item-hover"
                >
                    <List.Item.Meta
                        avatar={getNotificationIcon(item.data.type, item.data.status)}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                <Text strong={!item.read_at} style={{ fontSize: 13, lineHeight: 1.3, color: item.read_at ? '#64748b' : '#0f172a' }}>
                                    {item.data.message}
                                </Text>
                                {!item.read_at && (
                                    <span style={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        backgroundColor: '#1677ff', 
                                        display: 'inline-block',
                                        flexShrink: 0,
                                        marginTop: 4 
                                    }} />
                                )}
                            </div>
                        }
                        description={
                            <Space size="middle" style={{ marginTop: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    {formatRelativeTime(item.created_at)}
                                </Text>
                                <Text type="primary" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <EyeOutlined style={{ fontSize: 10 }} /> Detail
                                </Text>
                            </Space>
                        }
                    />
                </List.Item>
            )}
        />
    );

    const desktopContent = (
        <div style={{ width: 340, padding: '4px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 8px', gap: '8px' }}>
                <Title level={5} style={{ margin: 0, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>Notifikasi</Title>
                {unreadCount > 0 && (
                    <Button 
                        type="link" 
                        size="small" 
                        icon={<CheckOutlined />}
                        onClick={() => markAllReadMutation.mutate()}
                        loading={markAllReadMutation.isPending}
                        style={{ padding: 0, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        Tandai semua dibaca
                    </Button>
                )}
            </div>

            <Tabs 
                activeKey={activeTab} 
                onChange={(key) => setActiveTab(key as 'unread' | 'all')}
                size="small"
                style={{ marginBottom: 8 }}
                centered
                items={[
                    { key: 'unread', label: `Belum Dibaca (${unreadCount})` },
                    { key: 'all', label: 'Semua' }
                ]}
            />

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Spin size="default" tip="Memuat..." />
                </div>
            ) : notificationsList.length === 0 ? (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={<Text type="secondary">Tidak ada notifikasi</Text>} 
                    style={{ padding: '24px 0' }}
                />
            ) : (
                listContent
            )}
        </div>
    );

    const triggerButton = (
        <Badge count={unreadCount} overflowCount={99} size="small" offset={[-2, 2]}>
            <Button 
                type="text" 
                icon={<BellOutlined />} 
                onClick={() => isMobile && setVisible(true)}
                style={{ 
                    fontSize: '18px', 
                    color: '#64748b',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                }} 
            />
        </Badge>
    );

    return (
        <>
            {isMobile ? (
                <>
                    {triggerButton}
                    <Drawer
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                                <Title level={5} style={{ margin: 0, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>Notifikasi</Title>
                                {unreadCount > 0 && (
                                    <Button 
                                        type="link" 
                                        size="small" 
                                        icon={<CheckOutlined />}
                                        onClick={() => markAllReadMutation.mutate()}
                                        loading={markAllReadMutation.isPending}
                                        style={{ padding: 0, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}
                                    >
                                        Tandai dibaca
                                    </Button>
                                )}
                            </div>
                        }
                        placement="right"
                        onClose={() => setVisible(false)}
                        open={visible}
                        width={320}
                        styles={{ body: { padding: '12px 16px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' } }}
                        closable={true}
                    >
                        <Tabs 
                            activeKey={activeTab} 
                            onChange={(key) => setActiveTab(key as 'unread' | 'all')}
                            size="small"
                            style={{ marginBottom: 12 }}
                            centered
                            items={[
                                { key: 'unread', label: `Belum Dibaca (${unreadCount})` },
                                { key: 'all', label: 'Semua' }
                            ]}
                        />

                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                <Spin size="default" tip="Memuat..." />
                            </div>
                        ) : notificationsList.length === 0 ? (
                            <Empty 
                                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                description={<Text type="secondary">Tidak ada notifikasi</Text>} 
                                style={{ padding: '24px 0' }}
                            />
                        ) : (
                            listContent
                        )}
                    </Drawer>
                </>
            ) : (
                <Popover
                    content={desktopContent}
                    title={null}
                    trigger="click"
                    open={visible}
                    onOpenChange={setVisible}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                    overlayClassName="notification-popover"
                >
                    {triggerButton}
                </Popover>
            )}

            {/* Notification Detail Modal */}
            <Modal
                title={
                    <Space style={{ display: 'flex', alignItems: 'center' }}>
                        {selectedNotification && getNotificationIcon(selectedNotification.data.type, selectedNotification.data.status)}
                        <Text strong style={{ fontSize: 16 }}>Detail Notifikasi</Text>
                    </Space>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={
                    isMobile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            {selectedNotification && getRedirectLabel(selectedNotification.data.type) && (
                                <Button 
                                    key="redirect" 
                                    type="primary" 
                                    block
                                    onClick={() => handleRedirect(selectedNotification)}
                                    style={{ height: 40, borderRadius: 8, fontWeight: 600 }}
                                >
                                    {getRedirectLabel(selectedNotification.data.type)}
                                </Button>
                            )}
                            <Button 
                                key="close" 
                                block
                                onClick={() => setIsModalOpen(false)}
                                style={{ height: 40, borderRadius: 8 }}
                            >
                                Tutup
                            </Button>
                        </div>
                    ) : [
                        <Button key="close" onClick={() => setIsModalOpen(false)}>
                            Tutup
                        </Button>,
                        selectedNotification && getRedirectLabel(selectedNotification.data.type) && (
                            <Button 
                                key="redirect" 
                                type="primary" 
                                onClick={() => handleRedirect(selectedNotification)}
                            >
                                {getRedirectLabel(selectedNotification.data.type)}
                            </Button>
                        )
                    ]
                }
                centered
                width={isMobile ? '90%' : 400}
                styles={{ body: { padding: '16px 24px' } }}
            >
                {selectedNotification && (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Text style={{ fontSize: 14, color: '#1e293b', display: 'block', lineHeight: 1.5 }}>
                            {selectedNotification.data.message}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(selectedNotification.created_at).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </Space>
                )}
            </Modal>
        </>
    );
};

export default NotificationDropdown;
