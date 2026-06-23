import React from 'react';
import { 
    Card, 
    Form, 
    Input, 
    Button, 
    Typography, 
    Space, 
    Row, 
    Col, 
    Switch, 
    App, 
    Spin,
    Grid
} from 'antd';
import { 
    SaveOutlined, 
    GlobalOutlined, 
    WhatsAppOutlined, 
    MailOutlined, 
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { getErrorMessages } from '../../lib/utils';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface SiteSetting {
    id: number;
    key: string;
    value: string | null;
    type: 'string' | 'number' | 'boolean' | 'image';
}

const SiteSettings: React.FC = () => {
    const { notification } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    const { data: settings, isLoading } = useQuery({
        queryKey: ['admin-site-settings'],
        queryFn: async () => {
            const response = await api.get('/site-settings', { params: { per_page: 100 } });
            return response.data.data as SiteSetting[];
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (values: any) => {
            const promises = Object.entries(values).map(([key, value]) => {
                const setting = settings?.find(s => s.key === key);
                if (!setting) return Promise.resolve();
                
                let processedValue = value;
                if (setting.type === 'boolean') processedValue = value ? '1' : '0';
                if (setting.type === 'number') processedValue = value?.toString();

                if (setting.type === 'image') return Promise.resolve(); 

                return api.put(`/admin/site-settings/${setting.id}`, {
                    key: setting.key,
                    value: processedValue,
                    type: setting.type
                });
            });

            return Promise.all(promises);
        },
        onSuccess: () => {
            notification.success({
                message: 'Settings Updated',
                description: 'Global site configurations have been saved.',
                placement: 'topRight',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
        },
        onError: (error: any) => {
            notification.error({
                message: 'Update Failed',
                description: getErrorMessages(error)[0],
                placement: 'topRight',
            });
        }
    });

    React.useEffect(() => {
        if (settings) {
            const initialValues: any = {};
            settings.forEach(s => {
                if (s.type === 'boolean') {
                    initialValues[s.key] = s.value === '1';
                } else if (s.type === 'number') {
                    initialValues[s.key] = s.value ? Number(s.value) : 0;
                } else {
                    initialValues[s.key] = s.value;
                }
            });
            form.setFieldsValue(initialValues);
        }
    }, [settings, form]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading settings..." />
            </div>
        );
    }

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="page-header">
                <div>
                    <Title level={2} style={{ margin: 0 }}>Site Settings</Title>
                    <Text type="secondary">Global configurations for your platform's behavior and appearance.</Text>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => updateMutation.mutate(values)}
            >
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Card 
                                title={<Space><GlobalOutlined /> General Settings</Space>} 
                                bordered={false} 
                                className="shadow-sm"
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item name="maintenance_mode" label="Maintenance Mode" valuePropName="checked" extra="When enabled, users will see a maintenance page.">
                                            <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Space>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Card 
                                title={<Space><WhatsAppOutlined /> Contact Information</Space>} 
                                bordered={false} 
                                className="shadow-sm"
                            >
                                <Form.Item name="contact_whatsapp" label="WhatsApp Number">
                                    <Input prefix={<WhatsAppOutlined />} placeholder="0812..." />
                                </Form.Item>
                                <Form.Item name="contact_email" label="Support Email">
                                    <Input prefix={<MailOutlined />} placeholder="support@example.com" />
                                </Form.Item>
                            </Card>

                            <Card title={<Space><SafetyCertificateOutlined /> Security</Space>} bordered={false} className="shadow-sm">
                                <Paragraph type="secondary" style={{ fontSize: 13 }}>
                                    Settings here affect global system behavior. Change with caution.
                                </Paragraph>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    icon={<SaveOutlined />} 
                                    block 
                                    size="large"
                                    loading={updateMutation.isPending}
                                    style={{ background: '#1677ff' }}
                                >
                                    Save All Settings
                                </Button>
                            </Card>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Space>
    );
};

export default SiteSettings;
