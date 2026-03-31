import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, List, Spin } from 'antd';
import {
    ShoppingCartOutlined,
    DollarOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import DashboardService from '../../services/DashboardService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';
import { formatRelativeTime } from '../../utils/DateFormatterUtils';

const { Title } = Typography;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const { showError } = useContext(ToastContext);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, activitiesRes] = await Promise.all([
                DashboardService.getDashboardStats(),
                DashboardService.getRecentActivities({ limit: 10 })
            ]);
            setStats(statsRes.data.stats);
            setActivities(activitiesRes.data.activities);
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const productColumns = [
        { title: 'Product', dataIndex: 'name', key: 'name' },
        { title: 'Stock', dataIndex: 'stock', key: 'stock' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        }
    ];

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <Title level={3}>Dashboard</Title>
            
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Orders Today"
                            value={stats?.ordersToday || 0}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Orders"
                            value={stats?.pendingOrders || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Completed Orders"
                            value={stats?.completedOrders || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Revenue Today"
                            value={stats?.revenueToday || 0}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Low Stock Items"
                            value={stats?.lowStockCount || 0}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: stats?.lowStockCount > 0 ? '#ff4d4f' : '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Product Summary">
                        <Table
                            columns={productColumns}
                            dataSource={stats?.productSummary || []}
                            rowKey="name"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Activities">
                        <List
                            size="small"
                            dataSource={activities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.action}
                                        description={item.description}
                                    />
                                    <div>{formatRelativeTime(item.createdAt)}</div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
