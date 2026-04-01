import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Tag, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { navItems } from '../../routes/Navs';
import { AuthContext } from '../../context/AuthContextProvider';

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAdmin } = useContext(AuthContext);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    // All users see all nav items
    const menuItems = navItems.map(item => ({
        key: item.path,
        icon: React.createElement(item.icon),
        label: item.label,
        onClick: () => navigate(item.path)
    }));

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: (
                <Space>
                    {user?.name || 'User'}
                    {isAdmin() && <Tag color="purple" icon={<CrownOutlined />}>Admin</Tag>}
                </Space>
            )
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: () => {
                logout();
                navigate('/login');
            }
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed} 
                theme="dark"
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    height: '100vh',
                    overflow: 'auto'
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: collapsed ? 14 : 16,
                    fontWeight: 'bold'
                }}>
                    {collapsed ? 'SIM' : 'Smart Inventory'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    left: collapsed ? 80 : 200,
                    zIndex: 999,
                    transition: 'left 0.2s'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <span>{user?.name}</span>
                        </Space>
                    </Dropdown>
                </Header>
                <Content style={{
                    margin: '24px 16px',
                    marginTop: 88,
                    padding: 24,
                    minHeight: 'calc(100vh - 112px)',
                    maxHeight: 'calc(100vh - 112px)',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    overflow: 'auto'
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
