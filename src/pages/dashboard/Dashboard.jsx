import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, Segmented } from 'antd';
import {
    ShoppingCartOutlined,
    DollarOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import DashboardService from '../../services/DashboardService';
import { ToastContext } from '../../context/ToastContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [chartType, setChartType] = useState('orders');
    const [chartDays, setChartDays] = useState(7);
    const { showError } = useContext(ToastContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchChartData();
    }, [chartDays]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, chartRes] = await Promise.all([
                DashboardService.getDashboardStats(),
                DashboardService.getChartData({ days: chartDays })
            ]);
            setStats(statsRes.stats);
            setChartData(chartRes.chartData || []);
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async () => {
        try {
            const chartRes = await DashboardService.getChartData({ days: chartDays });
            setChartData(chartRes.chartData || []);
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'purple';
            case 'user': return 'blue';
            default: return 'default';
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

    // Chart configurations
    const ordersChartConfig = {
        data: chartData,
        xField: 'displayDate',
        yField: 'orders',
        smooth: true,
        color: '#1890ff',
        point: {
            size: 4,
            shape: 'circle',
            style: { fill: '#1890ff', stroke: '#fff', lineWidth: 2 }
        },
        area: {
            style: { fill: 'l(270) 0:#ffffff 0.5:#1890ff33 1:#1890ff66' }
        },
        yAxis: {
            min: 0,
            tickInterval: 1
        },
        tooltip: {
            formatter: (datum) => ({
                name: 'Orders',
                value: datum.orders
            })
        }
    };

    const revenueChartConfig = {
        data: chartData,
        xField: 'displayDate',
        yField: 'revenue',
        color: '#52c41a',
        columnStyle: {
            radius: [4, 4, 0, 0]
        },
        label: {
            position: 'top',
            style: { fill: '#666', fontSize: 11 },
            formatter: (v) => (v.revenue > 0 ? `$${v.revenue}` : '')
        },
        yAxis: {
            min: 0,
            label: {
                formatter: (v) => `$${v}`
            }
        },
        tooltip: {
            formatter: (datum) => ({
                name: 'Revenue',
                value: `$${datum.revenue.toFixed(2)}`
            })
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined />
                    <Text strong>{user?.name}</Text>
                    <Tag color={getRoleBadgeColor(user?.role)}>{user?.role?.toUpperCase()}</Tag>
                </div>
            </div>
            
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

            {/* Analytics Charts */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card 
                        title="Analytics Overview"
                        extra={
                            <div style={{ display: 'flex', gap: 16 }}>
                                <Segmented
                                    value={chartType}
                                    onChange={setChartType}
                                    options={[
                                        { label: 'Orders', value: 'orders' },
                                        { label: 'Revenue', value: 'revenue' }
                                    ]}
                                />
                                <Segmented
                                    value={chartDays}
                                    onChange={setChartDays}
                                    options={[
                                        { label: '7 Days', value: 7 },
                                        { label: '14 Days', value: 14 },
                                        { label: '30 Days', value: 30 }
                                    ]}
                                />
                            </div>
                        }
                    >
                        <div style={{ height: 300 }}>
                            {chartType === 'orders' ? (
                                <Line {...ordersChartConfig} />
                            ) : (
                                <Column {...revenueChartConfig} />
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24}>
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
            </Row>
        </div>
    );
};

export default Dashboard;
