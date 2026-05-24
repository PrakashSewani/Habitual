"use client";

import {
    useCallback,
    useEffect,
    useRef,
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
        (d: Date) => {
            const y =
                d.getFullYear();

            const m = String(
                d.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                d.getDate()
            ).padStart(2, "0");

            return `${y}-${m}-${day}`;
        };

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

    const hasRun = useRef(false);

    // ========================================
    // FETCH
    // ========================================

    const fetch = useCallback(
        async () => {

            setLoading(true);

            setError(null);

            try {

                const queryParams:
                    Record<string, string> =
                    {};

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
            params?.search,
        ]
    );

    // ========================================
    // EFFECT
    // ========================================

    useEffect(() => {

        if (hasRun.current) {

            return;
        }

        hasRun.current = true;

        fetch();

    }, [fetch]);

    // ========================================
    // RETURN
    // ========================================

    return {
        habits,
        setHabits,
        loading,
        error,
        refetch: fetch,
    };
};

export default useHabits;
