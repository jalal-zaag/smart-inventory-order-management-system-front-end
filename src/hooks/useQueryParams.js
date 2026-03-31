import { useCallback, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import { getUpdatedQueryParams, normalizeQueryParams } from "../utils/SearchParamsUtils.js";

export const useQueryParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Memoize normalized search to avoid unnecessary recalculations
    const search = useMemo(() =>
        normalizeQueryParams(searchParams), [searchParams]);

    // Function to update search params
    const updateSearchParams = useCallback((newParams) => {
        const params = getUpdatedQueryParams(newParams, searchParams);
        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    return { search, updateSearchParams };
};
