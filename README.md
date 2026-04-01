# Smart Inventory & Order Management System - Frontend

A comprehensive web application for managing products, stock levels, customer orders, and fulfillment workflows with validation and conflict handling.

## 🌐 Live Demo

**Live Site:** [https://smart-inventory-order-management-sy.vercel.app/](https://smart-inventory-order-management-sy.vercel.app/)

### Demo Credentials
- **Admin Account:** `admin@example.com` / `admin123`
- **User Account:** `user@example.com` / `user123`

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_BASE_URL=http://localhost:8080/api
```

---

## ✨ Features

### 1. 🔐 Authentication
- **User Registration** with email and password validation
- **Secure Login** with demo credentials for quick testing
- **Demo Login Buttons** pre-fill credentials for Admin and User roles
- Automatic redirect to Dashboard after successful login
- Role-based access control (Admin/User)

### 2. 📦 Product & Category Management

#### Categories
- Create, update, and delete product categories
- Category name and optional description
- Search and filter categories
- Pagination support

#### Products
- **Add Products** with complete details:
  - Product Name (required)
  - Category selection (required)
  - Price with 2 decimal precision (required)
  - Stock Quantity (required)
  - Minimum Stock Threshold (default: 5 units)
- **Automatic Status Management:**
  - `Active` - Product available for orders
  - `Out of Stock` - Automatically set when stock = 0
- **Advanced Filtering:**
  - Search by product name
  - Filter by status (Active/Out of Stock)
  - Filter by category
  - Filter by low stock items
- **Visual Indicators:** Low stock items highlighted in red
- Edit and delete products
- Pagination with customizable page sizes (10, 20, 50, 100)

### 3. 🛒 Order Management

#### Create Orders
- Add customer name (required)
- Select multiple products from active inventory
- Specify quantity per product
- Real-time stock availability display
- Auto-calculated total price
- Subtotal per line item

#### Order Lifecycle
Track orders through complete fulfillment workflow:
- **Pending** - Initial order state
- **Confirmed** - Order approved
- **Shipped** - Order dispatched
- **Delivered** - Order completed
- **Cancelled** - Order cancelled (stock restored)

#### Order Operations
- **Create New Orders** with multiple products
- **Update Order Status** via dropdown
- **Cancel Orders** with confirmation modal
- **View Order Details** with complete item breakdown
- **Search & Filter:**
  - Search by customer name or order ID
  - Filter by order status
  - Filter by date range
- **Pagination** on order list

### 4. 📊 Stock Handling & Validation

#### Smart Stock Rules
- **Automatic Stock Deduction** when orders are placed
- **Real-time Validation:**
  - Prevents orders exceeding available stock
  - Shows warning: "Only X items available in stock"
  - Prevents order confirmation if insufficient stock
- **Stock Restoration:** Stock automatically restored when orders are cancelled
- **Status Auto-Update:** Product status changes to "Out of Stock" when stock = 0
- **Stock Display:** Available stock shown in product selection dropdown

### 5. 🔄 Restock Queue (Low Stock Management)

#### Automatic Queue Management
- Products automatically added when stock falls below threshold
- **Priority Levels:**
  - **High Priority** - Critical stock shortage
  - **Medium Priority** - Low stock warning
  - **Low Priority** - Approaching threshold
- **Sorted by Lowest Stock First** for urgent restocking
- **Queue Display:**
  - Product name
  - Current stock quantity
  - Minimum threshold
  - Stock deficit calculation
  - Priority level with color tags
  - Timestamp when added

#### Restock Operations
- **Restock Modal** with:
  - Current stock display
  - Minimum threshold display
  - Quantity to add input
  - Auto-suggested restock quantity
- **Update Stock Manually** directly from queue
- **Auto-Remove** from queue once restocked above threshold
- Filter queue by priority level
- Pagination support

### 6. 🛡️ Conflict Detection & Prevention

#### Order Validation Rules
- **Duplicate Prevention:** Cannot add the same product twice to an order
  - Shows error: "This product is already added to the order"
- **Inactive Product Prevention:** Only active products available in dropdown
  - Out of stock products excluded from selection
- **Required Fields Validation:**
  - Customer name required
  - At least one order item required
- **Stock Quantity Validation:** Prevents ordering more than available stock

### 7. 📈 Dashboard & Analytics

#### Key Metrics
- **Orders Today** - Total orders created today
- **Pending Orders** - Orders awaiting confirmation
- **Completed Orders** - Successfully delivered orders
- **Revenue Today** - Total revenue with 2 decimal precision
- **Low Stock Items Count** - Products below threshold (red if > 0)

#### Analytics Charts
- **Dual Chart Types:**
  - **Orders Chart** - Line chart showing order trends
  - **Revenue Chart** - Column chart showing revenue trends
- **Time Range Selection:**
  - Last 7 days
  - Last 14 days
  - Last 30 days
- **Interactive Features:**
  - Smooth animations
  - Tooltips on hover
  - Color-coded visualization

#### Product Summary
- Quick view table with:
  - Product names
  - Current stock levels
  - Status indicators with color tags

#### User Information
- Display logged-in user name
- Role badge (Admin/User) with color coding

### 8. 📝 Activity Log

#### Comprehensive Tracking
Track all system actions with detailed information:
- **Action Types:**
  - Created (green)
  - Updated (blue)
  - Deleted (red)
  - Cancelled (orange)
  - Restocked (purple)
- **Resource Types:**
  - Orders
  - Products
  - Categories
  - Restock Queue
  - Authentication

#### Log Features
- **Full Details:** Action description, user, and timestamp
- **Color-Coded Tags** for quick identification
- **Search & Filter:**
  - Text search across descriptions
  - Filter by resource type
  - Filter by action type
- **Pagination** for large datasets
- **Chronological Order** (newest first)

### 9. 🎁 Bonus Features

#### Search & Filter
- **Global Search Component** with:
  - 300ms debounce for performance
  - Text input search
  - Dropdown filters
  - Date range pickers
- Implemented on all list views

#### Pagination
- **Custom Pagination Component** with:
  - Page number display
  - Size changer (10, 20, 50, 100 options)
  - Quick jumper
  - Item count display
  - Previous/Next navigation
- Consistent across all data tables

#### Analytics
- Interactive charts with @ant-design/charts
- Multiple time ranges
- Smooth animations and transitions
- Export-ready visualizations

#### Role-Based Access Control (RBAC)
- **Admin Role:**
  - Full access to all features
  - Customer management (admin-only)
  - System-wide analytics
- **User Role:**
  - Manage own categories, products, orders
  - View own dashboard
  - Limited to personal inventory
- **403 Forbidden Page** for unauthorized access
- Protected routes with authentication

#### Additional Features
- **Toast Notifications** for success/error/warning messages
- **Responsive Design** with Ant Design grid system
- **Loading States** with spinners and skeletons
- **Error Handling** with user-friendly messages
- **Currency Formatting** for consistent pricing display
- **Date Formatting** utilities
- **Status Color Coding** for visual consistency
- **Smooth UI Transitions** and animations

---

## 🛠️ Tech Stack

- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.3
- **UI Library:** Ant Design 6.3.5
- **Charts:** @ant-design/charts 2.6.7
- **Routing:** React Router DOM 7.13.2
- **HTTP Client:** Axios 1.14.0
- **Date Handling:** Day.js 1.11.20
- **Icons:** @ant-design/icons 6.1.1

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components (SearchFilter, Pagination, etc.)
│   └── layout/           # Layout components (DefaultLayout, Navigation)
├── pages/
│   ├── auth/             # Login, Register
│   ├── dashboard/        # Dashboard with analytics
│   ├── category/         # Category CRUD
│   ├── product/          # Product CRUD
│   ├── order/            # Order management
│   ├── restock/          # Restock queue
│   ├── activity/         # Activity log
│   └── customer/         # Customer management (admin only)
├── services/             # API service layer
├── context/              # React context providers (Auth, Toast)
├── hooks/                # Custom React hooks
├── routes/               # Route configuration and guards
├── utils/                # Utility functions
├── constant/             # Constants and configurations
└── rest-handlers/        # Axios interceptors
```

---

## 🔒 Security Features

- **JWT-based Authentication**
- **Protected Routes** with authentication guards
- **Role-Based Authorization**
- **Password Validation** (minimum 6 characters)
- **Email Validation**
- **CSRF Protection** via Axios interceptors
- **Error Handling** to prevent sensitive data exposure

---

## 🎯 Use Cases

This system is perfect for:
- Small to medium retail businesses
- Warehouse inventory management
- E-commerce order fulfillment
- Restaurant supply management
- Pharmacy stock tracking
- General product inventory control

---

## 📞 Support

For issues, questions, or contributions, please refer to the project repository.

---

## 📄 License

ISC License

---

**Built with ❤️ using React, Vite, and Ant Design**
