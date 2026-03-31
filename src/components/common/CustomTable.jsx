import React from 'react';
import { Table } from 'antd';

const CustomTable = ({ 
    columns, 
    dataSource, 
    loading = false, 
    rowKey = 'id',
    pagination = false,
    bordered = false,
    size = 'middle',
    scroll,
    rowClassName,
    onRow,
    expandable,
    showHeader = true,
    sticky = false,
    ...restProps 
}) => {
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey={rowKey}
            pagination={pagination}
            bordered={bordered}
            size={size}
            scroll={scroll}
            rowClassName={rowClassName}
            onRow={onRow}
            expandable={expandable}
            showHeader={showHeader}
            sticky={sticky}
            {...restProps}
            style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                ...restProps.style
            }}
        />
    );
};

export default CustomTable;
