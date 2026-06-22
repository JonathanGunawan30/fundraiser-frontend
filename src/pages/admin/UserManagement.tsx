import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, Avatar, Tooltip } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { User, PaginatedResponse } from '../../types';

const { Title, Text } = Typography;

const UserManagement: React.FC = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<PaginatedResponse<User>>({
        queryKey: ['admin-users', page],
        queryFn: async () => {
            const response = await api.get('/users', { params: { page, per_page: 10 } });
            return response.data;
        },
    });

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: User) => (
                <Space>
                    <Avatar src={record.avatar_url} icon={<UserOutlined />} />
                    <Space direction="vertical" size={0}>
                        <Text strong>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}><MailOutlined /> {record.email}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => text ? <span><PhoneOutlined /> {text}</span> : <Text type="secondary">-</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'error'}>
                    {(status || 'active').toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: User) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button type="text" icon={<UserOutlined style={{ color: '#4f46e5' }} />} />
                    </Tooltip>
                    {record.status !== 'suspended' ? (
                        <Tooltip title="Suspend User">
                            <Button type="text" danger icon={<StopOutlined />} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Activate User">
                            <Button type="text" icon={<CheckCircleOutlined style={{ color: '#059669' }} />} />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ margin: 0 }}>User Management</Title>
                <Text type="secondary">View and manage users registered on the platform.</Text>
            </div>

            <Table
                columns={columns}
                dataSource={data?.data}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    total: data?.meta.total,
                    pageSize: data?.meta.per_page,
                    current: data?.meta.current_page,
                    onChange: (p) => setPage(p),
                }}
                styles={{ header: { background: '#f8fafc' } as any }}
            />
        </Space>
    );
};

export default UserManagement;
