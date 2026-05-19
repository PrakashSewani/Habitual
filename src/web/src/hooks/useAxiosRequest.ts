"use client";

import { useEffect } from "react";

import axios from "axios";

import axiosRequest from "../api/axios";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import { toast } from "react-toastify";

let isRedirecting = false;

const useAxiosRequest = () => {

    const router =
        useRouter();

    const pathname =
        usePathname();

    useEffect(() => {

        // ========================================
        // REQUEST INTERCEPTOR
        // ========================================

        const requestInterceptor =
            axiosRequest.interceptors.request.use(
                config => {

                    const token =
                        sessionStorage.getItem(
                            "token"
                        );

                    if (
                        token &&
                        !config.headers.Authorization
                    ) {
                        config.headers.Authorization =
                            `Bearer ${token}`;
                    }

                    return config;
                },

                error =>
                    Promise.reject(error)
            );

        // ========================================
        // RESPONSE INTERCEPTOR
        // ========================================

        const responseInterceptor =
            axiosRequest.interceptors.response.use(
                response => response,

                async error => {

                    const previousRequest =
                        error?.config;

                    // ========================================
                    // HANDLE 401
                    // ========================================

                    if (
                        error?.response?.status === 401 &&
                        !previousRequest?.sent
                    ) {

                        previousRequest.sent = true;

                        try {

                            const refreshToken =
                                sessionStorage.getItem(
                                    "refreshToken"
                                );

                            // No refresh token
                            if (!refreshToken) {

                                sessionStorage.clear();

                                if (
                                    pathname !== "/login" &&
                                    !isRedirecting
                                ) {

                                    isRedirecting = true;

                                    toast.error(
                                        "Please login to continue."
                                    );

                                    router.replace(
                                        "/login"
                                    );

                                    isRedirecting = false;
                                }

                                return Promise.reject(
                                    error
                                );
                            }

                            // ========================================
                            // REFRESH TOKEN REQUEST
                            // ========================================

                            const response =
                                await axios.post(
                                    "https://localhost:7224/api/auth/refresh",
                                    {
                                        refreshToken,
                                    }
                                );

                            const newAccessToken =
                                response.data.data
                                    .accessToken;

                            // Save new token
                            sessionStorage.setItem(
                                "token",
                                newAccessToken
                            );

                            // Retry original request
                            previousRequest.headers.Authorization =
                                `Bearer ${newAccessToken}`;

                            return axiosRequest(
                                previousRequest
                            );
                        }
                        catch (refreshError) {

                            sessionStorage.clear();

                            if (
                                pathname !== "/login" &&
                                !isRedirecting
                            ) {

                                isRedirecting = true;

                                toast.error(
                                    "Session expired. Please login again."
                                );

                                router.replace(
                                    "/login"
                                );

                                isRedirecting = false;
                            }

                            return Promise.reject(
                                refreshError
                            );
                        }
                    }

                    return Promise.reject(error);
                }
            );

        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            axiosRequest.interceptors
                .request.eject(
                    requestInterceptor
                );

            axiosRequest.interceptors
                .response.eject(
                    responseInterceptor
                );
        };

    }, [pathname, router]);

    return axiosRequest;
};

export default useAxiosRequest;