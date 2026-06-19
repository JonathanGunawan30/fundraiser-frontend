import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Row, 
    Col, 
    Card, 
    Progress, 
    Tag, 
    Divider, 
    Spin, 
    Input, 
    Segmented, 
    Pagination, 
    Empty 
} from 'antd';
import { 
    SearchOutlined, 
    AppstoreOutlined, 
    LayoutOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Campaign, PaginatedResponse } from '../types';

const { Title, Text, Paragraph } = Typography;

const ExploreCampaignsPage: React.FC = () => {
    const navigate = useNavigate();
    // Layout options: 
    // - 'grid-4': 4 columns on desktop (default), 1 on mobile (default)
    // - 'grid-2': 2 columns on desktop, 2 on mobile
    const [layout, setLayout] = useState<'grid-4' | 'grid-2'>('grid-4');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const perPage = 8;

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(searchKeyword);
            setPage(1); // Reset page to 1 when search changes
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchKeyword]);

    // Fetch campaigns
    const { data: campaignResponse, isLoading } = useQuery<PaginatedResponse<Campaign>>({
        queryKey: ['campaigns-explore', debouncedKeyword, page],
        queryFn: async () => {
            const endpoint = debouncedKeyword ? '/campaigns/search' : '/campaigns';
            const params: Record<string, any> = {
                page,
                per_page: perPage,
            };
            if (debouncedKeyword) {
                params.keyword = debouncedKeyword;
            }
            const response = await api.get(endpoint, { params });
            return response.data;
        },
    });

    const campaigns = campaignResponse?.data || [];
    const totalCampaigns = campaignResponse?.meta?.total || 0;

    const renderGridItem = (campaign: Campaign) => {
        const percent = Math.min(Math.round((campaign.collected_amount / campaign.goal_amount) * 100), 100);
        const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

        // Determine spans based on layout selection
        // 'grid-4' -> xs={24} (1 col), sm={12} (2 col), lg={6} (4 col)
        // 'grid-2' -> xs={12} (2 col), sm={12} (2 col), lg={12} (2 col)
        const gridSpans = layout === 'grid-4' 
            ? { xs: 24, sm: 12, md: 12, lg: 6 } 
            : { xs: 12, sm: 12, md: 12, lg: 12 };

        return (
            <Col {...gridSpans} key={campaign.id}>
                <Card
                    hoverable
                    bordered={false}
                    style={{ 
                        borderRadius: 16, 
                        overflow: 'hidden', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    cover={
                        <img 
                            alt={campaign.title} 
                            src={campaign.cover_image_url} 
                            style={{ 
                                height: layout === 'grid-2' ? 220 : 180, 
                                objectFit: 'cover' 
                            }} 
                        />
                    }
                    bodyStyle={{ 
                        padding: layout === 'grid-2' ? 20 : 16, 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between' 
                    }}
                    onClick={() => navigate(`/campaigns/${campaign.slug}`)}
                >
                    <div>
                        <Tag 
                            color="blue" 
                            style={{ 
                                marginBottom: 12, 
                                borderRadius: 4, 
                                border: 'none', 
                                background: '#f0f7ff', 
                                color: '#1677ff', 
                                fontWeight: 600 
                            }}
                        >
                            {campaign.category?.name || 'Kategori'}
                        </Tag>
                        <Title 
                            level={5} 
                            style={{ 
                                margin: '0 0 12px', 
                                // ponytail: dynamic responsive size for layout-2 to prevent truncation on mobile (xs={12})
                                fontSize: layout === 'grid-2' ? 'clamp(0.85rem, 3.2vw, 1.15rem)' : '0.95rem', 
                                fontWeight: 700, 
                                lineHeight: 1.4, 
                                minHeight: '2.8rem', 
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {campaign.title}
                        </Title>
                        <Paragraph 
                            type="secondary" 
                            style={{ 
                                fontSize: '0.85rem', 
                                marginBottom: 16, 
                                height: '2.4rem', 
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {campaign.description}
                        </Paragraph>
                    </div>
                    
                    <div>
                        <div style={{ marginBottom: 8 }}>
                            <Progress 
                                percent={percent} 
                                strokeColor="#1677ff" 
                                showInfo={false} 
                                strokeWidth={6} 
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                            <Text strong style={{ color: '#1677ff', fontSize: '0.95rem' }}>
                                Rp {new Intl.NumberFormat('id-ID').format(campaign.collected_amount)}
                            </Text>
                            <Text strong style={{ fontSize: '0.9rem' }}>{percent}%</Text>
                        </div>
                        
                        <Divider style={{ margin: '12px 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '0.8rem' }}>{campaign.donor_count} Donatur</Text>
                            <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                <ClockCircleOutlined /> {daysLeft} Hari lagi
                            </Text>
                        </div>
                    </div>
                </Card>
            </Col>
        );
    };

    return (
        <div style={{ padding: '40px 5%', maxWidth: '1440px', margin: '0 auto', minHeight: '80vh' }}>
            {/* Header section */}
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <Title level={2} style={{ fontWeight: 800, fontSize: '2.2rem', margin: '0 0 8px' }}>
                    Jelajahi <span style={{ color: '#1677ff' }}>Campaign</span>
                </Title>
                <Text type="secondary" style={{ fontSize: '1.05rem' }}>
                    Temukan dan dukung aksi kebaikan yang dapat merubah dunia di sekitar kita.
                </Text>
            </div>

            {/* Filter and layout controls */}
            <Card 
                bordered={false} 
                style={{ 
                    borderRadius: 16, 
                    marginBottom: 32, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
                }}
            >
                <Row gutter={[16, 16]} justify="space-between" align="middle">
                    {/* ponytail: shorter search bar on desktop using lg={8} instead of lg={18} */}
                    <Col xs={24} md={12} lg={8}>
                        <Input
                            placeholder="Cari campaign berdasarkan judul..."
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            size="large"
                            allowClear
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </Col>
                    <Col xs={24} md={12} lg={16} style={{ textAlign: 'right' }}>
                        <Segmented
                            value={layout}
                            onChange={(value) => setLayout(value as 'grid-4' | 'grid-2')}
                            options={[
                                { value: 'grid-4', icon: <AppstoreOutlined /> },
                                { value: 'grid-2', icon: <LayoutOutlined /> }
                            ]}
                            style={{ borderRadius: 8 }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Campaigns representation */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Spin size="large" tip="Memuat daftar campaign..." />
                </div>
            ) : campaigns.length > 0 ? (
                <div>
                    <Row gutter={[24, 24]}>
                        {campaigns.map(campaign => renderGridItem(campaign))}
                    </Row>
                    
                    {totalCampaigns > perPage && (
                        <div style={{ textAlign: 'center', marginTop: 48 }}>
                            <Pagination
                                current={page}
                                total={totalCampaigns}
                                pageSize={perPage}
                                onChange={(p) => setPage(p)}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: '60px 0' }}>
                    <Empty 
                        description="Tidak ada campaign aktif yang sesuai dengan kriteria pencarian Anda." 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </div>
            )}
        </div>
    );
};

export default ExploreCampaignsPage;
