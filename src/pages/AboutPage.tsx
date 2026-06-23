import React from 'react';
import { Typography, Row, Col, Card, Space, Tag, Avatar } from 'antd';
import { HeartFilled, TeamOutlined, TrophyOutlined, CompassOutlined } from '@ant-design/icons';
import p1 from '../assets/profiles/p1.jpg';
import p2 from '../assets/profiles/p2.jpg';
import p3 from '../assets/profiles/p3.jpg';
import p4 from '../assets/profiles/p4.jpg';

const { Title, Text, Paragraph } = Typography;

const AboutPage: React.FC = () => {
    return (
        <div style={{ background: '#fff' }}>
            {/* Hero Section */}
            <section style={{ 
                padding: '120px 5% 100px', 
                background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(22, 119, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
                
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Tag color="blue" style={{ 
                        borderRadius: '30px', 
                        padding: '6px 20px', 
                        fontWeight: 700, 
                        border: '1px solid rgba(22, 119, 255, 0.12)', 
                        background: 'rgba(22, 119, 255, 0.04)', 
                        color: '#1677ff', 
                        fontSize: '0.85rem',
                        marginBottom: '24px'
                    }}>
                        Tentang FundRaiser
                    </Tag>
                    
                    <Title level={1} style={{ 
                        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
                        fontWeight: 900,
                        color: '#0f172a',
                        lineHeight: 1.15,
                        letterSpacing: '-2px',
                        marginBottom: '24px'
                    }}>
                        Menghubungkan Orang Baik,<br />
                        <span style={{ 
                            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>Wujudkan Perubahan Nyata.</span>
                    </Title>
                    
                    <Paragraph style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '800px', margin: '0 auto 48px', lineHeight: 1.7 }}>
                        FundRaiser hadir sebagai jembatan kebaikan yang transparan, tepercaya, dan efisien. Kami percaya bahwa setiap perubahan besar dimulai dari tindakan kecil yang dilakukan secara bersama-sama.
                    </Paragraph>
                </div>
            </section>

            {/* Vision and Mission Section */}
            <section style={{ padding: '80px 5%', background: '#f8fafc' }}>
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                    <Row gutter={[48, 48]} align="stretch">
                        <Col xs={24} md={12}>
                            <Card style={{ height: '100%', borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '40px' }}>
                                <div style={{ width: '60px', height: '60px', background: '#f0f7ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
                                    <CompassOutlined style={{ fontSize: '28px', color: '#1677ff' }} />
                                </div>
                                <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Visi Kami</Title>
                                <Paragraph style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7 }}>
                                    Menjadi platform crowdfunding terdepan dan paling tepercaya di Indonesia yang mampu menggerakkan solidaritas digital untuk mengatasi berbagai tantangan sosial, kemainan, dan pembangunan.
                                </Paragraph>
                            </Card>
                        </Col>
                        
                        <Col xs={24} md={12}>
                            <Card style={{ height: '100%', borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '40px' }}>
                                <div style={{ width: '60px', height: '60px', background: '#f0f7ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
                                    <HeartFilled style={{ fontSize: '26px', color: '#1677ff' }} />
                                </div>
                                <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Misi Kami</Title>
                                <ul style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                                    <li>Menyediakan platform penggalangan dana yang aman, mudah, dan transparan bagi semua orang.</li>
                                    <li>Memfasilitasi kolaborasi sinergis antara donatur, penggalang dana, dan mitra komunitas.</li>
                                    <li>Mendukung pemanfaatan teknologi untuk mempercepat penyaluran bantuan kepada yang membutuhkan.</li>
                                </ul>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Core Values Section */}
            <section style={{ padding: '100px 5%', background: '#ffffff' }}>
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <Title level={2} style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>Nilai Utama Kami</Title>
                        <Paragraph style={{ color: '#64748b', fontSize: '1.1rem' }}>Prinsip yang memandu setiap langkah kami dalam melayani kebaikan.</Paragraph>
                    </div>
                    
                    <Row gutter={[32, 32]}>
                        {[
                            { 
                                icon: <TrophyOutlined style={{ fontSize: '24px', color: '#1677ff' }} />, 
                                title: 'Integritas & Transparansi', 
                                desc: 'Setiap donasi yang masuk dicatat dengan jelas dan penyaluran dana dapat dipantau secara langsung oleh publik.' 
                            },
                            { 
                                icon: <TeamOutlined style={{ fontSize: '24px', color: '#1677ff' }} />, 
                                title: 'Kolaborasi Positif', 
                                desc: 'Kami percaya sinergi antar pihak menghasilkan dampak yang jauh lebih besar dibandingkan berjuang sendirian.' 
                            },
                            { 
                                icon: <HeartFilled style={{ fontSize: '24px', color: '#1677ff' }} />, 
                                title: 'Kepedulian Sosial', 
                                desc: 'Fokus kami adalah kemanusiaan, membantu sesama tanpa membedakan latar belakang untuk masa depan yang lebih baik.' 
                            }
                        ].map((value, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card style={{ height: '100%', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#fff' }} bodyStyle={{ padding: '32px' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#f0f7ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                        {value.icon}
                                    </div>
                                    <Title level={4} style={{ fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{value.title}</Title>
                                    <Paragraph style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                                        {value.desc}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* Team Section */}
            <section style={{ padding: '100px 5%', background: '#f8fafc' }}>
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <Title level={2} style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>Tim Kami</Title>
                        <Paragraph style={{ color: '#64748b', fontSize: '1.1rem' }}>Orang-orang di balik layar yang berdedikasi membangun ekosistem kebaikan.</Paragraph>
                    </div>
                    
                    <Row gutter={[32, 32]} justify="center">
                        {[
                            { name: 'Rian Wijaya', role: 'Founder & CEO', avatar: p1 },
                            { name: 'Siti Rahma', role: 'Chief Operating Officer', avatar: p2 },
                            { name: 'Budi Santoso', role: 'Chief Technology Officer', avatar: p3 },
                            { name: 'Diana Lestari', role: 'Head of Community Engagement', avatar: p4 }
                        ].map((member, idx) => (
                            <Col xs={12} sm={8} md={6} key={idx}>
                                <div style={{ textAlign: 'center' }}>
                                    <Avatar src={member.avatar} size={120} style={{ marginBottom: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }} />
                                    <Title level={4} style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700 }}>{member.name}</Title>
                                    <Text style={{ color: '#64748b', fontSize: '0.9rem' }}>{member.role}</Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
