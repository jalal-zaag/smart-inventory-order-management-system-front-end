import React, { createContext, useState } from 'react';
import { message } from 'antd';

export const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const showSuccess = (content) => {
        messageApi.success(content);
    };

    const showError = (content) => {
        messageApi.error(content);
    };

    const showWarning = (content) => {
        messageApi.warning(content);
    };

    const showInfo = (content) => {
        messageApi.info(content);
    };

    return (
        <ToastContext.Provider value={{
            showSuccess,
            showError,
            showWarning,
            showInfo
        }}>
            {contextHolder}
            {children}
        </ToastContext.Provider>
    );
};
