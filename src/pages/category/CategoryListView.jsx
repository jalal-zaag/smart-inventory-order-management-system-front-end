import React, { useState, useEffect, useContext } from 'react';
import { Button, Space, Modal, Typography, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
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

const CategoryListView = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(ToastContext);
    const { isManagerOrAbove, isAdmin } = useContext(AuthContext);
    const { allParams } = useGetParamData();
    const { updateSearchParams } = useQueryParams();

    const canCreate = isManagerOrAbove();
    const canEdit = isManagerOrAbove();
    const canDelete = isAdmin();

    useEffect(() => {
        fetchCategories();
    }, [allParams.page, allParams.size, allParams.search]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await CategoryService.getCategoryList(allParams);
            setCategories(response.content || []);
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
            title: 'Delete Category',
            content: `Are you sure you want to delete "${name}"?`,
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await CategoryService.deleteCategory(id);
                    showSuccess('Category deleted successfully');
                    fetchCategories();
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
            placeholder: 'Search categories...',
            width: 280
        }
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text || '-'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDateTime(date)
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {canEdit ? (
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/categories/${record.id}/edit`)}
                        >
                            Edit
                        </Button>
                    ) : (
                        <Tooltip title="Only Managers and Admins can edit">
                            <Button type="link" icon={<LockOutlined />} disabled>Edit</Button>
                        </Tooltip>
                    )}
                    {canDelete ? (
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id, record.name)}
                        >
                            Delete
                        </Button>
                    ) : (
                        <Tooltip title="Only Admins can delete">
                            <Button type="link" danger icon={<LockOutlined />} disabled>Delete</Button>
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>Categories</Title>
                {canCreate ? (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/categories/create')}
                    >
                        Add Category
                    </Button>
                ) : (
                    <Tooltip title="Only Managers and Admins can add categories">
                        <Button type="primary" icon={<LockOutlined />} disabled>
                            Add Category
                        </Button>
                    </Tooltip>
                )}
            </div>

            <SearchFilter config={searchConfig} />

            <CustomTable
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                pagination={false}
                 scroll={{
                        y: (window.innerHeight - TOTAL_CONTENT_HEIGHT) -10
                    }}
            />

            <CustomPagination 
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CategoryListView;
