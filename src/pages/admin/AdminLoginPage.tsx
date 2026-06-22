import React, { useState, useRef } from 'react';
import { Form, Input, Button, Card, Typography, App, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import api from '../../api/axios';
import { getErrorMessages } from '../../lib/utils';

const { Title, Text } = Typography;

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
            // ponytail: Reset turnstile token after successful consumption so resend requires a new challenge
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 12 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 64 }} />
                    <Title level={2} style={{ marginTop: 16, marginBottom: 0 }}>Admin Portal</Title>
                    <Text type="secondary">Secure Access for Administrators</Text>
                </div>

                <Steps
                    current={step}
                    items={[
                        { title: 'Email' },
                        { title: 'OTP' },
                    ]}
                    style={{ marginBottom: 32 }}
                    size="small"
                />

                {step === 0 ? (
                    <Form layout="vertical" onFinish={handleEmailSubmit}>
                        <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input size="large" placeholder="admin@fundraiser.id" />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: 48, fontWeight: 600 }}>
                                Send OTP
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form layout="vertical" onFinish={handleOtpSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                Kami telah mengirimkan kode OTP ke email Anda (jika terdaftar di sistem kami). Silakan periksa inbox atau spam.
                            </Text>
                            <Text>Tujuan pengiriman: <strong>{email}</strong></Text>
                            <Button type="link" size="small" onClick={() => setStep(0)} style={{ padding: 0, marginLeft: 8 }}>
                                Change?
                            </Button>
                        </div>
                        <Form.Item
                            label="Verification Code"
                            name="otp"
                            rules={[
                                { required: true, message: 'Please input the OTP!' },
                                { len: 6, message: 'OTP must be 6 digits!' }
                            ]}
                        >
                            <Input size="large" placeholder="123456" maxLength={6} style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: 48, fontWeight: 600 }}>
                                Verify & Login
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <Button type="link" onClick={() => handleEmailSubmit({ email })} loading={loading}>
                                Resend OTP
                            </Button>
                        </div>
                    </Form>
                )}

                {/* ponytail: Persist Turnstile widget outside step condition so it can be solved for both initial submission and resend */}
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
