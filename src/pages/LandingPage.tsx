import React, { useRef, useState } from 'react';
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
    CheckCircleFilled,
    AppstoreOutlined,
    LeftOutlined,
    RightOutlined,
    MailOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

import type {Campaign, Faq, SiteSetting, CampaignCategory} from '../types';
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
    const [showAllCategories, setShowAllCategories] = useState(false);
    const categoriesScrollRef = useRef<HTMLDivElement>(null);

    const handleScrollCategories = (direction: 'left' | 'right') => {
        if (categoriesScrollRef.current) {
            const { scrollLeft } = categoriesScrollRef.current;
            const scrollAmount = direction === 'left' ? -360 : 360;
            categoriesScrollRef.current.scrollTo({
                left: scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const { data: categories, isLoading: categoriesLoading } = useQuery<CampaignCategory[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/campaign-categories');
            return response.data.data;
        },
    });

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
                padding: '100px 5% 120px', 
                background: '#ffffff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background glows */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, rgba(255, 255, 255, 0) 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
                
                <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <Row gutter={[64, 48]} align="middle">
                        {/* Left Content Column */}
                        <Col xs={24} lg={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Space direction="vertical" size={32} style={{ display: 'flex' }}>
                                <div style={{ display: 'inline-flex' }}>
                                    <Tag color="blue" style={{ 
                                        borderRadius: '30px', 
                                        padding: '6px 20px', 
                                        fontWeight: 700, 
                                        border: '1px solid rgba(22, 119, 255, 0.12)', 
                                        background: 'rgba(22, 119, 255, 0.04)', 
                                        color: '#1677ff', 
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <HeartFilled style={{ color: '#ff4d4f' }} /> Bersama, kita bisa membuat perubahan
                                    </Tag>
                                </div>

                                <Title level={1} style={{ 
                                    fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', 
                                    fontWeight: 900,
                                    color: '#0f172a',
                                    lineHeight: 1.1,
                                    letterSpacing: '-2.5px',
                                    marginBottom: 0
                                }}>
                                    Dukung ide.<br />Bantu wujudkan <span style={{ 
                                        background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)', 
                                        WebkitBackgroundClip: 'text', 
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    }}>perubahan.</span>
                                </Title>

                                <Paragraph style={{ fontSize: '1.2rem', color: '#475569', maxWidth: 520, marginBottom: 0, lineHeight: 1.65 }}>
                                    Fundraiser adalah platform crowdfunding modern yang menyatukan orang-orang baik untuk mewujudkan mimpi, menolong sesama, dan berkolaborasi dalam aksi sosial nyata.
                                </Paragraph>

                                <Space size="middle" wrap>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        style={{ 
                                            height: '56px', 
                                            padding: '0 36px', 
                                            fontSize: '1.05rem', 
                                            background: '#1677ff', 
                                            borderRadius: '30px',
                                            fontWeight: 700,
                                            boxShadow: '0 10px 24px -8px rgba(22, 119, 255, 0.4)',
                                            border: 'none'
                                        }}
                                        onClick={() => navigate('/campaigns')}
                                    >
                                        Jelajahi Campaign
                                    </Button>
                                    <Button 
                                        size="large" 
                                        icon={<PlayCircleOutlined style={{ color: '#1677ff' }} />}
                                        style={{ 
                                            height: '56px', 
                                            padding: '0 32px', 
                                            fontSize: '1.05rem', 
                                            fontWeight: 700, 
                                            borderRadius: '30px',
                                            border: '1px solid #cbd5e1',
                                            background: 'transparent'
                                        }}
                                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Cara Kerja
                                    </Button>
                                </Space>

                                <Space size="middle" align="center" style={{ marginTop: '12px' }}>
                                    <Avatar.Group
                                        maxCount={4}
                                        size={44}
                                        maxStyle={{ backgroundColor: '#1677ff', color: '#fff', border: '3px solid #fff' }}
                                    >
                                        <Avatar src={p1} style={{ border: '3px solid #fff' }} />
                                        <Avatar src={p2} style={{ border: '3px solid #fff' }} />
                                        <Avatar src={p3} style={{ border: '3px solid #fff' }} />
                                        <Avatar src={p4} style={{ border: '3px solid #fff' }} />
                                    </Avatar.Group>
                                    <div style={{ marginLeft: 8 }}>
                                        <Text style={{ display: 'block', fontSize: '0.95rem', color: '#475569' }}>
                                            Bergabung dengan <Text strong style={{ color: '#0f172a' }}>10.000+ orang baik</Text>
                                        </Text>
                                        <Text style={{ fontSize: '0.9rem', color: '#64748b' }}>& mulai berdampak positif hari ini.</Text>
                                    </div>
                                </Space>
                            </Space>
                        </Col>

                        {/* Right Decorative Column */}
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

            {/* Categories Section */}
            <section style={{ 
                padding: '100px 5% 80px', 
                background: '#f8fafc',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Ambient background glow decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(22, 119, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <Row gutter={[48, 32]} align="middle">
                        {/* Left Column: Context & Heading */}
                        <Col xs={24} lg={8}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <Tag color="blue" style={{ 
                                        borderRadius: '30px', 
                                        padding: '4px 16px', 
                                        fontSize: '0.85rem', 
                                        fontWeight: 600,
                                        border: '1px solid rgba(22, 119, 255, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span style={{ 
                                            width: '6px', 
                                            height: '6px', 
                                            borderRadius: '50%', 
                                            backgroundColor: '#1677ff',
                                            display: 'inline-block'
                                        }} />
                                        Kategori Pilihan
                                    </Tag>
                                </div>
                                
                                <Title level={2} style={{ 
                                    margin: 0, 
                                    fontSize: '2.5rem', 
                                    fontWeight: 900, 
                                    color: '#0f172a', 
                                    letterSpacing: '-1.5px',
                                    lineHeight: 1.15
                                }}>
                                    Salurkan Kebaikan Sesuai Minat Anda
                                </Title>
                                
                                <Paragraph type="secondary" style={{ 
                                    fontSize: '1.05rem', 
                                    color: '#64748b', 
                                    lineHeight: 1.6,
                                    margin: '8px 0 16px 0'
                                }}>
                                    Setiap kontribusi Anda menghidupkan harapan baru. Pilih kategori penggalangan dana yang paling sesuai dengan kepedulian Anda untuk mulai berbagi hari ini.
                                </Paragraph>

                                {/* Decorative Stats Badge */}
                                <Card style={{
                                    borderRadius: '16px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    border: '1px solid rgba(241, 245, 249, 0.8)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
                                }} bodyStyle={{ padding: '16px 20px' }}>
                                    <Space size="large">
                                        <div>
                                            <Title level={4} style={{ margin: 0, color: '#1677ff', fontWeight: 800, fontSize: '1.5rem' }}>{categories?.length || 0}</Title>
                                            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Kategori Aktif</Text>
                                        </div>
                                        <Divider type="vertical" style={{ height: '30px', borderColor: '#cbd5e1' }} />
                                        <div>
                                            <Title level={4} style={{ margin: 0, color: '#10b981', fontWeight: 800, fontSize: '1.5rem' }}>15k+</Title>
                                            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Donatur Terdaftar</Text>
                                        </div>
                                    </Space>
                                </Card>
                            </div>
                        </Col>

                        {/* Right Column: Grid Categories */}
                        <Col xs={24} lg={16}>
                            {categoriesLoading ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}><Spin size="large" /></div>
                            ) : (
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                                    gap: '16px',
                                    width: '100%'
                                }}>
                                    {(showAllCategories ? categories : categories?.slice(0, 8))?.map((cat) => (
                                        <Card
                                            key={cat.id}
                                            bordered={false}
                                            className="category-card"
                                            style={{ 
                                                borderRadius: '24px', 
                                                cursor: 'pointer',
                                                height: '100%',
                                                textAlign: 'center'
                                            }}
                                            bodyStyle={{ 
                                                padding: '28px 16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%'
                                            }}
                                            onClick={() => navigate(`/campaigns?category=${cat.slug}`)}
                                        >
                                            <div 
                                                className="category-icon-wrapper"
                                                style={{ 
                                                    fontSize: '1.8rem', 
                                                    color: '#1677ff', 
                                                    marginBottom: 16,
                                                    background: '#f0f7ff',
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '18px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {cat.icon_url ? (
                                                    <img 
                                                        src={cat.icon_url} 
                                                        alt={cat.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                ) : (
                                                    <AppstoreOutlined />
                                                )}
                                            </div>
                                            <Text strong className="category-card-text" style={{ 
                                                fontSize: '0.9rem', 
                                                color: '#1e293b',
                                                lineHeight: 1.35,
                                                textAlign: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                wordBreak: 'break-word',
                                                whiteSpace: 'normal',
                                                transition: 'color 0.3s ease'
                                            }}>
                                                {cat.name}
                                            </Text>
                                        </Card>
                                    ))}
                                    {categories && categories.length > 8 && (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '12px' }}>
                                            <Button 
                                                type="link" 
                                                onClick={() => setShowAllCategories(!showAllCategories)}
                                                style={{ fontWeight: 600, color: '#1677ff' }}
                                            >
                                                {showAllCategories ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Kategori (${categories.length})`}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Featured Campaigns Section */}
            <section style={{ padding: '100px 5%', background: '#ffffff' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                        <div>
                            <Tag color="blue" style={{ marginBottom: 12, borderRadius: '20px', padding: '2px 12px', fontWeight: 600 }}>CAMPAIGN PILIHAN</Tag>
                            <Title level={2} style={{ margin: 0, fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Campaign Populer</Title>
                        </div>
                        <Link to="/campaigns" style={{ color: '#1677ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem' }}>
                            Lihat semua <ArrowRightOutlined style={{ fontSize: 14 }} />
                        </Link>
                    </div>
                    
                    <Row gutter={[24, 32]}>
                        {campaignsLoading ? (
                            [1,2,3,4].map(i => (
                                <Col xs={24} sm={12} lg={6} key={i}>
                                    <Card loading bordered={false} style={{ borderRadius: 24 }} />
                                </Col>
                            ))
                        ) : campaigns?.map((campaign: Campaign) => {
                            const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                            const percent = Math.round((campaign.collected_amount / campaign.goal_amount) * 100);
                            return (
                                <Col xs={24} sm={12} lg={6} key={campaign.id}>
                                    <Card
                                        bordered={false}
                                        className="campaign-card"
                                        style={{ background: 'transparent', height: '100%' }}
                                        cover={
                                            <div className="campaign-card-img-container" style={{ height: 220, position: 'relative' }}>
                                                <img 
                                                    alt={campaign.title} 
                                                    src={campaign.cover_image_url} 
                                                    className="campaign-card-img"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                                {/* Floating Category Badge */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '16px',
                                                    left: '16px',
                                                    background: 'rgba(15, 23, 42, 0.75)',
                                                    backdropFilter: 'blur(8px)',
                                                    color: '#ffffff',
                                                    padding: '6px 14px',
                                                    borderRadius: '30px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {campaign.category?.name || 'Umum'}
                                                </div>
                                                {/* Floating Days Left Badge */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '16px',
                                                    right: '16px',
                                                    background: 'rgba(255, 255, 255, 0.92)',
                                                    backdropFilter: 'blur(4px)',
                                                    color: '#0f172a',
                                                    padding: '6px 12px',
                                                    borderRadius: '30px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700
                                                }}>
                                                    {daysLeft} Hari Lagi
                                                </div>
                                            </div>
                                        }
                                        bodyStyle={{ padding: '20px 4px 8px 4px' }}
                                        onClick={() => navigate(`/campaigns/${campaign.slug}`)}
                                    >
                                        <Title 
                                            level={5} 
                                            style={{ 
                                                margin: '0 0 16px', 
                                                fontSize: '1.15rem', 
                                                fontWeight: 850, 
                                                lineHeight: 1.35, 
                                                height: '3.1rem', 
                                                overflow: 'hidden',
                                                letterSpacing: '-0.3px'
                                            }}
                                        >
                                            <span className="campaign-card-title">{campaign.title}</span>
                                        </Title>
                                        
                                        <div style={{ marginBottom: 12 }}>
                                            <Progress 
                                                percent={percent} 
                                                strokeColor={{
                                                    '0%': '#1677ff',
                                                    '100%': '#0050b3'
                                                }}
                                                showInfo={false} 
                                                strokeWidth={5} 
                                                style={{ margin: 0 }}
                                            />
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                                            <div>
                                                <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 2 }}>Terkumpul</Text>
                                                <Text strong style={{ fontSize: '1.2rem', color: '#1677ff' }}>
                                                    Rp {new Intl.NumberFormat('id-ID').format(campaign.collected_amount)}
                                                </Text>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 2 }}>Target</Text>
                                                <Text strong style={{ fontSize: '0.95rem', color: '#475569' }}>
                                                    Rp {new Intl.NumberFormat('id-ID').format(campaign.goal_amount)}
                                                </Text>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                                            <Text style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                                {campaign.donor_count} Donatur bergabung
                                            </Text>
                                            <Text strong style={{ fontSize: '0.9rem', color: '#1677ff' }}>{percent}%</Text>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
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
            <section id="how-it-works" style={{ padding: '100px 5%', background: '#fff' }}>
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
            <section style={{ padding: '100px 5%', background: '#f8fafc' }}>
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
                        <Space size="middle" wrap>
                            <Button 
                                icon={<WhatsAppOutlined style={{ color: '#25D366' }} />} 
                                style={{ background: '#ffffff', color: '#25D366', border: '1px solid #25D366', height: 48, padding: '0 32px', borderRadius: 12, fontWeight: 700 }}
                                onClick={() => window.open(`https://wa.me/${getSetting('contact_whatsapp') || ''}`, '_blank')}
                            >
                                WhatsApp Support
                            </Button>
                            <Button 
                                icon={<MailOutlined style={{ color: '#1677ff' }} />} 
                                style={{ background: '#ffffff', color: '#1677ff', border: '1px solid #1677ff', height: 48, padding: '0 32px', borderRadius: 12, fontWeight: 700 }}
                                onClick={() => window.open(`mailto:${getSetting('contact_email') || ''}`, '_blank')}
                            >
                                Email Support
                            </Button>
                        </Space>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
