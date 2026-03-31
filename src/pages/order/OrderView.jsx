import React, { useState, useEffect, useContext } from 'react';
import { Card, Typography, Descriptions, Table, Tag, Button, Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';

const { Title } = Typography;

const OrderView = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const { showError } = useContext(ToastContext);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await OrderService.getOrder(id);
            setOrder(response.data.order);
        } catch (error) {
            showError(getErrorMessage(error));
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    const itemColumns = [
        { title: 'Product', dataIndex: 'productName', key: 'productName' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (p) => formatCurrency(p) },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (s) => formatCurrency(s) }
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>
                    Back to Orders
                </Button>
            </Space>

            <Title level={3}>Order Details</Title>

            <Card>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Order Number">{order?.orderNumber}</Descriptions.Item>
                    <Descriptions.Item label="Customer Name">{order?.customerName}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(order?.status)}>{order?.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Price">{formatCurrency(order?.totalPrice)}</Descriptions.Item>
                    <Descriptions.Item label="Created At">{formatDateTime(order?.createdAt)}</Descriptions.Item>
                    <Descriptions.Item label="Updated At">{formatDateTime(order?.updatedAt)}</Descriptions.Item>
                </Descriptions>

                <Title level={5} style={{ marginTop: 24 }}>Order Items</Title>
                <Table
                    columns={itemColumns}
                    dataSource={order?.items}
                    rowKey="_id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default OrderView;
