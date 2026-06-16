import { Card, Typography, Space, Button } from 'antd';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const handleSocialLogin = (provider: string) => {
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        window.location.href = `${baseUrl}/auth/user/${provider}/redirect`;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card style={{ width: 400, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12 }}>
                <div style={{ marginBottom: 24 }}>
                    <img src="/logo/fundraiser-logo-nt.png" alt="Logo" style={{ height: 64 }} />
                </div>
                <Title level={2} style={{ marginBottom: 8 }}>Welcome to FundRaiser</Title>
                <Text type="secondary">Sign in to start helping others</Text>
                
                <Space direction="vertical" style={{ width: '100%', marginTop: 32 }} size="middle">
                    <Button 
                        icon={<GoogleOutlined />} 
                        block 
                        size="large" 
                        onClick={() => handleSocialLogin('google')}
                        style={{ height: 48, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Continue with Google
                    </Button>

                    <Button 
                        icon={<GithubOutlined />} 
                        block 
                        size="large" 
                        onClick={() => handleSocialLogin('github')}
                        style={{ height: 48, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#24292e', color: 'white' }}
                    >
                        Continue with GitHub
                    </Button>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                        By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </Text>
                </Space>

            </Card>
        </div>
    );
};

export default LoginPage;
