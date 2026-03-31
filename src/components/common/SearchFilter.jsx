import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Input, Select, Card, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useQueryParams } from '../../hooks/useQueryParams.js';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchFilter = ({
    config = [],
    extraFilters = null
}) => {
    const { search: currentSearchParams, updateSearchParams } = useQueryParams();
    
    // Local state for immediate UI feedback (for input fields only)
    const [localInputValues, setLocalInputValues] = useState({});
    const previousUrlInputValuesRef = useRef({});
    const searchDebounceTimerRef = useRef(null);
    const pendingInputValuesRef = useRef({});
    const updateSearchParamsRef = useRef(updateSearchParams);

    const inputQueries = useMemo(
        () => config.filter((item) => item.type === 'input').map((item) => item.query),
        [config]
    );

    useEffect(() => {
        updateSearchParamsRef.current = updateSearchParams;
    }, [updateSearchParams]);
    
    // Sync local state with URL params when they change externally
    useEffect(() => {
        if (inputQueries.length === 0) return;

        const latestUrlValues = {};
        inputQueries.forEach((query) => {
            latestUrlValues[query] = currentSearchParams[query] ?? '';
        });

        setLocalInputValues((prev) => {
            let hasChange = false;
            const next = { ...prev };

            inputQueries.forEach((query) => {
                const previousUrlValue = previousUrlInputValuesRef.current[query];
                const nextUrlValue = latestUrlValues[query];
                if (previousUrlValue !== nextUrlValue) {
                    const pendingValue = pendingInputValuesRef.current[query];
                    if (pendingValue !== undefined && String(nextUrlValue ?? '') !== String(pendingValue ?? '')) {
                        return;
                    }
                    if ((next[query] ?? '') !== (nextUrlValue ?? '')) {
                        next[query] = nextUrlValue;
                        hasChange = true;
                    }
                    if (pendingValue !== undefined && String(nextUrlValue ?? '') === String(pendingValue ?? '')) {
                        delete pendingInputValuesRef.current[query];
                    }
                }
            });

            return hasChange ? next : prev;
        });

        previousUrlInputValuesRef.current = latestUrlValues;
    }, [currentSearchParams, inputQueries]);
    
    useEffect(() => {
        return () => {
            if (searchDebounceTimerRef.current) {
                clearTimeout(searchDebounceTimerRef.current);
            }
        };
    }, []);

    const handleInputChange = useCallback((query, value) => {
        setLocalInputValues(prev => ({ ...prev, [query]: value }));
        pendingInputValuesRef.current[query] = value;
        
        if (searchDebounceTimerRef.current) {
            clearTimeout(searchDebounceTimerRef.current);
        }
        searchDebounceTimerRef.current = setTimeout(() => {
            updateSearchParamsRef.current({ [query]: value, page: 1 });
        }, 300);
    }, []);

    const handleSelectChange = useCallback((query, value) => {
        const processedValue = value === 'all' ? null : value;
        updateSearchParams({ [query]: processedValue, page: 1 });
    }, [updateSearchParams]);

    const handleDateRangeChange = useCallback((fromQuery, toQuery, dates) => {
        if (dates && dates[0] && dates[1]) {
            const fromTimestamp = dates[0].valueOf();
            const toTimestamp = dates[1].endOf('day').valueOf();
            updateSearchParams({ 
                [fromQuery]: fromTimestamp,
                [toQuery]: toTimestamp,
                page: 1
            });
        } else {
            updateSearchParams({ 
                [fromQuery]: null,
                [toQuery]: null,
                page: 1
            });
        }
    }, [updateSearchParams]);

    return (
        <Card size="small" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
                    <FilterOutlined />
                    <span>Filters:</span>
                </div>

                {config.map((item, index) => {
                    if (item.type === 'input') {
                        return (
                            <Input
                                key={index}
                                placeholder={item.placeholder || "Search..."}
                                value={localInputValues[item.query] ?? ''}
                                onChange={(e) => handleInputChange(item.query, e.target.value)}
                                prefix={<SearchOutlined />}
                                style={{ width: item.width || 220 }}
                                allowClear
                            />
                        );
                    }

                    if (item.type === 'select') {
                        let currentValue = currentSearchParams[item.query];
                        
                        if (currentValue === true) currentValue = 'true';
                        else if (currentValue === false) currentValue = 'false';
                        else if (currentValue === undefined || currentValue === null) currentValue = 'all';
                        
                        return (
                            <Select
                                key={index}
                                value={currentValue}
                                onChange={(value) => handleSelectChange(item.query, value)}
                                style={{ minWidth: item.width || 150 }}
                                placeholder={item.placeholder}
                            >
                                {(item.options || []).map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        );
                    }

                    if (item.type === 'dateRange') {
                        const fromTimestamp = currentSearchParams[item.fromQuery];
                        const toTimestamp = currentSearchParams[item.toQuery];
                        let dateRange = null;
                        
                        if (fromTimestamp && toTimestamp) {
                            dateRange = [
                                dayjs(Number(fromTimestamp)),
                                dayjs(Number(toTimestamp))
                            ];
                        }
                        
                        return (
                            <RangePicker
                                key={index}
                                value={dateRange}
                                onChange={(dates) => handleDateRangeChange(item.fromQuery, item.toQuery, dates)}
                                placeholder={item.placeholder || ['Start Date', 'End Date']}
                                style={{ minWidth: item.width || 280 }}
                                format={item.format || 'YYYY-MM-DD'}
                            />
                        );
                    }

                    return null;
                })}

                {extraFilters}
            </div>
        </Card>
    );
};

export default SearchFilter;
