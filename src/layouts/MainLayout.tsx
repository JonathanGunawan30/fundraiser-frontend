import { Layout, Menu, Button, Space, Typography, Row, Col, Drawer, Grid, Dropdown, Avatar, Input } from 'antd';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
    SearchOutlined, 
    FacebookFilled, 
    InstagramFilled, 
    TwitterOutlined, 
    YoutubeFilled, 
    MenuOutlined,
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';
import type {SiteSetting} from '../types';
import { useAuth } from '../lib/AuthContext';

const { Header, Content, Footer } = Layout;
const { Text, Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userMenu = {
        items: [
            {
                key: 'dashboard',
                label: 'Dashboard',
                icon: <DashboardOutlined />,
                onClick: () => navigate('/dashboard'),
            },
            {
                key: 'profile',
                label: 'Profil Saya',
                icon: <ProfileOutlined />,
                onClick: () => navigate('/profile'),
            },
            {
                key: 'divider',
                type: 'divider' as const,
            },
            {
                key: 'logout',
                label: 'Keluar',
                icon: <LogoutOutlined />,
                danger: true,
                onClick: handleLogout,
            },
        ],
    };

    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await api.get('/site-settings');
            return response.data.data;
        },
    });

    const getSetting = (key: string) => settings?.find((s: SiteSetting) => s.key === key)?.value;

    const location = useLocation();

    const getActiveKey = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/campaigns')) return 'explore';
        if (path.startsWith('/about')) return 'about';
        return 'home';
    };

    const menuItems = [
        { key: 'home', label: <Link to="/" onClick={() => setDrawerOpen(false)}>Beranda</Link> },
        { key: 'explore', label: <Link to="/campaigns" onClick={() => setDrawerOpen(false)}>Jelajahi</Link> },
        { key: 'about', label: <Link to="/about" onClick={() => setDrawerOpen(false)}>Tentang Kami</Link> },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
                <Header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: isMobile ? '0 20px' : '0 5%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                    <img src="/logo/fundraiser-logo-nt.png" alt="FundRaiser Logo" style={{ height: isMobile ? 28 : 34 }} />
                    <span style={{ fontWeight: 800, fontSize: isMobile ? '1.2rem' : '1.4rem', color: '#0f172a', letterSpacing: '-0.5px' }}>FundRaiser</span>
                </Link>

                {!isMobile && (
                    <Menu
                        mode="horizontal"
                        selectedKeys={[getActiveKey()]}
                        style={{ flex: 1, borderBottom: 'none', background: 'transparent', justifyContent: 'center', marginLeft: '2rem' }}
                        items={menuItems.map(item => ({
                            ...item,
                            label: <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.label}</span>
                        }))}
                    />
                )}

                {!isMobile && (
                    <Space size="large">
                        {isLoggedIn && user ? (
                            <Dropdown menu={userMenu} placement="bottomRight" arrow>
                                <Space style={{ cursor: 'pointer' }}>
                                    <Avatar src={user.avatar} icon={<UserOutlined />} />
                                    <Text strong>{user.name.split(' ')[0]}</Text>
                                </Space>
                            </Dropdown>
                        ) : (
                            <Button 
                                type="primary" 
                                onClick={() => navigate('/auth/login')} 
                                style={{ background: '#1677ff', height: '42px', padding: '0 24px', borderRadius: '8px', fontWeight: 600, border: 'none' }}
                            >
                                Masuk / Daftar
                            </Button>
                        )}
                    </Space>
                )}

                {isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isLoggedIn && user && (
                            <Dropdown menu={userMenu} placement="bottomRight" arrow>
                                <Avatar src={user.avatar} icon={<UserOutlined />} />
                            </Dropdown>
                        )}
                        <Button type="text" icon={<MenuOutlined style={{ fontSize: 22 }} />} onClick={() => setDrawerOpen(true)} style={{ color: '#0f172a', paddingRight: 0, paddingLeft: 4 }} />
                    </div>
                )}
            </Header>

            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 28 }} />
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>FundRaiser</span>
                    </div>
                }
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={280}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[getActiveKey()]}
                    style={{ border: 'none' }}
                    items={menuItems}
                />
                {!isLoggedIn && (
                    <div style={{ padding: '24px 16px', borderTop: '1px solid #f1f5f9', marginTop: 16 }}>
                        <Button block type="primary" onClick={() => { navigate('/auth/login'); setDrawerOpen(false); }} style={{ background: '#1677ff', fontWeight: 600, height: '42px' }}>Masuk / Daftar</Button>
                    </div>
                )}
            </Drawer>

            <Content style={{ padding: 0 }}>
                <Outlet />
            </Content>

            <Footer style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '80px 5% 40px' }}>
                <div style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={8}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 20 }}>
                                <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 32 }} />
                                <span style={{ fontWeight: '800', fontSize: '1.3rem', color: '#0f172a' }}>FundRaiser</span>
                            </div>
                            <Paragraph style={{ maxWidth: 320, color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                Platform crowdfunding untuk mewujudkan ide dan membantu sesama melalui kekuatan bersama.
                            </Paragraph>
                        </Col>
                        <Col xs={12} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Platform</Title>
                            <Space direction="vertical" size="middle">
                                <Link to="/" style={{ color: '#64748b' }}>Beranda</Link>
                                <Link to="/campaigns" style={{ color: '#64748b' }}>Jelajahi</Link>
                                <Link to="/" style={{ color: '#64748b' }}>Buat Campaign</Link>
                            </Space>
                        </Col>
                        <Col xs={12} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Informasi</Title>
                            <Space direction="vertical" size="middle">
                                <Link to="/about" style={{ color: '#64748b' }}>Tentang Kami</Link>
                                <Link to="/help-center" style={{ color: '#64748b' }}>FAQ</Link>
                                <Link to="/privacy" style={{ color: '#64748b' }}>Kebijakan Privasi</Link>
                                <Link to="/terms" style={{ color: '#64748b' }}>Syarat & Ketentuan</Link>
                            </Space>
                        </Col>
                        <Col xs={12} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Dukungan</Title>
                            <Space direction="vertical" size="middle">
                                <Link to="/help-center" style={{ color: '#64748b' }}>Pusat Bantuan</Link>
                                <Link to="/terms" style={{ color: '#64748b' }}>Syarat & Ketentuan</Link>
                                <Link to="/privacy" style={{ color: '#64748b' }}>Kebijakan Privasi</Link>
                            </Space>
                        </Col>
                        <Col xs={24} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Kontak Kami</Title>
                            <Space direction="vertical" size="middle">
                                <Text style={{ color: '#64748b' }}>Email: {getSetting('contact_email') || 'support@fundraiser.id'}</Text>
                                <Text style={{ color: '#64748b' }}>WhatsApp: {getSetting('contact_whatsapp') || '+62 8xx xxxx xxxx'}</Text>
                            </Space>
                        </Col>
                        <Col xs={12} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Ikuti Kami</Title>
                            <Space size="middle">
                                <Button type="text" shape="circle" icon={<FacebookFilled style={{ fontSize: 20 }} />} />
                                <Button type="text" shape="circle" icon={<InstagramFilled style={{ fontSize: 20 }} />} />
                                <Button type="text" shape="circle" icon={<TwitterOutlined style={{ fontSize: 20 }} />} />
                                <Button type="text" shape="circle" icon={<YoutubeFilled style={{ fontSize: 20 }} />} />
                            </Space>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center', marginTop: 80 }}>
                        <Text style={{ color: '#94a3b8', fontSize: '0.9rem' }}>© 2026 Fundraiser. All rights reserved.</Text>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};

export default MainLayout;