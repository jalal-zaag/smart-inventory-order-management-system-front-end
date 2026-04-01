import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Space, Spin, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerService from '../../services/CustomerService';
import { ToastContext } from '../../context/ToastContextProvider';
import { getErrorMessage } from '../../utils/GenericUtils';

const { Title } = Typography;

const CustomerForm = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSuccess, showError } = useContext(ToastContext);
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    const fetchCustomer = async () => {
        setFetching(true);
        try {
            const response = await CustomerService.getCustomer(id);
            form.setFieldsValue(response.customer);
        } catch (error) {
            showError(getErrorMessage(error));
            navigate('/customers');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await CustomerService.updateCustomer(id, values);
            showSuccess('Customer updated successfully');
            navigate('/customers');
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
            <Title level={3}>Edit Customer</Title>

            <Card style={{ maxWidth: 600 }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        label="Customer Name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input placeholder="Enter customer name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter valid email' }
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select role' }]}
                    >
                        <Select placeholder="Select role">
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update Customer
                            </Button>
                            <Button onClick={() => navigate('/customers')}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card style={{ maxWidth: 600, marginTop: 16, backgroundColor: '#fffbe6', borderColor: '#ffe58f' }}>
                <Typography.Text type="warning">
                    <strong>Note:</strong> Password cannot be changed through this form. 
                    Users must use the password reset functionality.
                </Typography.Text>
            </Card>
        </div>
    );
};

export default CustomerForm;
