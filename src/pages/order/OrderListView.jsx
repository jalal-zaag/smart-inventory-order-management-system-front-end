import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Space, Tag, Modal, Typography, Input, Select } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';

const { Title } = Typography;
const { Option } = Select;

const OrderListView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(ToastContext);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            const response = await OrderService.getOrderList(params);
            setOrders(response.data.orders);
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id, orderNumber) => {
        Modal.confirm({
            title: 'Cancel Order',
            content: `Are you sure you want to cancel order "${orderNumber}"? Stock will be restored.`,
            okText: 'Cancel Order',
            okType: 'danger',
            onOk: async () => {
                try {
                    await OrderService.cancelOrder(id);
                    showSuccess('Order cancelled successfully');
                    fetchOrders();
                } catch (error) {
                    showError(getErrorMessage(error));
                }
            }
        });
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await OrderService.updateOrder(id, { status });
            showSuccess('Order status updated');
            fetchOrders();
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

    const columns = [
        {
            title: 'Order #',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
                record.customerName.toLowerCase().includes(value.toLowerCase())
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName'
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: (items) => items?.length || 0
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => formatCurrency(price)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusUpdate(record._id, value)}
                    disabled={status === 'Cancelled' || status === 'Delivered'}
                >
                    <Option value="Pending">Pending</Option>
                    <Option value="Confirmed">Confirmed</Option>
                    <Option value="Shipped">Shipped</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Cancelled" disabled>Cancelled</Option>
                </Select>
            )
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDateTime(date)
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/orders/${record._id}`)}
                    >
                        View
                    </Button>
                    {['Pending', 'Confirmed'].includes(record.status) && (
                        <Button
                            type="link"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancel(record._id, record.orderNumber)}
                        >
                            Cancel
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>Orders</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/orders/create')}
                >
                    Create Order
                </Button>
            </div>

            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search orders..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250 }}
                />
                <Select
                    placeholder="Filter by status"
                    allowClear
                    style={{ width: 150 }}
                    onChange={setStatusFilter}
                >
                    <Option value="Pending">Pending</Option>
                    <Option value="Confirmed">Confirmed</Option>
                    <Option value="Shipped">Shipped</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                loading={loading}
            />
        </div>
    );
};

export default OrderListView;
