import { useSearchParams } from "react-router-dom";

const useGetParamData = (defaultSize = 10) => {
    const [searchParams] = useSearchParams();

    const allParams = {
        ...Object.fromEntries(searchParams.entries()),
        page:
            (searchParams.get("page") &&
                Number(searchParams.get("page")) - 1) ||
            0,
        size: Number(searchParams.get("size")) || defaultSize || 10,
    };
    
    return { allParams };
};

export default useGetParamData;
