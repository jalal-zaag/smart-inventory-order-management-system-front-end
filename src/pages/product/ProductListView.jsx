import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Space, Tag, Modal, Typography, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';

const { Title } = Typography;
const { Option } = Select;

const ProductListView = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(ToastContext);

    useEffect(() => {
        fetchProducts();
    }, [statusFilter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            const response = await ProductService.getProductList(params);
            setProducts(response.data.products);
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, name) => {
        Modal.confirm({
            title: 'Delete Product',
            content: `Are you sure you want to delete "${name}"?`,
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await ProductService.deleteProduct(id);
                    showSuccess('Product deleted successfully');
                    fetchProducts();
                } catch (error) {
                    showError(getErrorMessage(error));
                }
            }
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.name.toLowerCase().includes(value.toLowerCase())
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatCurrency(price)
        },
        {
            title: 'Stock',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (stock, record) => (
                <span style={{ color: stock < record.minStockThreshold ? '#ff4d4f' : 'inherit' }}>
                    {stock} {stock < record.minStockThreshold && '(Low)'}
                </span>
            )
        },
        {
            title: 'Min Threshold',
            dataIndex: 'minStockThreshold',
            key: 'minStockThreshold'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/products/${record._id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id, record.name)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>Products</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/products/create')}
                >
                    Add Product
                </Button>
            </div>

            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search products..."
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
                    <Option value="Active">Active</Option>
                    <Option value="Out of Stock">Out of Stock</Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="_id"
                loading={loading}
            />
        </div>
    );
};

export default ProductListView;
