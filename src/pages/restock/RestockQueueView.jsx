import React, { useState, useEffect, useContext } from 'react';
import { Button, Tag, Modal, Typography, InputNumber, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import RestockService from '../../services/RestockService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, getStatusColor } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';
import SearchFilter from '../../components/common/SearchFilter';
import CustomTable from '../../components/common/CustomTable';
import CustomPagination from '../../components/common/CustomPagination';
import useGetParamData from '../../hooks/useGetParamData';
import { useQueryParams } from '../../hooks/useQueryParams';
import { TOTAL_CONTENT_HEIGHT } from '../../constant/ConstantVariables';

const { Title } = Typography;

const RestockQueueView = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const [restockModalVisible, setRestockModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [restockQuantity, setRestockQuantity] = useState(10);
    const { showSuccess, showError } = useContext(ToastContext);
    const { allParams } = useGetParamData();
    const { updateSearchParams } = useQueryParams();

    useEffect(() => {
        fetchQueue();
    }, [allParams.page, allParams.size, allParams.priority]);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const response = await RestockService.getRestockQueue(allParams);
            setQueue(response.content || []);
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

    const openRestockModal = (item) => {
        setSelectedItem(item);
        setRestockQuantity(item.minStockThreshold - item.currentStock + 5);
        setRestockModalVisible(true);
    };

    const handleRestock = async () => {
        try {
            await RestockService.restockProduct(selectedItem.id, { quantity: restockQuantity });
            showSuccess('Product restocked successfully');
            setRestockModalVisible(false);
            fetchQueue();
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

    const searchConfig = [
        {
            type: 'select',
            query: 'priority',
            placeholder: 'Priority',
            width: 150,
            options: [
                { value: 'all', label: 'All Priorities' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
            ]
        }
    ];

    const columns = [
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: 'Current Stock',
            dataIndex: 'currentStock',
            key: 'currentStock',
            render: (stock) => <span style={{ color: stock === 0 ? '#ff4d4f' : '#faad14' }}>{stock}</span>
        },
        {
            title: 'Min Threshold',
            dataIndex: 'minStockThreshold',
            key: 'minStockThreshold'
        },
        {
            title: 'Deficit',
            key: 'deficit',
            render: (_, record) => record.minStockThreshold - record.currentStock
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => <Tag color={getStatusColor(priority)}>{priority}</Tag>
        },
        {
            title: 'Added At',
            dataIndex: 'addedAt',
            key: 'addedAt',
            render: (date) => formatDateTime(date)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={() => openRestockModal(record)}
                >
                    Restock
                </Button>
            )
        }
    ];

    return (
        <div>
            <Title level={3} style={{ marginBottom: 16 }}>Restock Queue</Title>

            <SearchFilter config={searchConfig} />

            {queue.length === 0 && !loading ? (
                <div style={{ textAlign: 'center', padding: 50 }}>
                    <Title level={4} type="secondary">No items in restock queue</Title>
                    <p>All products are sufficiently stocked!</p>
                </div>
            ) : (
                <>
                    <CustomTable
                        columns={columns}
                        dataSource={queue}
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
                </>
            )}

            <Modal
                title={`Restock: ${selectedItem?.productName}`}
                open={restockModalVisible}
                onOk={handleRestock}
                onCancel={() => setRestockModalVisible(false)}
                okText="Restock"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <p>Current Stock: <strong>{selectedItem?.currentStock}</strong></p>
                    <p>Minimum Threshold: <strong>{selectedItem?.minStockThreshold}</strong></p>
                    <p>Enter quantity to add:</p>
                    <InputNumber
                        min={1}
                        value={restockQuantity}
                        onChange={setRestockQuantity}
                        style={{ width: '100%' }}
                    />
                </Space>
            </Modal>
        </div>
    );
};

export default RestockQueueView;
