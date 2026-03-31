import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Tag, Modal, Typography, InputNumber, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import RestockService from '../../services/RestockService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, getStatusColor } from '../../utils/GenericUtils';
import { formatDateTime } from '../../utils/DateFormatterUtils';

const { Title } = Typography;

const RestockQueueView = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [restockModalVisible, setRestockModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [restockQuantity, setRestockQuantity] = useState(10);
    const { showSuccess, showError } = useContext(ToastContext);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const response = await RestockService.getRestockQueue();
            setQueue(response.data.queue);
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const openRestockModal = (item) => {
        setSelectedItem(item);
        setRestockQuantity(item.minStockThreshold - item.currentStock + 5);
        setRestockModalVisible(true);
    };

    const handleRestock = async () => {
        try {
            await RestockService.restockProduct(selectedItem._id, { quantity: restockQuantity });
            showSuccess('Product restocked successfully');
            setRestockModalVisible(false);
            fetchQueue();
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>Restock Queue</Title>
                <Button onClick={fetchQueue} icon={<ReloadOutlined />}>Refresh</Button>
            </div>

            {queue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 50 }}>
                    <Title level={4} type="secondary">No items in restock queue</Title>
                    <p>All products are sufficiently stocked!</p>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={queue}
                    rowKey="_id"
                    loading={loading}
                />
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
