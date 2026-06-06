"use client";

import {
    useEffect,
    useRef,
} from "react";

import axios from "axios";

import axiosRequest
    from "../api/axios";

import { API_AUTH_REFRESH } from "../config/api";

import {
    useRouter,
} from "next/navigation";

import {
    toast,
} from "react-toastify";

let isRedirecting = false;

let requestInterceptorId:
    number | null = null;

let responseInterceptorId:
    number | null = null;

let hookMountCount = 0;

const useAxiosRequest = () => {

    // ========================================
    // HOOKS
    // ========================================

    const router =
        useRouter();

    const routerRef =
        useRef(router);

    // ========================================
    // EFFECT
    // ========================================

    useEffect(() => {
        routerRef.current = router;
    }, [router]);

    useEffect(() => {

        hookMountCount++;

        // ========================================
        // ONLY REGISTER ONCE
        // ========================================

        if (
            hookMountCount > 1
        ) {

            return () => {

                hookMountCount--;
            };
        }

        // ========================================
        // REQUEST INTERCEPTOR
        // ========================================

        requestInterceptorId =
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

        responseInterceptorId =
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
                                    typeof window !==
                                    "undefined" &&
                                    window.location
                                        .pathname !==
                                    "/login" &&
                                    !isRedirecting
                                ) {

                                    isRedirecting = true;

                                    toast.error(
                                        "Please login to continue."
                                    );

                                    routerRef.current.replace(
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
                                    API_AUTH_REFRESH,
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
                        catch (refreshError) {

                            sessionStorage.clear();

                            if (
                                typeof window !==
                                "undefined" &&
                                window.location
                                    .pathname !==
                                "/login" &&
                                !isRedirecting
                            ) {

                                isRedirecting = true;

                                const refreshErrors =
                                    (refreshError as {
                                        response?: {
                                            data?: {
                                                errors?:
                                                    string[];
                                            };
                                        };
                                    })?.response?.data?.errors;

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

                                routerRef.current.replace(
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

            hookMountCount--;

            if (
                hookMountCount === 0
            ) {

                if (
                    requestInterceptorId !==
                    null
                ) {

                    axiosRequest.interceptors
                        .request.eject(
                            requestInterceptorId
                        );

                    requestInterceptorId = null;
                }

                if (
                    responseInterceptorId !==
                    null
                ) {

                    axiosRequest.interceptors
                        .response.eject(
                            responseInterceptorId
                        );

                    responseInterceptorId = null;
                }
            }
        };

    }, []);

    // ========================================
    // RETURN
    // ========================================

    return axiosRequest;
};

export default useAxiosRequest;