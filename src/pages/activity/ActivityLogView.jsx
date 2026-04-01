import React, { useState, useEffect, useContext } from 'react';
import { Typography, Tag } from 'antd';
import ActivityLogService from '../../services/ActivityLogService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';
import SearchFilter from '../../components/common/SearchFilter';
import CustomTable from '../../components/common/CustomTable';
import CustomPagination from '../../components/common/CustomPagination';
import useGetParamData from '../../hooks/useGetParamData';
import { useQueryParams } from '../../hooks/useQueryParams';
import { TOTAL_CONTENT_HEIGHT } from '../../constant/ConstantVariables';

const { Title } = Typography;

const ActivityLogView = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const { showError } = useContext(ToastContext);
    const { allParams } = useGetParamData();
    const { updateSearchParams } = useQueryParams();

    useEffect(() => {
        fetchActivities();
    }, [allParams.page, allParams.size, allParams.search, allParams.resourceType]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await ActivityLogService.getActivityLogList(allParams);
            setActivities(response.content || []);
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

    const getResourceTypeColor = (type) => {
        switch (type) {
            case 'Order': return 'blue';
            case 'Product': return 'green';
            case 'Category': return 'purple';
            case 'RestockQueue': return 'orange';
            case 'Auth': return 'cyan';
            default: return 'default';
        }
    };

    const getActionColor = (action) => {
        if (action.includes('Created')) return 'success';
        if (action.includes('Updated')) return 'processing';
        if (action.includes('Deleted')) return 'error';
        if (action.includes('Cancelled')) return 'warning';
        if (action.includes('Restocked')) return 'success';
        return 'default';
    };

    const searchConfig = [
        {
            type: 'input',
            query: 'search',
            placeholder: 'Search activities...',
            width: 280
        },
        {
            type: 'select',
            query: 'resourceType',
            placeholder: 'Resource Type',
            width: 180,
            options: [
                { value: 'all', label: 'All Types' },
                { value: 'Order', label: 'Orders' },
                { value: 'Product', label: 'Products' },
                { value: 'Category', label: 'Categories' },
                { value: 'RestockQueue', label: 'Restock' }
            ]
        }
    ];

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 200,
            render: (action) => <Tag color={getActionColor(action)}>{action}</Tag>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Resource Type',
            dataIndex: 'resourceType',
            key: 'resourceType',
            width: 130,
            render: (type) => <Tag color={getResourceTypeColor(type)}>{type}</Tag>
        },
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            width: 150
        },
        {
            title: 'Timestamp',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date) => formatDateTime(date)
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>Activity Log</Title>
            </div>

            <SearchFilter config={searchConfig} />

            <CustomTable
                columns={columns}
                dataSource={activities}
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

export default ActivityLogView;
