import React from 'react';
import { Pagination, Divider } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const CustomPagination = ({ pagination, onPageChange }) => {
    const { page = 1, size = 10, total = 0 } = pagination || {};
    
    const totalPages = Math.ceil(total / size);
    const isFirstPage = page === 1;
    const isLastPage = page >= totalPages;

    const itemRender = (pageNumber, type, originalElement) => {
        if (type === 'prev') {
            return (
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        cursor: isFirstPage ? 'not-allowed' : 'pointer',
                        opacity: isFirstPage ? 0.5 : 1
                    }}
                >
                    <LeftOutlined /> Previous
                </div>
            );
        }
        if (type === 'next') {
            return (
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4,
                        cursor: isLastPage ? 'not-allowed' : 'pointer',
                        opacity: isLastPage ? 0.5 : 1
                    }}
                >
                    Next <RightOutlined />
                </div>
            );
        }
        return originalElement;
    };

    if (total === 0) return null;

    return (
        <div>
            <Divider style={{ margin: "16px 0" }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>
                    Showing {Math.min((page - 1) * size + 1, total)} - {Math.min(page * size, total)} of {total} items
                </span>
                <Pagination
                    total={total}
                    showSizeChanger
                    showQuickJumper={false}
                    itemRender={itemRender}
                    onChange={(newPage, newSize) => onPageChange({ page: newPage, size: newSize })}
                    current={page}
                    pageSize={size}
                    pageSizeOptions={[10, 20, 50, 100]}
                />
            </div>
        </div>
    );
};

export default CustomPagination;
