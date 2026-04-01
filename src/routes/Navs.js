import {
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    TagsOutlined,
    WarningOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import * as SLUG from './Slug';

export const navItems = [
    {
        key: 'dashboard',
        icon: DashboardOutlined,
        label: 'Dashboard',
        path: SLUG.DASHBOARD
    },
    {
        key: 'categories',
        icon: TagsOutlined,
        label: 'Categories',
        path: SLUG.CATEGORIES
    },
    {
        key: 'products',
        icon: AppstoreOutlined,
        label: 'Products',
        path: SLUG.PRODUCTS
    },
    {
        key: 'orders',
        icon: ShoppingCartOutlined,
        label: 'Orders',
        path: SLUG.ORDERS
    },
    {
        key: 'restock',
        icon: WarningOutlined,
        label: 'Restock Queue',
        path: SLUG.RESTOCK_QUEUE
    },
    {
        key: 'activity-log',
        icon: HistoryOutlined,
        label: 'Activity Log',
        path: SLUG.ACTIVITY_LOG
    }
];
