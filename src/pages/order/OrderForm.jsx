import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Space, Table, InputNumber, Select, Divider, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import ProductService from '../../services/ProductService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage, formatCurrency } from '../../utils/GenericUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const OrderForm = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useContext(ToastContext);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getProductList({ status: 'Active', size: 100 });
            setProducts(response.content || []);
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

    const addItem = () => {
        if (!selectedProduct) {
            showWarning('Please select a product');
            return;
        }

        const product = products.find(p => p.id === selectedProduct);
        
        if (orderItems.find(item => item.product === selectedProduct)) {
            showError('This product is already added to the order.');
            return;
        }

        if (quantity > product.stockQuantity) {
            showWarning(`Only ${product.stockQuantity} items available in stock.`);
            return;
        }

        const newItem = {
            product: product.id,
            productName: product.name,
            quantity,
            price: product.price,
            subtotal: product.price * quantity,
            availableStock: product.stockQuantity
        };

        setOrderItems([...orderItems, newItem]);
        setSelectedProduct(null);
        setQuantity(1);
    };

    const removeItem = (productId) => {
        setOrderItems(orderItems.filter(item => item.product !== productId));
    };

    const updateItemQuantity = (productId, newQuantity) => {
        const item = orderItems.find(i => i.product === productId);
        if (newQuantity > item.availableStock) {
            showWarning(`Only ${item.availableStock} items available in stock.`);
            return;
        }

        setOrderItems(orderItems.map(item => {
            if (item.product === productId) {
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal: item.price * newQuantity
                };
            }
            return item;
        }));
    };

    const totalPrice = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const onFinish = async (values) => {
        if (orderItems.length === 0) {
            showError('Please add at least one item to the order');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                customerName: values.customerName,
                items: orderItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                }))
            };

            await OrderService.createOrder(orderData);
            showSuccess('Order created successfully');
            navigate('/orders');
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const itemColumns = [
        { title: 'Product', dataIndex: 'productName', key: 'productName' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (p) => formatCurrency(p) },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty, record) => (
                <InputNumber
                    min={1}
                    max={record.availableStock}
                    value={qty}
                    onChange={(value) => updateItemQuantity(record.product, value)}
                />
            )
        },
        { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (s) => formatCurrency(s) },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="link" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.product)}>
                    Remove
                </Button>
            )
        }
    ];

    return (
        <div>
            <Title level={3}>Create Order</Title>

            <Card style={{ maxWidth: 800 }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="customerName"
                        label="Customer Name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input placeholder="Enter customer name" />
                    </Form.Item>

                    <Divider>Order Items</Divider>

                    <Space style={{ marginBottom: 16, width: '100%' }} align="end">
                        <div>
                            <Text>Product</Text>
                            <Select
                                placeholder="Select product"
                                style={{ width: 250, display: 'block' }}
                                value={selectedProduct}
                                onChange={setSelectedProduct}
                                showSearch
                                optionFilterProp="children"
                            >
                                {products.filter(p => !orderItems.find(i => i.product === p.id)).map(p => (
                                    <Option key={p.id} value={p.id}>
                                        {p.name} - {formatCurrency(p.price)} (Stock: {p.stockQuantity})
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Text>Quantity</Text>
                            <InputNumber
                                min={1}
                                value={quantity}
                                onChange={setQuantity}
                                style={{ width: 100, display: 'block' }}
                            />
                        </div>
                        <Button icon={<PlusOutlined />} onClick={addItem}>Add Item</Button>
                    </Space>

                    {orderItems.length > 0 ? (
                        <>
                            <Table
                                columns={itemColumns}
                                dataSource={orderItems}
                                rowKey="product"
                                pagination={false}
                                size="small"
                            />
                            <div style={{ textAlign: 'right', marginTop: 16 }}>
                                <Title level={4}>Total: {formatCurrency(totalPrice)}</Title>
                            </div>
                        </>
                    ) : (
                        <Alert message="No items added yet. Please add products to the order." type="info" />
                    )}

                    <Form.Item style={{ marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={orderItems.length === 0}>
                                Create Order
                            </Button>
                            <Button onClick={() => navigate('/orders')}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default OrderForm;
