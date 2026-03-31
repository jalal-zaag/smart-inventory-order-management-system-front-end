import { useContext, useEffect } from "react";
import privateAPI from "./privateAPI";
import { authorizationHeader } from "../utils/GenericUtils.js";
import { AuthContext } from "../context/AuthContextProvider.jsx";

const Interceptors = () => {
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const requestInterceptor = privateAPI.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization) {
                    config.headers = {...config.headers, ...authorizationHeader()};
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = privateAPI.interceptors.response.use(
            (res) => {
                return res;
            }, 
            async (err) => {
                if (err.response && err.response.status === 401) {
                    authContext.logout();
                }
                return Promise.reject(err);
            }
        );

        return () => {
            privateAPI.interceptors.request.eject(requestInterceptor);
            privateAPI.interceptors.response.eject(responseInterceptor);
        };
    }, [authContext]);

    return null;
}

export default Interceptors;
