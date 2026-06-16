import { Layout, Menu, Button, Space, Typography, Row, Col, Drawer, Grid } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { SearchOutlined, FacebookFilled, InstagramFilled, TwitterOutlined, YoutubeFilled, MenuOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';
import type {SiteSetting} from '../types';

const { Header, Content, Footer } = Layout;
const { Text, Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await api.get('/site-settings');
            return response.data.data;
        },
    });

    const getSetting = (key: string) => settings?.find((s: SiteSetting) => s.key === key)?.value;

    const menuItems = [
        { key: 'home', label: <Link to="/" onClick={() => setDrawerOpen(false)}>Beranda</Link> },
        { key: 'explore', label: <Link to="/campaigns" onClick={() => setDrawerOpen(false)}>Jelajahi</Link> },
        { key: 'how-it-works', label: <Link to="/" onClick={() => setDrawerOpen(false)}>Cara Kerja</Link> },
        { key: 'about', label: <Link to="/" onClick={() => setDrawerOpen(false)}>Tentang Kami</Link> },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
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
                        defaultSelectedKeys={['home']}
                        style={{ flex: 1, borderBottom: 'none', background: 'transparent', justifyContent: 'center', marginLeft: '2rem' }}
                        items={menuItems.map(item => ({
                            ...item,
                            label: <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.label}</span>
                        }))}
                    />
                )}

                {!isMobile && (
                    <Space size="large">
                        <Button type="text" icon={<SearchOutlined />} style={{ fontSize: '18px', color: '#475569' }} />
                        <Button type="text" onClick={() => navigate('/auth/login')} style={{ fontWeight: 600, color: '#475569' }}>Masuk</Button>
                        <Button type="primary" onClick={() => navigate('/campaigns')} style={{ background: '#1677ff', height: '42px', padding: '0 24px', borderRadius: '8px', fontWeight: 600, border: 'none' }}>
                            Daftar
                        </Button>
                    </Space>
                )}

                {isMobile && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Button type="text" icon={<SearchOutlined />} style={{ fontSize: '20px', color: '#0f172a' }} />
                        <Button type="text" icon={<MenuOutlined style={{ fontSize: 22 }} />} onClick={() => setDrawerOpen(true)} style={{ color: '#0f172a' }} />
                    </div>
                )}
            </Header>

            {/* Mobile Drawer */}
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
                    defaultSelectedKeys={['home']}
                    style={{ border: 'none' }}
                    items={menuItems}
                />
                <div style={{ padding: '24px 16px', borderTop: '1px solid #f1f5f9', marginTop: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Button block onClick={() => { navigate('/auth/login'); setDrawerOpen(false); }} style={{ fontWeight: 600 }}>Masuk</Button>
                        <Button block type="primary" onClick={() => { navigate('/campaigns'); setDrawerOpen(false); }} style={{ background: '#1677ff', fontWeight: 600 }}>Daftar</Button>
                    </Space>
                </div>
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
                                <Link to="/" style={{ color: '#64748b' }}>Cara Kerja</Link>
                                <Link to="/" style={{ color: '#64748b' }}>Buat Campaign</Link>
                            </Space>
                        </Col>
                        <Col xs={12} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Informasi</Title>
                            <Space direction="vertical" size="middle">
                                <Link to="/" style={{ color: '#64748b' }}>Tentang Kami</Link>
                                <Link to="/" style={{ color: '#64748b' }}>FAQ</Link>
                                <Link to="/" style={{ color: '#64748b' }}>Kebijakan Privasi</Link>
                                <Link to="/" style={{ color: '#64748b' }}>Syarat & Ketentuan</Link>
                            </Space>
                        </Col>
                        <Col xs={12} md={4}>
                            <Title level={5} style={{ marginBottom: 24, fontSize: '1rem', fontWeight: 700 }}>Dukungan</Title>
                            <Space direction="vertical" size="middle">
                                <Link to="/" style={{ color: '#64748b' }}>Pusat Bantuan</Link>
                                <Link to="/" style={{ color: '#64748b' }}>Syarat & Ketentuan</Link>
                                <Link to="/" style={{ color: '#64748b' }}>Kebijakan Privasi</Link>
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