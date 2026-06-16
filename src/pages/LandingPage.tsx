import { Typography, Row, Col, Card, Button, Progress, Tag, Space, Divider, Spin, Collapse, Avatar } from 'antd';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { 
    HeartFilled,
    CalendarOutlined, 
    ArrowRightOutlined,
    TeamOutlined,
    QuestionCircleOutlined,
    WhatsAppOutlined,
    PlayCircleOutlined,
    FileTextOutlined,
    ShareAltOutlined,
    GiftOutlined,
    CheckCircleFilled
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

import type {Campaign, Faq, SiteSetting} from '../types';
import p1 from '../assets/profiles/p1.jpg';
import p2 from '../assets/profiles/p2.jpg';
import p3 from '../assets/profiles/p3.jpg';
import p4 from '../assets/profiles/p4.jpg';
import p5 from '../assets/profiles/p5.jpg';
import p6 from '../assets/profiles/p6.jpg';
import childrenImg from '../assets/contents/children.jpg';
import AnimatedNumber from '../components/AnimatedNumber';
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: campaigns, isLoading: campaignsLoading } = useQuery({
        queryKey: ['campaigns-featured'],
        queryFn: async () => {
            const response = await api.get('/campaigns', { params: { per_page: 4 } });
            return response.data.data;
        },
    });

    const { data: faqs, isLoading: faqsLoading } = useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            const response = await api.get('/faqs');
            return response.data.data;
        },
    });

    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await api.get('/site-settings');
            return response.data.data;
        },
    });

    const getSetting = (key: string) => settings?.find((s: SiteSetting) => s.key === key)?.value;

    return (
        <div style={{ background: '#fff' }}>
            {/* Hero Section */}
            <section style={{ 
                padding: '80px 5%', 
                background: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
                    <Row gutter={[64, 48]} align="stretch">
                        <Col xs={24} lg={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Space direction="vertical" size={32}>
                                <Tag color="blue" style={{ borderRadius: 20, padding: '6px 16px', fontWeight: 600, border: 'none', background: '#f0f7ff', color: '#1677ff', fontSize: '0.85rem' }}>
                                    <HeartFilled style={{ marginRight: 8 }} /> Bersama, kita bisa membuat perubahan
                                </Tag>
                                <Title level={1} style={{ 
                                    fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', 
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    lineHeight: 1.1,
                                    letterSpacing: '-1.8px',
                                    marginBottom: 0
                                }}>
                                    Dukung ide. Bantu wujudkan <span style={{ color: '#1677ff' }}>perubahan.</span>
                                </Title>
                                <Paragraph style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: 500, marginBottom: 0, lineHeight: 1.6 }}>
                                    Fundraiser adalah platform crowdfunding untuk membantu mewujudkan berbagai ide, proyek, dan kebutuhan melalui kekuatan bersama.
                                </Paragraph>
                                <Space size="middle" wrap>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        style={{ 
                                            height: '54px', 
                                            padding: '0 32px', 
                                            fontSize: '1rem', 
                                            background: '#1677ff', 
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                        }}
                                        onClick={() => navigate('/campaigns')}
                                    >
                                        Jelajahi Campaign
                                    </Button>
                                    <Button 
                                        size="large" 
                                        variant="outlined"
                                        icon={<PlayCircleOutlined />}
                                        style={{ height: '54px', padding: '0 32px', fontSize: '1rem', fontWeight: 600, borderRadius: '8px' }}
                                    >
                                        Cara Kerja
                                    </Button>
                                </Space>
                                <Space size="middle" align="center">
                                    <Avatar.Group
                                        maxCount={4}
                                        size={44}
                                        maxStyle={{ backgroundColor: '#1677ff', color: '#fff', border: '3px solid #fff' }}
                                        style={{ marginTop: 4 }}
                                    >
                                        <Avatar src={p1} style={{ border: '3px solid #fff' }} />
                                        <Avatar src={p2} style={{ border: '3px solid #fff' }} />
                                        <Avatar src={p3} style={{ border: '3px solid #fff' }} />
                                        <Avatar src={p4} style={{ border: '3px solid #fff' }} />
                                    </Avatar.Group>
                                    <div style={{ marginLeft: 8 }}>
                                        <Text style={{ display: 'block', fontSize: '0.9rem', color: '#64748b' }}>
                                            Bergabung dengan <Text strong style={{ color: '#0f172a' }}>10.000+ orang baik</Text>
                                        </Text>
                                        <Text style={{ fontSize: '0.9rem', color: '#64748b' }}>& mulai berdampak hari ini.</Text>
                                    </div>
                                </Space>
                            </Space>
                        </Col>
                        <Col xs={24} lg={13} style={{ display: 'flex' }}>
                            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex' }}>
                                <img 
                                    src={childrenImg} 
                                    alt="Anak-anak" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
                                />
                                <Card style={{ 
                                    position: 'absolute', 
                                    bottom: '40px', 
                                    right: '-20px', 
                                    borderRadius: '20px', 
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                    width: '360px',
                                    border: 'none',
                                    zIndex: 2,
                                    padding: '4px'
                                }} bodyStyle={{ padding: '24px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <Title level={5} style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Bantu Pendidikan Anak Desa</Title>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Terkumpul</Text>
                                                <Text strong style={{ color: '#1677ff', fontSize: '1.15rem' }}>Rp 125.000.000</Text>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                                <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dari target</Text>
                                                <Text strong style={{ fontSize: '1.15rem', color: '#64748b' }}>Rp 200.000.000</Text>
                                            </div>
                                        </div>
                                        <Progress percent={62} strokeColor="#1677ff" showInfo={false} strokeWidth={10} style={{ margin: '12px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Space size="small">
                                                <Avatar.Group size="small">
                                                    <Avatar src={p5} />
                                                    <Avatar src={p6} />
                                                </Avatar.Group>
                                                <Text type="secondary" style={{ fontSize: '0.85rem' }}>625 Donatur</Text>
                                            </Space>
                                            <Text strong style={{ color: '#0f172a' }}>62%</Text>
                                        </div>
                                    </Space>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Featured Campaigns Section */}
            <section style={{ padding: '80px 5%', background: '#fff' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <Title level={2} style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Campaign Populer</Title>
                        <Link to="/campaigns" style={{ color: '#1677ff', fontWeight: 600 }}>Lihat semua <ArrowRightOutlined style={{ fontSize: 12 }} /></Link>
                    </div>
                    
                    <Row gutter={[24, 32]}>
                        {campaignsLoading ? (
                            [1,2,3,4].map(i => (
                                <Col xs={24} sm={12} lg={6} key={i}>
                                    <Card loading bordered={false} style={{ borderRadius: 16 }} />
                                </Col>
                            ))
                        ) : campaigns?.map((campaign: Campaign) => (
                            <Col xs={24} sm={12} lg={6} key={campaign.id}>
                                <Card
                                    hoverable
                                    bordered={false}
                                    style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}
                                    cover={<img alt={campaign.title} src={campaign.cover_image_url} style={{ height: 180, objectFit: 'cover' }} />}
                                    bodyStyle={{ padding: 20 }}
                                >
                                    <Tag color="blue" style={{ marginBottom: 12, borderRadius: 4, border: 'none', background: '#f0f7ff', color: '#1677ff', fontWeight: 600 }}>
                                        {campaign.category?.name || 'Kategori'}
                                    </Tag>
                                    <Title level={5} style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, height: '2.8rem', overflow: 'hidden' }}>
                                        {campaign.title}
                                    </Title>
                                    
                                    <div style={{ marginBottom: 12 }}>
                                        <Progress 
                                            percent={Math.round((campaign.collected_amount / campaign.goal_amount) * 100)} 
                                            strokeColor="#1677ff" 
                                            showInfo={false} 
                                            strokeWidth={6} 
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: '#1677ff' }}>Rp {new Intl.NumberFormat('id-ID').format(campaign.collected_amount)}</Text>
                                        </div>
                                        <Text strong>{Math.round((campaign.collected_amount / campaign.goal_amount) * 100)}%</Text>
                                    </div>
                                    
                                    <Divider style={{ margin: '12px 0' }} />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text type="secondary" style={{ fontSize: '0.85rem' }}>{campaign.donor_count} Donatur</Text>
                                        <Text type="secondary" style={{ fontSize: '0.85rem' }}><CalendarOutlined /> 30 hari lagi</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '60px 5%', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto', background: '#fff', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <Space align="start" size="large">
                                <div style={{ width: 48, height: 48, background: '#f0f7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TeamOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                                </div>
                                <div>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                                        <AnimatedNumber end={10000} suffix="+" />
                                    </Title>
                                    <Text type="secondary">Penggalang Dana Aktif</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <Space align="start" size="large">
                                <div style={{ width: 48, height: 48, background: '#f0f7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HeartFilled style={{ fontSize: 24, color: '#1677ff' }} />
                                </div>
                                <div>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                                        <AnimatedNumber end={250000} suffix="+" />
                                    </Title>
                                    <Text type="secondary">Donatur Terdaftar</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <Space align="start" size="large">
                                <div style={{ width: 48, height: 48, background: '#f0f7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <GiftOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                                </div>
                                <div>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                                        Rp <AnimatedNumber end={25} suffix=" Miliar+" />
                                    </Title>
                                    <Text type="secondary">Dana Terkumpul</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <Space align="start" size="large">
                                <div style={{ width: 48, height: 48, background: '#f0f7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircleFilled style={{ fontSize: 24, color: '#1677ff' }} />
                                </div>
                                <div>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                                        <AnimatedNumber end={1200} suffix="+" />
                                    </Title>
                                    <Text type="secondary">Campaign Berhasil</Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* How it Works Section */}
            <section style={{ padding: '100px 5%', background: '#fff' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 80 }}>
                        <Title level={2} style={{ fontSize: '2.2rem', fontWeight: 800 }}>Cara Kerja</Title>
                    </div>
                    <Row gutter={[48, 48]} justify="center">
                        {[
                            { step: 1, title: 'Buat Campaign', desc: 'Buat campaign penggalangan dana dengan mudah dan jelaskan tujuan Anda.', icon: <FileTextOutlined /> },
                            { step: 2, title: 'Bagikan Campaign', desc: 'Bagikan campaign Anda ke teman, keluarga, dan komunitas.', icon: <ShareAltOutlined /> },
                            { step: 3, title: 'Kumpulkan Dukungan', desc: 'Terima dukungan dan donasi dari orang-orang yang peduli.', icon: <TeamOutlined /> },
                            { step: 4, title: 'Wujudkan Perubahan', desc: 'Gunakan dana untuk mewujudkan tujuan dan berikan dampak nyata.', icon: <CheckCircleFilled /> },
                        ].map((item, index) => (
                            <Col key={index} xs={24} sm={12} lg={6}>
                                <div style={{ textAlign: 'center', position: 'relative' }}>
                                    <div style={{ 
                                        width: 100, height: 100, background: '#f0f7ff', borderRadius: '50%', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                                        fontSize: '2.5rem', color: '#1677ff', position: 'relative'
                                    }}>
                                        {item.icon}
                                        <div style={{ 
                                            position: 'absolute', top: 0, left: 0, width: 28, height: 28, 
                                            background: '#1677ff', color: '#fff', borderRadius: '50%', 
                                            fontSize: '0.9rem', fontWeight: 700, display: 'flex', 
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {item.step}
                                        </div>
                                    </div>
                                    <Title level={4} style={{ marginBottom: 12, fontWeight: 700 }}>{item.title}</Title>
                                    <Paragraph type="secondary" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</Paragraph>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '80px 5%', background: '#fcfdfe', marginBottom: '80px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <Tag color="blue" style={{ marginBottom: 16, fontWeight: 600 }}>TANYA JAWAB</Tag>
                        <Title level={2} style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>Punya Pertanyaan?</Title>
                        <Paragraph style={{ color: '#64748b', fontSize: '1.1rem' }}>Temukan jawaban dari pertanyaan yang paling sering diajukan.</Paragraph>
                    </div>

                    {faqsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}><Spin /></div>
                    ) : (
                        <Collapse 
                            accordion 
                            ghost 
                            expandIconPosition="end"
                            style={{ background: 'transparent' }}
                            expandIcon={({ isActive }) => <QuestionCircleOutlined style={{ fontSize: '20px', color: isActive ? '#1677ff' : '#cbd5e1' }} />}
                        >
                            {faqs?.map((faq: Faq) => (
                                <Panel 
                                    header={<Text style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>{faq.question}</Text>} 
                                    key={faq.id}
                                    style={{ marginBottom: 16, border: '1px solid #f1f5f9', borderRadius: 16, background: '#fff', padding: '12px 16px' }}
                                >
                                    <Paragraph style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                                        {faq.answer}
                                    </Paragraph>
                                </Panel>
                            ))}
                        </Collapse>
                    )}
                    
                    <div style={{ textAlign: 'center', marginTop: 64, padding: '32px', borderRadius: 24, background: '#f0f7ff' }}>
                        <Text strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: 16 }}>Belum menemukan jawaban?</Text>
                        <Button 
                            icon={<WhatsAppOutlined />} 
                            style={{ background: '#25D366', color: '#fff', border: 'none', height: 48, padding: '0 32px', borderRadius: 12, fontWeight: 700 }}
                            onClick={() => window.open(`https://wa.me/${getSetting('contact_whatsapp')}`, '_blank')}
                        >
                            Hubungi via WhatsApp
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
