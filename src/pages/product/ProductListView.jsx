import React, { useState, useEffect, useContext } from 'react';
import { Button, Space, Tag, Modal, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency, getStatusColor } from '../../utils/GenericUtils';
import SearchFilter from '../../components/common/SearchFilter';
import CustomTable from '../../components/common/CustomTable';
import CustomPagination from '../../components/common/CustomPagination';
import useGetParamData from '../../hooks/useGetParamData';
import { useQueryParams } from '../../hooks/useQueryParams';

const { Title } = Typography;

const ProductListView = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(ToastContext);
    const { allParams } = useGetParamData();
    const { updateSearchParams } = useQueryParams();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [allParams.page, allParams.size, allParams.search, allParams.status, allParams.category, allParams.lowStock]);

    const fetchCategories = async () => {
        try {
            const response = await CategoryService.getCategoryList({ size: 100 });
            setCategories(response.content || []);
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductService.getProductList(allParams);
            setProducts(response.content || []);
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

    const searchConfig = [
        {
            type: 'input',
            query: 'search',
            placeholder: 'Search products...',
            width: 250
        },
        {
            type: 'select',
            query: 'status',
            placeholder: 'Status',
            width: 150,
            options: [
                { value: 'all', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Out of Stock', label: 'Out of Stock' }
            ]
        },
        {
            type: 'select',
            query: 'category',
            placeholder: 'Category',
            width: 180,
            options: [
                { value: 'all', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]
        },
        {
            type: 'select',
            query: 'lowStock',
            placeholder: 'Stock Level',
            width: 150,
            options: [
                { value: 'all', label: 'All Stock' },
                { value: 'true', label: 'Low Stock Only' }
            ]
        }
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
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
                        onClick={() => navigate(`/products/${record.id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id, record.name)}
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

            <SearchFilter config={searchConfig} />

            <CustomTable
                columns={columns}
                dataSource={products}
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

export default ProductListView;
