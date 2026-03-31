import dayjs from 'dayjs';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from '../constant/ConstantVariables';

export const formatDate = (date) => {
    if (!date) return '-';
    return dayjs(date).format(DATE_FORMAT);
}

export const formatDateTime = (date) => {
    if (!date) return '-';
    return dayjs(date).format(DATETIME_FORMAT);
}

export const formatTime = (date) => {
    if (!date) return '-';
    return dayjs(date).format(TIME_FORMAT);
}

export const formatRelativeTime = (date) => {
    if (!date) return '-';
    const now = dayjs();
    const target = dayjs(date);
    const diffMinutes = now.diff(target, 'minute');
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = now.diff(target, 'hour');
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = now.diff(target, 'day');
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatDate(date);
}
