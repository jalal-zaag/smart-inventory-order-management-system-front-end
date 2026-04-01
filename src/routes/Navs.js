import {
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    TagsOutlined,
    WarningOutlined,
    HistoryOutlined,
    TeamOutlined
} from '@ant-design/icons';
import * as SLUG from './Slug';

// All navigation items - customers only shown to admins
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
    },
    {
        key: 'customers',
        icon: TeamOutlined,
        label: 'Customers',
        path: SLUG.CUSTOMERS,
        adminOnly: true  // Mark as admin-only
    }
];

// Get nav items based on user role - filter out admin-only items for non-admins
export const getNavItemsForRole = (isAdminUser) => {
    if (isAdminUser) {
        return navItems; // Admins see everything
    }
    return navItems.filter(item => !item.adminOnly); // Regular users don't see admin-only items
};
