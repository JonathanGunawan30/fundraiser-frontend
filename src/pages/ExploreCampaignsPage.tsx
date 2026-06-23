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
    Empty,
    Button,
    Carousel
} from 'antd';
import { 
    SearchOutlined, 
    AppstoreOutlined, 
    LayoutOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Campaign, PaginatedResponse, CampaignCategory, Banner } from '../types';

const { Title, Text, Paragraph } = Typography;

const ExploreCampaignsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category') || '';
    const initialKeyword = searchParams.get('search') || '';

    // Layout options: 
    // - 'grid-4': 4 columns on desktop (default), 1 on mobile (default)
    // - 'grid-2': 2 columns on desktop, 2 on mobile
    const [layout, setLayout] = useState<'grid-4' | 'grid-2'>('grid-4');
    const [searchKeyword, setSearchKeyword] = useState<string>(initialKeyword);
    const [debouncedKeyword, setDebouncedKeyword] = useState<string>(initialKeyword);
    const [page, setPage] = useState<number>(1);
    const perPage = 8;

    // Update keyword if query parameter changes externally
    useEffect(() => {
        const keywordFromUrl = searchParams.get('search') || '';
        if (keywordFromUrl !== searchKeyword) {
            setSearchKeyword(keywordFromUrl);
        }
    }, [searchParams]);

    // Fetch categories for the filter bar
    const { data: categories } = useQuery<CampaignCategory[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/campaign-categories');
            return response.data.data;
        },
    });

    // Reset page on category filter change
    useEffect(() => {
        setPage(1);
    }, [categoryFilter]);

    // Debounce search input and sync to searchParams
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(searchKeyword);
            setPage(1); // Reset page to 1 when search changes

            // Update URL search parameters
            const nextParams = new URLSearchParams(searchParams);
            if (searchKeyword) {
                nextParams.set('search', searchKeyword);
            } else {
                nextParams.delete('search');
            }
            setSearchParams(nextParams);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchKeyword]);

    // Fetch campaigns
    const { data: campaignResponse, isLoading } = useQuery<PaginatedResponse<Campaign>>({
        queryKey: ['campaigns-explore', debouncedKeyword, page, categoryFilter],
        queryFn: async () => {
            const endpoint = debouncedKeyword ? '/campaigns/search' : '/campaigns';
            const params: Record<string, any> = {
                page,
                per_page: perPage,
            };
            if (debouncedKeyword) {
                params.keyword = debouncedKeyword;
            }
            if (categoryFilter) {
                params.category = categoryFilter;
            }
            const response = await api.get(endpoint, { params });
            return response.data;
        },
    });

    // ponytail: Fetch promotional banners for explore page
    const { data: bannersResponse } = useQuery<PaginatedResponse<Banner>>({
        queryKey: ['banners'],
        queryFn: async () => {
            const response = await api.get('/banners');
            return response.data;
        },
    });
    const banners = bannersResponse?.data || [];

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
                    bordered={false}
                    className="campaign-card"
                    style={{ 
                        background: 'transparent',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    cover={
                        <div className="campaign-card-img-container" style={{ height: layout === 'grid-2' ? 220 : 180, position: 'relative' }}>
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
                    bodyStyle={{ 
                        padding: '16px 4px 8px 4px', 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between' 
                    }}
                    onClick={() => navigate(`/campaigns/${campaign.slug}`)}
                >
                    <div>
                        <Title 
                            level={5} 
                            style={{ 
                                margin: '0 0 10px', 
                                fontSize: layout === 'grid-2' ? 'clamp(0.85rem, 3.2vw, 1.15rem)' : '1.05rem', 
                                fontWeight: 800, 
                                lineHeight: 1.35, 
                                minHeight: '2.8rem', 
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                letterSpacing: '-0.3px'
                            }}
                        >
                            <span className="campaign-card-title">{campaign.title}</span>
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
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.4
                            }}
                        >
                            {campaign.description}
                        </Paragraph>
                    </div>
                    
                    <div>
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
                                <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>Terkumpul</Text>
                                <Text strong style={{ fontSize: '1.15rem', color: '#1677ff' }}>
                                    Rp {new Intl.NumberFormat('id-ID').format(campaign.collected_amount)}
                                </Text>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>Target</Text>
                                <Text strong style={{ fontSize: '0.9rem', color: '#475569' }}>
                                    Rp {new Intl.NumberFormat('id-ID').format(campaign.goal_amount)}
                                </Text>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                            <Text style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                                {campaign.donor_count} Donatur bergabung
                            </Text>
                            <Text strong style={{ fontSize: '0.85rem', color: '#1677ff' }}>{percent}%</Text>
                        </div>
                    </div>
                </Card>
            </Col>
        );
    };

    const handleCategorySelect = (slug: string) => {
        if (slug) {
            setSearchParams({ category: slug });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div style={{ padding: '40px 5%', maxWidth: '1440px', margin: '0 auto', minHeight: '80vh' }}>

            {/* ponytail: Sliding Banner Carousel */}
            {banners && banners.length > 0 && (
                <div style={{ marginBottom: 32, aspectRatio: '2000 / 800', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Carousel autoplay style={{ height: '100%' }}>
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                style={{
                                    cursor: banner.link_url ? 'pointer' : 'default',
                                    display: 'block',
                                    width: '100%',
                                    height: '100%'
                                }}
                                onClick={() => {
                                    if (!banner.link_url) return;
                                    if (banner.link_url.startsWith('http://') || banner.link_url.startsWith('https://')) {
                                        window.open(banner.link_url, '_blank');
                                    } else {
                                        navigate(banner.link_url);
                                    }
                                }}
                            >
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
            )}

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

                <Divider style={{ margin: '16px 0' }} />

                {/* Horizontal scrolling Categories bar */}
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '8px',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }} className="categories-filter-scroll">
                    <Button 
                        type={categoryFilter === '' ? 'primary' : 'default'}
                        onClick={() => handleCategorySelect('')}
                        style={{ borderRadius: 20, fontWeight: 500 }}
                    >
                        Semua Kategori
                    </Button>
                    {categories?.map((cat) => (
                        <Button 
                            key={cat.id}
                            type={categoryFilter === cat.slug ? 'primary' : 'default'}
                            onClick={() => handleCategorySelect(cat.slug)}
                            style={{ borderRadius: 20, fontWeight: 500 }}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>
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
