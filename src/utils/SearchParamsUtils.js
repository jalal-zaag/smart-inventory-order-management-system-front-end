export const normalizeQueryParams = (searchParams) => {
    const rawPage = searchParams.get("page");
    const rawSize = searchParams.get("size");

    const page = Math.max(parseInt(rawPage || "", 10) || 1, 1);
    const size = Math.max(parseInt(rawSize || "", 10) || 10, 1);

    const obj = { page, size };

    for (const [key, value] of searchParams.entries()) {
        if (key === "page" || key === "size") continue;

        const decoded = decodeURIComponent(value);

        if (decoded === "undefined" || decoded === "null" || decoded === "") {
            obj[key] = undefined;
        } else if (decoded === "true") {
            obj[key] = true;
        } else if (decoded === "false") {
            obj[key] = false;
        } else {
            obj[key] = decoded;
        }
    }

    return obj;
};

export const getUpdatedQueryParams = (newParams, searchParams) => {
    const current = Object.fromEntries(searchParams.entries());

    const page = Math.max(Number(newParams.page ?? current.page ?? 1), 1);
    const sizeFromNew = newParams.size !== undefined && newParams.size !== null && newParams.size !== '';
    const sizeFromCurrent = current.size !== undefined && current.size !== null && current.size !== '';
    const size = sizeFromNew
        ? Math.max(Number(newParams.size), 1)
        : sizeFromCurrent
            ? Math.max(Number(current.size), 1)
            : undefined;

    const params = {
        ...current,
        ...newParams,
        page,
        ...(size !== undefined && { size }),
    };

    // Remove null/undefined/empty strings
    Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === "") {
            delete params[key];
        }
    });

    return params;
};

export const removeEmptyKeys = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== undefined && value !== null && value !== '' && value !== 'undefined' && value !== 'null') {
            cleaned[key] = value;
        }
    });
    return cleaned;
};
