import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage } from '../../utils/GenericUtils';

const { Title } = Typography;
const { TextArea } = Input;

const CategoryForm = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSuccess, showError } = useContext(ToastContext);
    const [form] = Form.useForm();

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        setFetching(true);
        try {
            const response = await CategoryService.getCategory(id);
            form.setFieldsValue(response.data.category);
        } catch (error) {
            showError(getErrorMessage(error));
            navigate('/categories');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (isEdit) {
                await CategoryService.updateCategory(id, values);
                showSuccess('Category updated successfully');
            } else {
                await CategoryService.createCategory(values);
                showSuccess('Category created successfully');
            }
            navigate('/categories');
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
            <Title level={3}>{isEdit ? 'Edit Category' : 'Create Category'}</Title>

            <Card style={{ maxWidth: 600 }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please enter category name' }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <TextArea rows={4} placeholder="Enter description (optional)" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {isEdit ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => navigate('/categories')}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CategoryForm;
