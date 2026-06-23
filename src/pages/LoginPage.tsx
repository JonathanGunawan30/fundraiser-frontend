import React, { useEffect, useRef } from 'react';
import { Card, Typography, Space, Button, App, Divider } from 'antd';
import { GoogleOutlined, GithubOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const LoginPage: React.FC = () => {
    const { notification } = App.useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const hasShownToast = useRef(false);

    useEffect(() => {
        if (location.state?.showToast && !hasShownToast.current) {
            hasShownToast.current = true;
            notification.warning({
                message: 'Akses Dibatasi',
                description: 'Silakan login terlebih dahulu untuk mengakses halaman tersebut.',
                placement: 'topRight'
            });
            // Clear react-router location state to prevent repeating on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, notification, navigate]);

    const handleSocialLogin = (provider: string) => {
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        window.location.href = `${baseUrl}/auth/user/${provider}/redirect`;
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            position: 'relative',
            padding: '20px'
        }}>
            
            {/* Floating ambient background glows */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(22, 119, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />
            
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(9, 88, 217, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Back to Home Button */}
            <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 10 }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/')} 
                    style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    Kembali ke Beranda
                </Button>
            </div>

            {/* Center Card */}
            <Card 
                style={{ 
                    width: '100%', 
                    maxWidth: 440, 
                    textAlign: 'center', 
                    borderRadius: '24px', 
                    border: 'none',
                    boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    padding: '24px 12px'
                }}
            >
                <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 48 }} />
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.5px' }}>FundRaiser</span>
                    </Link>
                </div>
                
                <Title level={3} style={{ marginBottom: 8, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Selamat Datang Kembali
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 32, fontSize: '0.95rem' }}>
                    Masuk ke akun Anda untuk melanjutkan aktivitas penggalangan atau donasi
                </Paragraph>
                
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button 
                        icon={<GoogleOutlined style={{ fontSize: '18px' }} />} 
                        block 
                        size="large" 
                        onClick={() => handleSocialLogin('google')}
                        style={{ 
                            height: 50, 
                            fontWeight: 600, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        Masuk dengan Google
                    </Button>

                    <Button 
                        icon={<GithubOutlined style={{ fontSize: '18px' }} />} 
                        block 
                        size="large" 
                        onClick={() => handleSocialLogin('github')}
                        style={{ 
                            height: 50, 
                            fontWeight: 600, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: '#0f172a', 
                            color: 'white',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                        }}
                    >
                        Masuk dengan GitHub
                    </Button>

                    <Divider style={{ margin: '24px 0', fontSize: '0.8rem', color: '#94a3b8' }}>Kebijakan Platform</Divider>

                    <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', lineHeight: 1.6 }}>
                        Dengan melanjutkan, Anda menyetujui <Link to="/terms">Syarat & Ketentuan</Link> serta <Link to="/privacy">Kebijakan Privasi</Link> kami.
                    </Text>
                </Space>
            </Card>
        </div>
    );
};

export default LoginPage;