import React, { useState, useEffect, useMemo } from 'react';
import {
    TeamOutlined,
    UserOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    PictureOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellOutlined,
    DashboardOutlined,
    AppstoreOutlined,
    SafetyCertificateOutlined,
    BankOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Typography, ConfigProvider, Drawer, Grid } from 'antd';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import NotificationDropdown from '../components/NotificationDropdown';

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link to="/admin">Dashboard</Link>, '/admin', <DashboardOutlined />),
    getItem('Campaigns', 'campaigns-grp', <UnorderedListOutlined />, [
        getItem(<Link to="/admin/campaigns">All Campaigns</Link>, '/admin/campaigns'),
        getItem(<Link to="/admin/campaigns?status=pending">Verification Queue</Link>, '/admin/campaigns?status=pending'),
        getItem(<Link to="/admin/categories">Categories</Link>, '/admin/categories'),
        getItem(<Link to="/admin/tags">Tags</Link>, '/admin/tags'),
    ]),
    getItem(<Link to="/admin/withdrawals">Withdrawals</Link>, '/admin/withdrawals', <BankOutlined />),
    getItem('Management', 'mgmt-grp', <AppstoreOutlined />, [
        getItem(<Link to="/admin/banners">Banners</Link>, '/admin/banners', <PictureOutlined />),
        getItem(<Link to="/admin/faqs">FAQs</Link>, '/admin/faqs', <QuestionCircleOutlined />),
        getItem(<Link to="/admin/audit-logs">Audit Logs</Link>, '/admin/audit-logs', <SafetyCertificateOutlined />),
    ]),
    getItem(<Link to="/admin/users">Users</Link>, '/admin/users', <TeamOutlined />),
    getItem(<Link to="/admin/settings">Site Settings</Link>, '/admin/settings', <SettingOutlined />),
];

const AdminLayout: React.FC = () => {
    const screens = useBreakpoint();
    const isMobile = screens.xs || (screens.sm && !screens.md);
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [adminName, setAdminName] = useState(() => localStorage.getItem('user_name') || 'Administrator');
    const [adminAvatar, setAdminAvatar] = useState(() => localStorage.getItem('user_avatar') || '');
    
    theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active and open keys for the menu based on current path
    const { selectedKeys, openKeys } = useMemo(() => {
        const path = location.pathname;
        const fullPath = location.pathname + location.search;
        let selected = [fullPath];
        let open = [];

        // If reviewing a campaign, keep "All Campaigns" selected or "Verification Queue" depending on how we navigated
        if (path.startsWith('/admin/campaigns/') && path.endsWith('/review')) {
            selected = ['/admin/campaigns'];
            open = ['campaigns-grp'];
        } else if (path.includes('/admin/categories') || path.includes('/admin/tags') || path === '/admin/campaigns') {
            open = ['campaigns-grp'];
            if (location.search.includes('status=pending')) {
                selected = ['/admin/campaigns?status=pending'];
            } else {
                selected = ['/admin/campaigns'];
            }
        } else if (path.includes('/admin/banners') || path.includes('/admin/faqs') || path.includes('/admin/audit-logs')) {
            open = ['mgmt-grp'];
        }

        return { selectedKeys: selected, openKeys: open };
    }, [location.pathname, location.search]);

    const syncProfile = () => {
        const name = localStorage.getItem('user_name');
        const avatar = localStorage.getItem('user_avatar');
        if (name) setAdminName(name);
        if (avatar) setAdminAvatar(avatar);
    };

    useEffect(() => {
        window.addEventListener('user-profile-updated', syncProfile);
        return () => window.removeEventListener('user-profile-updated', syncProfile);
    }, []);

    // Close drawer when location changes (mobile)
    useEffect(() => {
        if (isMobile) {
            setDrawerVisible(false);
        }
    }, [location.pathname, isMobile]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_avatar');
        navigate('/admin/login');
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'My Profile',
            icon: <UserOutlined />,
            onClick: () => navigate('/admin/profile'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    const sidebarContent = (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
                height: 64, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start', 
                padding: (collapsed && !isMobile) ? 0 : '0 24px', 
                transition: 'all 0.3s' 
            }}>
                <img 
                    src="/logo/fundraiser-logo-nt.png" 
                    alt="FundRaiser Logo" 
                    style={{ 
                        height: 32,
                        marginRight: (collapsed && !isMobile) ? 0 : 12,
                        transition: 'all 0.3s'
                    }} 
                />
                {(!collapsed || isMobile) && <Title level={4} style={{ color: '#fff', margin: 0, fontSize: 18 }}>FundRaiser</Title>}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={selectedKeys}
                defaultOpenKeys={openKeys}
                items={items}
                style={{ borderRight: 0, marginTop: 16 }}
            />
        </div>
    );

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');

    if (!token || role !== 'admin') {
        return <NotFoundPage />;
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 8,
                },
                components: {
                    Layout: {
                        headerBg: '#fff',
                        siderBg: '#001529',
                    },
                    Menu: {
                        itemSelectedBg: 'rgba(22, 119, 255, 0.1)',
                        itemSelectedColor: '#1677ff',
                        itemMarginInline: 12,
                        itemBorderRadius: 8,
                    }
                },
            }}
        >
            <Layout style={{ minHeight: '100vh', width: '100%' }}>
                {isMobile ? (
                    <Drawer
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        styles={{ body: { padding: 0, background: '#001529' } }}
                        width={260}
                        closable={false}
                    >
                        {sidebarContent}
                    </Drawer>
                ) : (
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        width={260}
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 100,
                            boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
                        }}
                    >
                        {sidebarContent}
                    </Sider>
                )}
                
                <Layout style={{ 
                    marginLeft: isMobile ? 0 : (collapsed ? 80 : 260), 
                    transition: 'all 0.2s', 
                    background: '#f8fafc' 
                }}>
                    <Header style={{ 
                        padding: isMobile ? '0 16px' : '0 24px', 
                        background: '#fff', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        position: 'sticky',
                        top: 0,
                        zIndex: 99,
                        width: '100%',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                    }}>
                        <Button
                            type="text"
                            icon={<MenuUnfoldOutlined />}
                            onClick={() => isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        />
                        <Space size={isMobile ? "small" : "large"}>
                            <NotificationDropdown isAdmin={true} />
                            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                                <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'all 0.3s' }} className="user-dropdown-hover">
                                    <Avatar 
                                        size={isMobile ? "small" : "default"}
                                        src={adminAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${adminName}`} 
                                        style={{ backgroundColor: '#1677ff' }} 
                                    />
                                    {!isMobile && (
                                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                            <Text strong style={{ fontSize: 14 }}>{adminName}</Text>
                                            <Text type="secondary" style={{ fontSize: 12 }}>System Admin</Text>
                                        </div>
                                    )}
                                </Space>
                            </Dropdown>
                        </Space>
                    </Header>
                    <Content style={{ margin: isMobile ? '12px' : '24px', minHeight: 280 }}>
                        <div
                            style={{
                                padding: isMobile ? 16 : 24,
                                background: '#fff',
                                borderRadius: 12,
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                minHeight: 'calc(100vh - 170px)',
                                overflowX: 'auto'
                            }}
                        >
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', background: 'transparent', color: '#94a3b8', padding: '16px 0 24px' }}>
                        FundRaiser Admin &copy;{new Date().getFullYear()} {!isMobile && <>&bull; Built for Humanity</>}
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AdminLayout;
