"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { Habit }
    from "@/types/habit";

import useAxiosRequest
    from "./useAxiosRequest";

// ========================================
// HELPERS
// ========================================

export const getWeekBounds = () => {

    const now =
        new Date();

    const day =
        now.getDay();

    // 0 = Sunday,
    // 1 = Monday...

    const diffToMonday =
        (day + 6) % 7;

    const monday =
        new Date(now);

    monday.setDate(
        now.getDate() -
        diffToMonday
    );

    const sunday =
        new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    const format =
        (d: Date) =>
            d
                .toISOString()
                .split("T")[0];

    return {
        from: format(monday),
        to: format(sunday),
    };
};

// ========================================
// HOOK
// ========================================

const useHabits = (
    params?: {
        from?: string;
        to?: string;
        search?: string;
    }
) => {

    // ========================================
    // AXIOS
    // ========================================

    const axiosRequest =
        useAxiosRequest();

    // ========================================
    // STATE
    // ========================================

    const [habits, setHabits] =
        useState<Habit[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<Error | null>(null);

    // ========================================
    // FETCH
    // ========================================

    const fetch = useCallback(
        async () => {

            setLoading(true);

            setError(null);

            try {

                const week =
                    getWeekBounds();

                const queryParams:
                    Record<string, string> =
                    {
                        from:
                            params?.from ??
                            week.from,
                        to:
                            params?.to ??
                            week.to,
                    };

                if (params?.search) {

                    queryParams.search =
                        params.search;
                }

                const response =
                    await axiosRequest.get(
                        "/Habit/get",
                        {
                            params:
                                queryParams,
                        }
                    );

                setHabits(
                    response
                        .data
                        .data ?? []
                );
            }
            catch (err: any) {

                setError(err);
            }
            finally {

                setLoading(false);
            }
        },
        [
            axiosRequest,
            params?.from,
            params?.to,
            params?.search,
        ]
    );

    // ========================================
    // EFFECT
    // ========================================

    useEffect(() => {

        fetch();
    }, [fetch]);

    // ========================================
    // RETURN
    // ========================================

    return {
        habits,
        loading,
        error,
        refetch: fetch,
    };
};

export default useHabits;
