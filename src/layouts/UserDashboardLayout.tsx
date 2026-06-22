import React, { useState, useEffect } from 'react';
import {
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    HeartOutlined,
    RocketOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, ConfigProvider, Drawer, Grid } from 'antd';
import { Outlet, useNavigate, Link, useLocation, Navigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { getImageUrl } from '../lib/utils';
import NotificationDropdown from '../components/NotificationDropdown';

const { Header, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const UserDashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();
    const screens = useBreakpoint();
    
    const isMobile = !screens.md;
    // Only show name on large screens (lg and up)
    const showName = !!screens.lg;
    
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data: profileResponse, isLoading: profileLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await api.get('/auth/profile');
            console.log('Profile Response:', response.data.data);
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 menit
    });

    const userData = profileResponse;
    const avatarFromApi = userData?.avatar_url;
    const avatarFromStorage = localStorage.getItem('user_avatar');
    const rawAvatar = avatarFromApi || avatarFromStorage;
    const finalAvatarSrc = getImageUrl(rawAvatar);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('user_role');
        if (!token || role !== 'user') {
            navigate('/auth/login');
        }
    }, [navigate]);

    // ponytail: Listen for profile updates to trigger refetch & storage sync
    useEffect(() => {
        const syncProfile = () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        };
        window.addEventListener('user-profile-updated', syncProfile);
        return () => window.removeEventListener('user-profile-updated', syncProfile);
    }, [queryClient]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const userMenuItems = [
        {
            key: '/dashboard',
            label: 'Dashboard',
            icon: <DashboardOutlined />,
            onClick: () => navigate('/dashboard'),
        },
        {
            key: '/profile',
            label: 'Profil Saya',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile'),
        },
        {
            type: 'divider' as const,
            key: 'divider',
        },
        {
            key: 'logout',
            label: 'Keluar',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    const navItems = [
        {
            key: '/dashboard',
            label: <Link to="/dashboard">Dashboard</Link>,
            icon: <DashboardOutlined />,
        },
        {
            key: '/my-campaigns',
            label: <Link to="/my-campaigns">Campaign Saya</Link>,
            icon: <RocketOutlined />,
        },
        {
            key: '/my-donations',
            label: <Link to="/my-donations">Donasi Saya</Link>,
            icon: <HeartOutlined />,
        },
        {
            key: '/profile',
            label: <Link to="/profile">Profil</Link>,
            icon: <UserOutlined />,
        },
    ];

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');

    if (!token || role !== 'user') {
        return <Navigate to="/auth/login" state={{ showToast: true }} replace />;
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 12,
                },
                components: {
                    Layout: {
                        headerBg: '#fff',
                        bodyBg: '#f8fafc',
                    },
                    Menu: {
                        activeBarHeight: 4,
                        itemColor: '#64748b',
                        itemSelectedColor: '#1677ff',
                        horizontalItemHoverColor: '#1677ff',
                    }
                },
            }}
        >
            <Layout style={{ minHeight: '100vh', overflowX: 'hidden' }}>
                <Header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                    padding: isMobile ? '0 20px' : '0 5%',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    height: '72px',
                    background: '#fff'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '32px', flexShrink: 0 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 32 }} />
                            <span style={{ fontWeight: 800, fontSize: isMobile ? '1.1rem' : '1.4rem', color: '#0f172a', letterSpacing: '-0.5px' }}>FundRaiser</span>
                        </Link>
                    </div>

                    {!isMobile && (
                        <div style={{ flex: 1, minWidth: 0, marginLeft: '32px' }}>
                            <Menu
                                mode="horizontal"
                                selectedKeys={[location.pathname]}
                                items={navItems}
                                overflowedIndicator={null} // Disable the "..." indicator to force items to show
                                style={{ 
                                    border: 'none', 
                                    fontWeight: 600,
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', flexShrink: 0, gap: '12px' }}>
                        <NotificationDropdown isAdmin={false} />
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <Space style={{ cursor: 'pointer', background: '#f8fafc', padding: (isMobile || !showName) ? '4px 8px' : '4px 12px', borderRadius: '12px' }}>
                                <Avatar 
                                    src={finalAvatarSrc} 
                                    icon={<UserOutlined />} 
                                    style={{ backgroundColor: '#1677ff' }} 
                                />
                                {showName && (
                                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                        <Text strong style={{ fontSize: '14px' }}>
                                            {(userData?.name || localStorage.getItem('user_name') || 'User').split(' ')[0]}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>Donatur</Text>
                                    </div>
                                )}
                            </Space>
                        </Dropdown>

                        {isMobile && (
                            <Button 
                                type="text" 
                                icon={<MenuOutlined style={{ fontSize: 22 }} />} 
                                onClick={() => setDrawerOpen(true)} 
                                style={{ 
                                    color: '#0f172a', 
                                    paddingRight: 0, 
                                    marginLeft: 12,
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} 
                            />
                        )}
                    </div>
                </Header>

                <Drawer
                    title="Menu Navigasi"
                    placement="right"
                    onClose={() => setDrawerOpen(false)}
                    open={drawerOpen}
                    width={280}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={navItems}
                        onClick={() => setDrawerOpen(false)}
                        style={{ border: 'none' }}
                    />
                    <div style={{ marginTop: 'auto', padding: '24px 16px', borderTop: '1px solid #f1f5f9' }}>
                        <Button block danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ height: 44, borderRadius: 8 }}>
                            Keluar
                        </Button>
                    </div>
                </Drawer>

                <Content style={{ padding: isMobile ? '24px 16px' : '32px 5%', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <Outlet />
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default UserDashboardLayout;
