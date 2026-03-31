import { ACCESS_TOKEN } from "../constant/ConstantVariables.js";

export const authorizationHeader = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return { "Authorization": `Bearer ${accessToken}` };
}

export const getErrorMessage = (error) => {
    if (error.response) {
        if (error.response.data) {
            return error.response.data.message || error.response.data.error || "An error occurred";
        }
        return error.response.data;
    } else if (error.request) {
        return "No response from server. Please check your connection.";
    } else {
        return error.message || "An unexpected error occurred";
    }
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

export const getStatusColor = (status) => {
    const colors = {
        'Pending': 'orange',
        'Confirmed': 'blue',
        'Shipped': 'purple',
        'Delivered': 'green',
        'Cancelled': 'red',
        'Active': 'green',
        'Out of Stock': 'red',
        'High': 'red',
        'Medium': 'orange',
        'Low': 'blue'
    };
    return colors[status] || 'default';
}
