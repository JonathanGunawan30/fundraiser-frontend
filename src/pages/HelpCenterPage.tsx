import React, { useState } from 'react';
import { Typography, Card, Row, Col, Input, Tag, Collapse, Space, Button, Spin } from 'antd';
import { 
    SearchOutlined, 
    QuestionCircleOutlined, 
    HeartOutlined, 
    UserOutlined, 
    WalletOutlined, 
    SafetyCertificateOutlined,
    MessageOutlined,
    MailOutlined,
    WhatsAppOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Faq, SiteSetting } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpCenterPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: faqs, isLoading: faqsLoading } = useQuery<Faq[]>({
        queryKey: ['faqs'],
        queryFn: async () => {
            const response = await api.get('/faqs');
            return response.data.data;
        },
    });

    const { data: settings } = useQuery<SiteSetting[]>({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await api.get('/site-settings');
            return response.data.data;
        },
    });

    const getSetting = (key: string) => settings?.find((s: SiteSetting) => s.key === key)?.value;

    const categories = [
        { key: 'general', title: 'Umum & Panduan', icon: <QuestionCircleOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
        { key: 'donation', title: 'Donatur & Donasi', icon: <HeartOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
        { key: 'campaigner', title: 'Penggalang Dana', icon: <UserOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
        { key: 'payment', title: 'Pencairan & Keuangan', icon: <WalletOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
        { key: 'security', title: 'Keamanan & Akun', icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
    ];

    const filteredFaqs = (faqs || []).filter(faq => {
        const matchesQuery = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesQuery;
    });

    return (
        <div style={{ background: '#f8fafc', padding: '60px 5% 100px' }}>
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header Jumbotron */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <Tag color="blue" style={{ borderRadius: '30px', padding: '4px 16px', fontWeight: 600, marginBottom: '16px' }}>
                        PUSAT BANTUAN
                    </Tag>
                    <Title level={1} style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
                        Ada yang bisa kami bantu?
                    </Title>
                    <Paragraph style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 24px' }}>
                        Cari panduan penggunaan, solusi kendala donasi, atau informasi mengenai sistem penggalangan dana.
                    </Paragraph>

                    {/* Search bar */}
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Input
                            placeholder="Cari pertanyaan atau solusi..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />}
                            size="large"
                            allowClear
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ borderRadius: '30px', padding: '12px 24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <Row gutter={[20, 20]} style={{ marginBottom: '50px' }}>
                    {categories.map((cat) => (
                        <Col xs={12} sm={8} md={4.8} key={cat.key} style={{ flex: 1 }}>
                            <Card 
                                hoverable 
                                style={{ borderRadius: '20px', border: 'none', textAlign: 'center', height: '100%' }}
                                bodyStyle={{ padding: '24px 16px' }}
                                onClick={() => {
                                    const matchingQuestion = (faqs || []).find(f => f.question.toLowerCase().includes(cat.key) || f.answer.toLowerCase().includes(cat.key));
                                    if (matchingQuestion) {
                                        setSearchQuery(matchingQuestion.question);
                                    } else {
                                        setSearchQuery(cat.title);
                                    }
                                }}
                            >
                                <div style={{ marginBottom: '16px' }}>{cat.icon}</div>
                                <Text strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{cat.title}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* FAQ Results */}
                <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }} bodyStyle={{ padding: '40px' }}>
                    <Title level={3} style={{ fontWeight: 800, marginBottom: '24px', color: '#0f172a' }}>
                        {searchQuery ? 'Hasil Pencarian' : 'Pertanyaan Sering Diajukan'}
                    </Title>

                    {faqsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spin size="large" tip="Memuat pertanyaan..." />
                        </div>
                    ) : filteredFaqs.length > 0 ? (
                        <Collapse 
                            accordion 
                            ghost 
                            expandIconPosition="end"
                            expandIcon={({ isActive }) => <QuestionCircleOutlined style={{ fontSize: '18px', color: isActive ? '#1677ff' : '#cbd5e1' }} />}
                        >
                            {filteredFaqs.map((faq) => (
                                <Panel 
                                    header={<Text style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{faq.question}</Text>} 
                                    key={faq.id}
                                    style={{ marginBottom: '12px', border: '1px solid #f1f5f9', borderRadius: '16px', background: '#ffffff', padding: '8px 12px' }}
                                >
                                    <Paragraph style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                                        {faq.answer}
                                    </Paragraph>
                                </Panel>
                            ))}
                        </Collapse>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Tidak ada jawaban yang cocok dengan pencarian Anda.</Text>
                            <Button type="primary" onClick={() => setSearchQuery('')} style={{ borderRadius: '8px' }}>Reset Pencarian</Button>
                        </div>
                    )}
                </Card>

                {/* Contact Support CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', borderRadius: '24px', background: 'linear-gradient(135deg, #1677ff 0%, #0050b3 100%)', color: '#ffffff' }}>
                    <MessageOutlined style={{ fontSize: '40px', marginBottom: '20px' }} />
                    <Title level={3} style={{ color: '#ffffff', fontWeight: 800, margin: '0 0 8px 0' }}>Masih butuh bantuan tambahan?</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 24px' }}>
                        Tim Dukungan Pelanggan kami siap melayani Anda untuk menyelesaikan kendala teknis atau pertanyaan lainnya.
                    </Paragraph>
                    <Space size="middle" wrap>
                        <Button 
                            size="large" 
                            icon={<WhatsAppOutlined style={{ color: '#25D366' }} />}
                            style={{ borderRadius: '12px', fontWeight: 700, color: '#25D366', border: '1px solid #25D366', background: '#ffffff', height: '48px', padding: '0 24px' }}
                            onClick={() => window.open(`https://wa.me/${getSetting('contact_whatsapp') || ''}`, '_blank')}
                        >
                            WhatsApp Support
                        </Button>
                        <Button 
                            size="large" 
                            icon={<MailOutlined />}
                            style={{ borderRadius: '12px', fontWeight: 700, color: '#1677ff', border: 'none', background: '#ffffff', height: '48px', padding: '0 24px' }}
                            onClick={() => window.open(`mailto:${getSetting('contact_email') || ''}`, '_blank')}
                        >
                            Email Support
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
