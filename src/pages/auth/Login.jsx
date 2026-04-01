import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, Dropdown } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage } from '../../utils/GenericUtils';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { showSuccess, showError } = useContext(ToastContext);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await login(values);
            showSuccess('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const demoAccounts = [
        { label: 'Admin (Full Access)', email: 'admin@example.com', password: 'admin123' },
        { label: 'Manager (Limited)', email: 'manager@example.com', password: 'manager123' },
        { label: 'Staff (View Only)', email: 'demo@example.com', password: 'demo123' }
    ];

    const handleDemoLogin = (account) => {
        form.setFieldsValue({
            email: account.email,
            password: account.password
        });
    };

    const demoMenuItems = demoAccounts.map((account, index) => ({
        key: index,
        label: account.label,
        onClick: () => handleDemoLogin(account)
    }));

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: 8 }}>Welcome Back</Title>
                        <Text type="secondary">Sign in to Smart Inventory System</Text>
                    </div>

                    <Form form={form} name="login" onFinish={onFinish} layout="vertical" size="large">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Sign In
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Dropdown menu={{ items: demoMenuItems }} placement="bottom">
                                <Button block>
                                    Demo Login <DownOutlined />
                                </Button>
                            </Dropdown>
                        </Form.Item>
                    </Form>

                    <Divider plain>Or</Divider>

                    <div style={{ textAlign: 'center' }}>
                        <Text>Don't have an account? </Text>
                        <Link to="/register">Sign Up</Link>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default Login;
