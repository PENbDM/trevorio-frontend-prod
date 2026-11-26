import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
});

const publicEndpoints = [
    "/api/accounts/login/",
    "/api/accounts/register/",
];

api.interceptors.request.use(
    (config) => {
        if (typeof window === "undefined") {
            return config;
        }

        const isPublicEndpoint =
            publicEndpoints.some(
                (endpoint) =>
                    config.url?.includes(endpoint)
            );

        if (isPublicEndpoint) {
            return config;
        }

        const accessToken =
            localStorage.getItem(
                "access_token"
            );

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (
            typeof window !== "undefined" &&
            error.response?.status === 401
        ) {
            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );
        }

        return Promise.reject(error);
    }
);