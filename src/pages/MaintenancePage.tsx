import React from 'react';
import { Typography, Space, Button } from 'antd';
import { WhatsAppOutlined, MailOutlined } from '@ant-design/icons';
import LottieComponent from 'lottie-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { SiteSetting } from '../types';
import maintenanceAnimation from '../assets/lottiefiles/maintenance.json';

const { Title, Paragraph, Text } = Typography;

// Handle CommonJS/ESM default export mismatch
const Lottie = (LottieComponent as any).default || LottieComponent;

const MaintenancePage: React.FC = () => {
    // Fetch site settings for contact info
    const { data: settings } = useQuery<SiteSetting[]>({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await api.get('/site-settings');
            return response.data.data;
        },
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    });

    const contactWhatsapp = settings?.find(s => s.key === 'contact_whatsapp')?.value;
    const contactEmail = settings?.find(s => s.key === 'contact_email')?.value;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '80px 24px 40px',
            textAlign: 'center',
            background: '#f8fafc',
            boxSizing: 'border-box',
            position: 'relative'
        }}>
            {/* Branding Header Logo */}
            <div style={{ 
                position: 'absolute', 
                top: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px' 
            }}>
                <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: '32px' }} />
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#0f172a', letterSpacing: '-0.5px' }}>FundRaiser</span>
            </div>
            {/* Lottie Container - shifted slightly to the left with an offset to correct asset misalignment */}
            <div style={{
                width: '320px',
                height: '240px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'translateX(-40px)', // Adjusting the Lottie animation alignment to the left
            }}>
                <Lottie 
                    animationData={maintenanceAnimation} 
                    loop={true} 
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            
            <Space direction="vertical" size="large" style={{ maxWidth: '500px', width: '100%' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Situs Sedang Pemeliharaan
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: '16px', marginTop: '12px', marginBottom: 0, lineHeight: '1.6' }}>
                        Kami sedang melakukan peningkatan sistem berkala untuk memberikan pengalaman terbaik untuk Anda. Platform akan segera aktif kembali.
                    </Paragraph>
                </div>

                {(contactWhatsapp || contactEmail) && (
                    <div style={{
                        marginTop: '16px',
                        borderTop: '1px dashed #e2e8f0',
                        paddingTop: '24px',
                        width: '100%'
                    }}>
                        <Text strong style={{ display: 'block', marginBottom: '16px', color: '#64748b', fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Hubungi Dukungan Teknis
                        </Text>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}>
                            {contactWhatsapp && (
                                <Button 
                                    type="default"
                                    icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                                    onClick={() => window.open(`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                                    style={{
                                        borderRadius: '12px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    WhatsApp
                                </Button>
                            )}
                            {contactEmail && (
                                <Button 
                                    type="default"
                                    icon={<MailOutlined style={{ color: '#1677ff' }} />}
                                    onClick={() => window.open(`mailto:${contactEmail}`, '_blank')}
                                    style={{
                                        borderRadius: '12px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    Email Support
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default MaintenancePage;
