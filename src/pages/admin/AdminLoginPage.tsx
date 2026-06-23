import React, { useState, useRef } from 'react';
import { Form, Input, Button, Card, Typography, App, Steps, Space } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { ArrowLeftOutlined, SafetyCertificateFilled, MailOutlined, KeyOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { getErrorMessages } from '../../lib/utils';

const { Title, Text, Paragraph } = Typography;

const AdminLoginPage: React.FC = () => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const navigate = useNavigate();
    const { notification } = App.useApp();

    const handleEmailSubmit = async (values: { email: string }) => {
        if (!turnstileToken) {
            notification.error({
                message: 'Security Check',
                description: 'Please complete the security check.',
                placement: 'topRight',
            });
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/otp', {
                ...values,
                cf_turnstile_response: turnstileToken,
            });
            setEmail(values.email);
            setStep(1);
            notification.success({
                message: 'OTP Sent',
                description: 'If your email is registered in our system, we have sent the OTP verification code.',
                placement: 'topRight',
            });
            // Reset turnstile token after successful consumption so resend requires a new challenge
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        } catch (error: unknown) {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Error',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (values: { otp: string }) => {
        setLoading(true);
        try {
            const response = await api.post('/admin/login', {
                email,
                otp: values.otp,
            });
            const { token, admin } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user_role', 'admin');
            localStorage.setItem('user_name', admin.name);
            localStorage.setItem('user_avatar', admin.avatar_url || '');
            notification.success({
                message: 'Success',
                description: 'Welcome back, Admin!',
                placement: 'topRight',
            });
            navigate('/admin');
        } catch (error: unknown) {
            const messages = getErrorMessages(error);
            notification.error({
                message: 'Login Error',
                description: (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                ),
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            position: 'relative',
            padding: '20px',
            overflow: 'hidden'
        }}>
            {/* Visual glows decoration */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(22, 119, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />
            
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(9, 88, 217, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Back to Home Button */}
            <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 10 }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined style={{ color: '#64748b' }} />} 
                    onClick={() => navigate('/')} 
                    style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    Kembali ke Beranda
                </Button>
            </div>

            {/* Admin Login Card (White Theme) */}
            <Card 
                style={{ 
                    width: '100%', 
                    maxWidth: 440, 
                    borderRadius: '24px', 
                    border: 'none',
                    boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    padding: '24px 12px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 48 }} />
                            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.5px' }}>FundRaiser</span>
                        </Link>
                    </div>
                    <Title level={3} style={{ color: '#0f172a', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Admin Portal</Title>
                    <Paragraph style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Akses Keamanan untuk Administrator</Paragraph>
                </div>

                <Steps
                    current={step}
                    items={[
                        { title: <span style={{ color: step === 0 ? '#1677ff' : '#64748b', fontWeight: 600 }}>Email</span> },
                        { title: <span style={{ color: step === 1 ? '#1677ff' : '#64748b', fontWeight: 600 }}>OTP</span> },
                    ]}
                    style={{ marginBottom: 32 }}
                    size="small"
                />

                {step === 0 ? (
                    <Form layout="vertical" onFinish={handleEmailSubmit}>
                        <Form.Item
                            label={<span style={{ color: '#475569', fontWeight: 600 }}>Alamat Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Silakan masukkan alamat email!' },
                                { type: 'email', message: 'Alamat email tidak valid!' }
                            ]}
                        >
                            <Input 
                                size="large" 
                                placeholder="admin@fundraiser.id" 
                                prefix={<MailOutlined style={{ color: '#64748b' }} />}
                                style={{ 
                                    background: '#f8fafc', 
                                    border: '1px solid #cbd5e1', 
                                    color: '#0f172a',
                                    borderRadius: '10px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: 48, fontWeight: 700, borderRadius: '10px', background: '#1677ff', border: 'none' }}>
                                Kirim Kode OTP
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form layout="vertical" onFinish={handleOtpSubmit}>
                        <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 8, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                Kode verifikasi OTP telah dikirimkan ke email Anda. Silakan periksa kotak masuk atau folder spam Anda.
                            </Text>
                            <Space wrap style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: '#0f172a' }}>Tujuan: <strong style={{ color: '#1677ff' }}>{email}</strong></Text>
                                <Button type="link" size="small" onClick={() => setStep(0)} style={{ padding: 0, fontWeight: 600 }}>
                                    Ubah email?
                                </Button>
                            </Space>
                        </div>
                        <Form.Item
                            label={<span style={{ color: '#cbd5e1', fontWeight: 600 }}>Kode Verifikasi OTP</span>}
                            name="otp"
                            rules={[
                                { required: true, message: 'Silakan masukkan kode OTP!' },
                                { len: 6, message: 'OTP harus berupa 6 digit!' }
                            ]}
                        >
                            <Input.OTP 
                                size="large" 
                                length={6}
                                formatter={(str) => str.replace(/[^0-9]/g, '')}
                                style={{ 
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }} 
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: 48, fontWeight: 700, borderRadius: '10px', background: '#1677ff', border: 'none' }}>
                                Verifikasi & Masuk
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <Button type="link" onClick={() => handleEmailSubmit({ email })} loading={loading} style={{ fontWeight: 600 }}>
                                Kirim Ulang OTP
                            </Button>
                        </div>
                    </Form>
                )}

                {/* Cloudflare Turnstile Verification */}
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                    <Turnstile
                        ref={turnstileRef}
                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                        options={{ theme: 'light' }}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => setTurnstileToken(null)}
                    />
                </div>
            </Card>
        </div>
    );
};

export default AdminLoginPage;
