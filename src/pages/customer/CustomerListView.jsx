import React, { useState, useEffect, useContext } from 'react';
import { Button, Space, Modal, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CustomerService from '../../services/CustomerService';
import { ToastContext } from '../../context/ToastContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';
import { getErrorMessage } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';
import SearchFilter from '../../components/common/SearchFilter';
import CustomTable from '../../components/common/CustomTable';
import CustomPagination from '../../components/common/CustomPagination';
import useGetParamData from '../../hooks/useGetParamData';
import { useQueryParams } from '../../hooks/useQueryParams';
import { TOTAL_CONTENT_HEIGHT } from '../../constant/ConstantVariables';

const { Title } = Typography;

const CustomerListView = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(ToastContext);
    const { isAdmin } = useContext(AuthContext);
    const { allParams } = useGetParamData();
    const { updateSearchParams } = useQueryParams();

    // Only admin can access this page (enforced by routing)
    const canEdit = true;
    const canDelete = true;

    useEffect(() => {
        fetchCustomers();
    }, [allParams.page, allParams.size, allParams.search, allParams.role]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await CustomerService.getCustomerList(allParams);
            setCustomers(response.content || []);
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
            title: 'Delete Customer',
            content: `Are you sure you want to delete "${name}"? This will also delete all their data (categories, products, orders).`,
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await CustomerService.deleteCustomer(id);
                    showSuccess('Customer deleted successfully');
                    fetchCustomers();
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
            placeholder: 'Search by name or email...',
            width: 280
        },
        {
            type: 'select',
            query: 'role',
            placeholder: 'Filter by role',
            width: 150,
            options: [
                { label: 'All Roles', value: '' },
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }
            ]
        }
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    <span>{text}</span>
                </Space>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>
                    {role.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Registered At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date) => formatDateTime(date)
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    {canDelete ? (
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id, record.name)}
                        >
                            Delete
                        </Button>
                    ) : null}
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>Customers Management</Title>
                <div style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
                    Registered Users: {pagination.total}
                </div>
            </div>

            <SearchFilter config={searchConfig} />

            <CustomTable
                columns={columns}
                dataSource={customers}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{
                    y: (window.innerHeight - TOTAL_CONTENT_HEIGHT) - 10
                }}
            />

            <CustomPagination 
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CustomerListView;
