"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import { User } from "@/types/user";

import useAxiosRequest
    from "./useAxiosRequest";

const useAuthenticateUser = () => {

    const axiosRequest =
        useAxiosRequest();

    const router =
        useRouter();

    const pathname =
        usePathname();

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    const hasRun = useRef(false);

    useEffect(() => {

        if (hasRun.current) {

            return;
        }

        hasRun.current = true;

        const authenticateUser =
            async () => {

                try {

                    const token =
                        sessionStorage.getItem(
                            "token"
                        );

                    const refreshToken =
                        sessionStorage.getItem(
                            "refreshToken"
                        );

                    if (
                        !token ||
                        !refreshToken
                    ) {

                        setLoading(false);

                        if (
                            pathname !== "/login"
                        ) {

                            router.replace(
                                "/login"
                            );
                        }

                        return;
                    }

                    const response =
                        await axiosRequest.get(
                            "/user/me"
                        );

                    setUser(
                        response.data.data
                    );
                }
                catch (error) {

                    console.error(error);

                    sessionStorage.clear();

                    if (
                        pathname !== "/login"
                    ) {

                        router.replace(
                            "/login"
                        );
                    }
                }
                finally {

                    setLoading(false);
                }
            };

        authenticateUser();

    }, [axiosRequest, pathname, router]);

    const logout = async () => {

        try {

            const refreshToken =
                sessionStorage.getItem(
                    "refreshToken"
                );

            await axiosRequest.delete(
                "/user/logout",
                {
                    params: {
                        refreshToken,
                    },
                }
            );
        }
        catch (error) {

            // Backend logout failed.
            // Ignore intentionally because
            // local logout should still happen.

            console.error(error);
        }
        finally {

            // ========================================
            // ALWAYS CLEAR LOCAL SESSION
            // ========================================

            setUser(null);

            sessionStorage.clear();

            router.replace("/login");
        }
    };

    return {
        user,
        loading,
        logout,
    };
};

export default useAuthenticateUser;