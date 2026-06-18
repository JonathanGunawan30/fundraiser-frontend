import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Result, Button, Card, Typography, Space } from 'antd';
import { CheckCircleFilled, ClockCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

const DonationFinishPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const params = new URLSearchParams(location.search);
    const orderId = params.get('order_id');
    const status = params.get('transaction_status');

    let title = "Status Pembayaran";
    let subTitle = "Terima kasih atas partisipasi Anda.";
    let statusIcon: 'success' | 'error' | 'info' | 'warning' = 'info';

    if (status === 'settlement' || status === 'capture') {
        title = "Pembayaran Berhasil!";
        subTitle = "Terima kasih! Donasi Anda telah kami terima dan akan disalurkan kepada yang berhak.";
        statusIcon = 'success';
    } else if (status === 'pending') {
        title = "Menunggu Pembayaran";
        subTitle = "Silakan selesaikan pembayaran Anda sesuai dengan instruksi yang diberikan.";
        statusIcon = 'warning';
    } else if (status === 'deny' || status === 'cancel' || status === 'expire') {
        title = "Pembayaran Gagal";
        subTitle = "Mohon maaf, transaksi Anda tidak dapat diproses atau telah dibatalkan.";
        statusIcon = 'error';
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
            <Card style={{ maxWidth: 600, width: '100%', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Result
                    status={statusIcon}
                    title={title}
                    subTitle={subTitle}
                    extra={[
                        <Button type="primary" key="dashboard" onClick={() => navigate('/dashboard')} style={{ borderRadius: 8 }}>
                            Ke Dashboard Saya
                        </Button>,
                        <Button key="home" onClick={() => navigate('/')} style={{ borderRadius: 8 }}>
                            Kembali ke Beranda
                        </Button>,
                    ]}
                >
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Space direction="vertical">
                            <Text type="secondary">ID Pesanan: {orderId}</Text>
                            <Text type="secondary">Status: {status?.toUpperCase()}</Text>
                        </Space>
                    </div>
                </Result>
            </Card>
        </div>
    );
};

export default DonationFinishPage;
