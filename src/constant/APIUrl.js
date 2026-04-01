const API_VERSION = "api";
const VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const BASE_URL = `${VITE_APP_BASE_URL}/${API_VERSION}`;

// Auth endpoints
export const REGISTER_URL = `${BASE_URL}/auth/register`;
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const GET_ME_URL = `${BASE_URL}/auth/me`;

// Category endpoints
export const GET_ALL_CATEGORIES_URL = `${BASE_URL}/categories`;
export const CREATE_CATEGORY_URL = `${BASE_URL}/categories`;
export const GET_CATEGORY_URL = id => `${BASE_URL}/categories/${id}`;
export const UPDATE_CATEGORY_URL = id => `${BASE_URL}/categories/${id}`;
export const DELETE_CATEGORY_URL = id => `${BASE_URL}/categories/${id}`;

// Product endpoints
export const GET_ALL_PRODUCTS_URL = `${BASE_URL}/products`;
export const CREATE_PRODUCT_URL = `${BASE_URL}/products`;
export const GET_PRODUCT_URL = id => `${BASE_URL}/products/${id}`;
export const UPDATE_PRODUCT_URL = id => `${BASE_URL}/products/${id}`;
export const DELETE_PRODUCT_URL = id => `${BASE_URL}/products/${id}`;

// Order endpoints
export const GET_ALL_ORDERS_URL = `${BASE_URL}/orders`;
export const CREATE_ORDER_URL = `${BASE_URL}/orders`;
export const GET_ORDER_URL = id => `${BASE_URL}/orders/${id}`;
export const UPDATE_ORDER_URL = id => `${BASE_URL}/orders/${id}`;
export const CANCEL_ORDER_URL = id => `${BASE_URL}/orders/${id}/cancel`;
export const DELETE_ORDER_URL = id => `${BASE_URL}/orders/${id}`;

// Restock Queue endpoints
export const GET_RESTOCK_QUEUE_URL = `${BASE_URL}/restock-queue`;
export const RESTOCK_PRODUCT_URL = id => `${BASE_URL}/restock-queue/${id}/restock`;
export const REMOVE_FROM_QUEUE_URL = id => `${BASE_URL}/restock-queue/${id}`;

// Dashboard endpoints
export const GET_DASHBOARD_STATS_URL = `${BASE_URL}/dashboard/stats`;
export const GET_RECENT_ACTIVITIES_URL = `${BASE_URL}/dashboard/activities`;
export const GET_CHART_DATA_URL = `${BASE_URL}/dashboard/chart-data`;

// Activity Log endpoints
export const GET_ALL_ACTIVITY_LOGS_URL = `${BASE_URL}/activity-logs`;
export const GET_ACTIVITY_LOG_URL = id => `${BASE_URL}/activity-logs/${id}`;
