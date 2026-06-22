import React, { useState } from 'react';
import { Typography, Card, Table, Tag, Space, Button, Tooltip, Modal, Descriptions, Divider } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
    EyeOutlined,
    FilePdfOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import type { Donation, PaginatedResponse } from '../types';

const { Title, Text, Paragraph } = Typography;

const MyDonationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useQuery<PaginatedResponse<Donation>>({
        queryKey: ['my-donations', page],
        queryFn: async () => {
            const response = await api.get('/auth/donations', { params: { page, per_page: 10 } });
            return response.data;
        },
    });

    const showDetail = (donation: Donation) => {
        setSelectedDonation(donation);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'No. Donasi',
            dataIndex: 'donation_number',
            key: 'donation_number',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
            render: (campaign: any) => (
                <Text ellipsis={{ tooltip: campaign?.title }} style={{ maxWidth: 250 }}>
                    {campaign?.title}
                </Text>
            ),
        },
        {
            title: 'Jumlah',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let icon = null;

                if (status === 'pending') {
                    color = 'warning';
                    icon = <ClockCircleOutlined />;
                } else if (status === 'success') {
                    color = 'success';
                    icon = <CheckCircleOutlined />;
                } else if (status === 'failed') {
                    color = 'error';
                    icon = <CloseCircleOutlined />;
                }

                return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Aksi',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: Donation) => (
                <Space size="middle">
                    <Tooltip title="Detail Donasi">
                        <Button 
                            type="text" 
                            icon={<InfoCircleOutlined />} 
                            onClick={(e) => {
                                e.stopPropagation();
                                showDetail(record);
                            }}
                        />
                    </Tooltip>
                    {record.status === 'success' && record.invoice_url && (
                        <Tooltip title="Download Invoice">
                            <Button 
                                type="text" 
                                icon={<FilePdfOutlined style={{ color: '#ef4444' }} />} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(record.invoice_url, '_blank');
                                }}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Riwayat Donasi Saya</Title>
                <Text type="secondary">Daftar kontribusi kebaikan yang telah Anda berikan.</Text>
            </div>

            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Table 
                    columns={columns} 
                    dataSource={data?.data} 
                    rowKey="id" 
                    loading={isLoading}
                    pagination={{
                        total: data?.meta.total,
                        pageSize: data?.meta.per_page,
                        current: data?.meta.current_page,
                        onChange: (p) => setPage(p),
                    }}
                    scroll={{ x: true }}
                    onRow={(record) => ({
                        onClick: () => showDetail(record),
                        style: { cursor: 'pointer' }
                    })}
                />
            </Card>

            <Modal
                title={<Title level={4}>Detail Donasi</Title>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <div key="footer" style={{ 
                        display: 'flex', 
                        flexDirection: window.innerWidth < 576 ? 'column' : 'row', 
                        gap: '8px', 
                        justifyContent: 'flex-end' 
                    }}>
                        <Button 
                            key="close" 
                            onClick={() => setIsModalOpen(false)}
                            style={{ width: window.innerWidth < 576 ? '100%' : 'auto' }}
                        >
                            Tutup
                        </Button>
                        {selectedDonation?.status === 'success' && selectedDonation.invoice_url && (
                            <Button 
                                key="invoice" 
                                type="primary" 
                                danger 
                                icon={<FilePdfOutlined />}
                                onClick={() => window.open(selectedDonation.invoice_url, '_blank')}
                                style={{ width: window.innerWidth < 576 ? '100%' : 'auto' }}
                            >
                                Download Invoice
                            </Button>
                        )}
                        <Button 
                            key="campaign" 
                            type="primary" 
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/campaigns/${selectedDonation?.campaign?.slug}`)}
                            style={{ width: window.innerWidth < 576 ? '100%' : 'auto' }}
                        >
                            Lihat Campaign
                        </Button>
                    </div>
                ]}
                width={600}
            >
                {selectedDonation && (
                    <div style={{ marginTop: 16 }}>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Nomor Donasi">
                                <Text strong>{selectedDonation.donation_number}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Campaign">
                                {selectedDonation.campaign?.title}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nominal">
                                <Text strong style={{ color: '#10b981' }}>
                                    Rp {new Intl.NumberFormat('id-ID').format(selectedDonation.amount)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={
                                    selectedDonation.status === 'success' ? 'success' : 
                                    selectedDonation.status === 'pending' ? 'warning' : 'error'
                                }>
                                    {selectedDonation.status.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Waktu">
                                {new Date(selectedDonation.created_at).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tipe Donasi">
                                {selectedDonation.is_anonymous ? 'Hamba Allah (Anonim)' : 'Publik'}
                            </Descriptions.Item>
                        </Descriptions>
                        
                        {selectedDonation.message && (
                            <>
                                <Divider orientation={"left" as any} plain>Pesan Kebaikan</Divider>
                                <Paragraph italic style={{ padding: '0 12px' }}>
                                    "{selectedDonation.message}"
                                </Paragraph>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyDonationsPage;
