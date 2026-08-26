import axios from "axios";

const api =
    axios.create(
        {
            baseURL:
                process.env.REACT_APP_API_URL ||
                "https://hospital-management-system-1-c6kb.onrender.com/api",

            withCredentials:
                true,

            headers:
            {
                "Content-Type":
                    "application/json"
            }
        }
    );


api.interceptors.request.use(
    (config) =>
    {
        const token =
            localStorage.getItem(
                "token"
            );

        if (token)
        {
            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) =>
    {
        return Promise.reject(
            error
        );
    }
);


api.interceptors.response.use(
    (response) =>
    {
        return response;
    },

    (error) =>
    {
        if (
            error.response &&
            error.response.status === 401
        )
        {
            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "/login";
        }

        return Promise.reject(
            error
        );
    }
);


export default api;
