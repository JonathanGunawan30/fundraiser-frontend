import React from 'react';
import { Table, Typography, Tag, Card, Space, Avatar } from 'antd';
import { ClockCircleOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import type { PaginatedResponse } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface AuditLog {
    id: string;
    log_name: string;
    description: string;
    subject_type: string;
    subject_id: number;
    causer: {
        id: number;
        name: string;
        type: string;
    } | null;
    properties: any;
    created_at: string;
}

const AuditLogList: React.FC = () => {
    const { data, isLoading } = useQuery<PaginatedResponse<AuditLog>>({
        queryKey: ['admin-audit-logs'],
        queryFn: async () => {
            const response = await api.get('/admin/audit-logs');
            return response.data;
        },
    });

    const columns = [
        { 
            title: 'Date', 
            dataIndex: 'created_at', 
            key: 'date',
            render: (date: string) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{dayjs(date).format('DD MMM YYYY')}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}><ClockCircleOutlined /> {dayjs(date).format('HH:mm')}</Text>
                </Space>
            )
        },
        { 
            title: 'Actor', 
            dataIndex: ['causer', 'name'], 
            key: 'actor', 
            render: (val: string, record: AuditLog) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: record.causer ? '#4f46e5' : '#94a3b8' }} />
                    <Text>{val || 'System'}</Text>
                </Space>
            ) 
        },
        { 
            title: 'Action', 
            dataIndex: 'description', 
            key: 'action', 
            render: (val: string) => {
                let color = 'blue';
                if (val.includes('created')) color = 'green';
                if (val.includes('updated')) color = 'orange';
                if (val.includes('deleted')) color = 'red';
                return <Tag color={color}>{val.toUpperCase()}</Tag>;
            } 
        },
        { 
            title: 'Target', 
            key: 'target',
            render: (_: any, record: AuditLog) => (
                <Space>
                    <DatabaseOutlined style={{ color: '#64748b' }} />
                    <Text type="secondary">{record.subject_type.split('\\').pop()}</Text>
                    <Tag>#{record.subject_id}</Tag>
                </Space>
            )
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ margin: 0 }}>Audit Logs</Title>
                <Text type="secondary">Track all administrative actions and system changes.</Text>
            </div>

            <Table
                columns={columns}
                dataSource={data?.data}
                loading={isLoading}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) => (
                        <Card title="Change Details" size="small" style={{ background: '#f8fafc' }}>
                            <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(record.properties, null, 2)}
                            </pre>
                        </Card>
                    ),
                }}
                pagination={{
                    total: data?.meta.total,
                    pageSize: data?.meta.per_page,
                    current: data?.meta.current_page,
                    showSizeChanger: true,
                }}
                styles={{ header: { background: '#f8fafc' } }}
            />
        </Space>
    );
};

export default AuditLogList;
