import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Space, Tag, Modal, Typography, Select } from 'antd';
import { PlusOutlined, EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';
import SearchFilter from '../../components/common/SearchFilter';
import CustomPagination from '../../components/common/CustomPagination';
import useGetParamData from '../../hooks/useGetParamData';
import { useQueryParams } from '../../hooks/useQueryParams';

const { Title } = Typography;
const { Option } = Select;

const OrderListView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(ToastContext);
    const { allParams } = useGetParamData();
    const { updateSearchParams } = useQueryParams();

    useEffect(() => {
        fetchOrders();
    }, [allParams.page, allParams.size, allParams.search, allParams.status, allParams.from, allParams.to]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await OrderService.getOrderList(allParams);
            setOrders(response.content || []);
            setPagination({
                page: (response.number || 0) + 1,
                size: response.size || 10,
                total: response.totalElements || 0
            });
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = ({ page, size }) => {
        updateSearchParams({ page, size });
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

    const searchConfig = [
        {
            type: 'input',
            query: 'search',
            placeholder: 'Search order # or customer...',
            width: 280
        },
        {
            type: 'select',
            query: 'status',
            placeholder: 'Status',
            width: 150,
            options: [
                { value: 'all', label: 'All Status' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Confirmed', label: 'Confirmed' },
                { value: 'Shipped', label: 'Shipped' },
                { value: 'Delivered', label: 'Delivered' },
                { value: 'Cancelled', label: 'Cancelled' }
            ]
        },
        {
            type: 'dateRange',
            fromQuery: 'from',
            toQuery: 'to',
            placeholder: ['From Date', 'To Date'],
            width: 280
        }
    ];

    const columns = [
        {
            title: 'Order #',
            dataIndex: 'orderNumber',
            key: 'orderNumber'
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
                    onChange={(value) => handleStatusUpdate(record.id, value)}
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
                        onClick={() => navigate(`/orders/${record.id}`)}
                    >
                        View
                    </Button>
                    {['Pending', 'Confirmed'].includes(record.status) && (
                        <Button
                            type="link"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancel(record.id, record.orderNumber)}
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

            <SearchFilter config={searchConfig} />

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <CustomPagination 
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default OrderListView;
