"use client";

import { useEffect } from "react";

import axios from "axios";

import axiosRequest
    from "../api/axios";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    toast,
} from "react-toastify";

let isRedirecting = false;

const useAxiosRequest = () => {

    // ========================================
    // HOOKS
    // ========================================

    const router =
        useRouter();

    const pathname =
        usePathname();

    // ========================================
    // EFFECT
    // ========================================

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

                // ========================================
                // SUCCESS RESPONSE
                // ========================================

                response => {

                    const responseData =
                        response.data;

                    // ========================================
                    // SUCCESS = FALSE
                    // ========================================

                    if (
                        responseData &&
                        responseData.success === false
                    ) {

                        const errors =
                            responseData.errors;

                        // Multiple backend errors
                        if (
                            errors &&
                            Array.isArray(errors)
                        ) {

                            errors.forEach(
                                (
                                    errorMessage: string
                                ) => {

                                    toast.error(
                                        errorMessage
                                    );
                                }
                            );
                        }
                        else {

                            toast.error(
                                responseData.message ||
                                "Something went wrong."
                            );
                        }

                        return Promise.reject(
                            responseData
                        );
                    }

                    // ========================================
                    // SUCCESS TOAST
                    // ========================================

                    const method =
                        response.config.method;

                    // Only toast for non-GET requests
                    if (
                        method &&
                        method !== "get" &&
                        responseData?.message
                    ) {

                        toast.success(
                            responseData.message
                        );
                    }

                    return response;
                },

                // ========================================
                // ERROR RESPONSE
                // ========================================

                async error => {

                    const previousRequest =
                        error?.config;

                    // ========================================
                    // BACKEND ERRORS
                    // ========================================

                    const backendErrors =
                        error?.response?.data?.errors;

                    const backendMessage =
                        error?.response?.data?.message;

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

                            // ========================================
                            // NO REFRESH TOKEN
                            // ========================================

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
                            // REFRESH REQUEST
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

                            // ========================================
                            // SAVE TOKEN
                            // ========================================

                            sessionStorage.setItem(
                                "token",
                                newAccessToken
                            );

                            // ========================================
                            // RETRY ORIGINAL REQUEST
                            // ========================================

                            previousRequest.headers.Authorization =
                                `Bearer ${newAccessToken}`;

                            return axiosRequest(
                                previousRequest
                            );
                        }
                        catch (refreshError: any) {

                            sessionStorage.clear();

                            if (
                                pathname !== "/login" &&
                                !isRedirecting
                            ) {

                                isRedirecting = true;

                                const refreshErrors =
                                    refreshError?.response
                                        ?.data?.errors;

                                // Refresh backend errors
                                if (
                                    refreshErrors &&
                                    Array.isArray(
                                        refreshErrors
                                    )
                                ) {

                                    refreshErrors.forEach(
                                        (
                                            message: string
                                        ) => {

                                            toast.error(
                                                message
                                            );
                                        }
                                    );
                                }
                                else {

                                    toast.error(
                                        "Session expired. Please login again."
                                    );
                                }

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

                    // ========================================
                    // NON-401 ERRORS
                    // ========================================

                    if (
                        backendErrors &&
                        Array.isArray(
                            backendErrors
                        )
                    ) {

                        backendErrors.forEach(
                            (
                                message: string
                            ) => {

                                toast.error(
                                    message
                                );
                            }
                        );
                    }
                    else {

                        toast.error(
                            backendMessage ||
                            "Something went wrong."
                        );
                    }

                    return Promise.reject(
                        error
                    );
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

    // ========================================
    // RETURN
    // ========================================

    return axiosRequest;
};

export default useAxiosRequest;