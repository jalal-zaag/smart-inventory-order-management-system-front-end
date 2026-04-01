import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthContextProvider } from './context/AuthContextProvider';
import { ToastContextProvider } from './context/ToastContextProvider';
import Interceptors from './rest-handlers/Interceptors';
import PrivateRoute from './routes/PrivateRoute';
import DefaultLayout from './components/layout/DefaultLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Category Pages
import CategoryListView from './pages/category/CategoryListView';
import CategoryForm from './pages/category/CategoryForm';

// Product Pages
import ProductListView from './pages/product/ProductListView';
import ProductForm from './pages/product/ProductForm';

// Order Pages
import OrderListView from './pages/order/OrderListView';
import OrderForm from './pages/order/OrderForm';
import OrderView from './pages/order/OrderView';

// Restock Queue
import RestockQueueView from './pages/restock/RestockQueueView';

// Activity Log
import ActivityLogView from './pages/activity/ActivityLogView';

const theme = {
    token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
    },
};

function App() {
    return (
        <ConfigProvider theme={theme}>
            <BrowserRouter>
                <AuthContextProvider>
                    <ToastContextProvider>
                        <Interceptors />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Private Routes */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <DefaultLayout><Dashboard /></DefaultLayout>
                                </PrivateRoute>
                            } />

                            {/* Categories */}
                            <Route path="/categories" element={
                                <PrivateRoute>
                                    <DefaultLayout><CategoryListView /></DefaultLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/categories/create" element={
                                <PrivateRoute>
                                    <DefaultLayout><CategoryForm /></DefaultLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/categories/:id/edit" element={
                                <PrivateRoute>
                                    <DefaultLayout><CategoryForm /></DefaultLayout>
                                </PrivateRoute>
                            } />

                            {/* Products */}
                            <Route path="/products" element={
                                <PrivateRoute>
                                    <DefaultLayout><ProductListView /></DefaultLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/products/create" element={
                                <PrivateRoute>
                                    <DefaultLayout><ProductForm /></DefaultLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/products/:id/edit" element={
                                <PrivateRoute>
                                    <DefaultLayout><ProductForm /></DefaultLayout>
                                </PrivateRoute>
                            } />

                            {/* Orders */}
                            <Route path="/orders" element={
                                <PrivateRoute>
                                    <DefaultLayout><OrderListView /></DefaultLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/orders/create" element={
                                <PrivateRoute>
                                    <DefaultLayout><OrderForm /></DefaultLayout>
                                </PrivateRoute>
                            } />
                            <Route path="/orders/:id" element={
                                <PrivateRoute>
                                    <DefaultLayout><OrderView /></DefaultLayout>
                                </PrivateRoute>
                            } />

                            {/* Restock Queue */}
                            <Route path="/restock-queue" element={
                                <PrivateRoute>
                                    <DefaultLayout><RestockQueueView /></DefaultLayout>
                                </PrivateRoute>
                            } />

                            {/* Activity Log */}
                            <Route path="/activity-log" element={
                                <PrivateRoute>
                                    <DefaultLayout><ActivityLogView /></DefaultLayout>
                                </PrivateRoute>
                            } />

                            {/* Default redirect */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </ToastContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
