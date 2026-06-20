import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import LottieComponent from 'lottie-react';
import notFoundAnimation from '../assets/lottiefiles/not-found.json';

// Handle CommonJS/ESM default export mismatch
const Lottie = (LottieComponent as any).default || LottieComponent;

const { Title, Paragraph } = Typography;

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
            background: '#f8fafc'
        }}>
            <div style={{ maxWidth: '400px', width: '100%', marginBottom: '24px' }}>
                <Lottie 
                    animationData={notFoundAnimation} 
                    loop={true} 
                    style={{ height: '300px', width: '100%' }}
                />
            </div>
            
            <Space direction="vertical" size="middle" style={{ maxWidth: '500px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Halaman Tidak Ditemukan
                </Title>
                <Paragraph type="secondary" style={{ fontSize: '16px', margin: 0 }}>
                    Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin tautan tersebut rusak atau halaman telah dihapus.
                </Paragraph>
                <div style={{ marginTop: '12px' }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                        style={{ 
                            borderRadius: '12px', 
                            height: '48px', 
                            padding: '0 28px',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(22, 119, 255, 0.2)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Kembali ke Beranda
                    </Button>
                </div>
            </Space>
        </div>
    );
};

export default NotFoundPage;
