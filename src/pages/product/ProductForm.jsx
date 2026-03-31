import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Space, Spin, Select, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage } from '../../utils/GenericUtils';

const { Title } = Typography;
const { Option } = Select;

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSuccess, showError } = useContext(ToastContext);
    const [form] = Form.useForm();

    const isEdit = !!id;

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await CategoryService.getCategoryList();
            setCategories(response.data.categories);
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

    const fetchProduct = async () => {
        setFetching(true);
        try {
            const response = await ProductService.getProduct(id);
            const product = response.data.product;
            form.setFieldsValue({
                ...product,
                category: product.category?._id || product.category
            });
        } catch (error) {
            showError(getErrorMessage(error));
            navigate('/products');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (isEdit) {
                await ProductService.updateProduct(id, values);
                showSuccess('Product updated successfully');
            } else {
                await ProductService.createProduct(values);
                showSuccess('Product created successfully');
            }
            navigate('/products');
        } catch (error) {
            showError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <Title level={3}>{isEdit ? 'Edit Product' : 'Create Product'}</Title>

            <Card style={{ maxWidth: 600 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ minStockThreshold: 5, stockQuantity: 0 }}
                >
                    <Form.Item
                        name="name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select placeholder="Select category">
                            {categories.map(cat => (
                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber
                            min={0}
                            precision={2}
                            style={{ width: '100%' }}
                            prefix="$"
                            placeholder="Enter price"
                        />
                    </Form.Item>

                    <Form.Item
                        name="stockQuantity"
                        label="Stock Quantity"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter stock quantity" />
                    </Form.Item>

                    <Form.Item
                        name="minStockThreshold"
                        label="Minimum Stock Threshold"
                        rules={[{ required: true, message: 'Please enter minimum threshold' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter minimum threshold" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {isEdit ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => navigate('/products')}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ProductForm;
