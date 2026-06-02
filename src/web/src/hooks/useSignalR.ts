"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import * as signalR
    from "@microsoft/signalr";

import { Habit } from "@/types/habit";

import { SIGNALR_HUB_URL } from "../config/api";

// ========================================
// TYPES
// ========================================

export type HabitLogUpdatedPayload = {
    habitId: string;
    date: string;
    completed: boolean;
};

export type HabitUpdatedPayload = {
    habitId: string;
    action: "created" | "updated" | "deleted";
    habit: Habit | null;
};

// ========================================
// CONFIG
// ========================================

const HUB_URL = SIGNALR_HUB_URL;

// ========================================
// HOOK
// ========================================

const useSignalR = () => {

    const [
        connection,
        setConnection,
    ] = useState<signalR.HubConnection | null>(null);

    const [
        connected,
        setConnected,
    ] = useState(false);

    const logListenersRef = useRef<
        Set<
            (
                payload: HabitLogUpdatedPayload
            ) => void
        >
    >(new Set());

    const habitListenersRef = useRef<
        Set<
            (
                payload: HabitUpdatedPayload
            ) => void
        >
    >(new Set());

    const mountedRef =
        useRef(true);

    // ========================================
    // CONNECT
    // ========================================

    useEffect(() => {

        mountedRef.current = true;

        const token =
            sessionStorage.getItem(
                "token"
            );

        if (!token) {

            console.log(
                "[SignalR] No token in sessionStorage, skipping connection."
            );

            return;
        }

        const conn =
            new signalR.HubConnectionBuilder()
                .withUrl(
                    HUB_URL,
                    {
                        accessTokenFactory:
                            () => token,
                    }
                )
                .withAutomaticReconnect()
                .configureLogging(
                    signalR.LogLevel.Information
                )
                .build();

        setConnection(conn);

        const start = async () => {

            try {

                console.log(
                    "[SignalR] Starting connection..."
                );

                await conn.start();

                if (
                    !mountedRef.current
                ) {

                    return;
                }

                console.log(
                    "[SignalR] Connected."
                );

                setConnected(true);
            }
            catch (err: any) {

                if (
                    !mountedRef.current
                ) {

                    return;
                }

                console.error(
                    "[SignalR] Connection failed:",
                    err?.message ?? err
                );

                setConnected(false);
            }
        };

        start();

        conn.onreconnecting(
            () => {

                if (
                    mountedRef.current
                ) {

                    setConnected(false);
                }
            }
        );

        conn.onreconnected(
            () => {

                if (
                    mountedRef.current
                ) {

                    setConnected(true);
                }
            }
        );

        conn.onclose(
            () => {

                if (
                    mountedRef.current
                ) {

                    setConnected(false);
                }
            }
        );

        return () => {

            mountedRef.current = false;

            console.log(
                "[SignalR] Stopping connection (unmount)."
            );

            setConnection(null);

            conn.stop();
        };

    }, []);

    // ========================================
    // LISTENERS: HabitLogUpdated
    // ========================================

    useEffect(() => {

        if (!connection) {

            return;
        }

        const handler = (
            payload: HabitLogUpdatedPayload
        ) => {

            console.log(
                "[SignalR] HabitLogUpdated received:",
                payload
            );

            logListenersRef.current.forEach(
                cb => cb(payload)
            );
        };

        connection.on(
            "HabitLogUpdated",
            handler
        );

        return () => {

            connection.off(
                "HabitLogUpdated",
                handler
            );
        };

    }, [connection]);

    // ========================================
    // LISTENERS: HabitUpdated
    // ========================================

    useEffect(() => {

        if (!connection) {

            return;
        }

        const handler = (
            payload: HabitUpdatedPayload
        ) => {

            console.log(
                "[SignalR] HabitUpdated received:",
                payload
            );

            habitListenersRef.current.forEach(
                cb => cb(payload)
            );
        };

        connection.on(
            "HabitUpdated",
            handler
        );

        return () => {

            connection.off(
                "HabitUpdated",
                handler
            );
        };

    }, [connection]);

    // ========================================
    // REGISTER: HabitLogUpdated
    // ========================================

    const onHabitLogUpdated = useCallback(
        (
            callback: (
                payload: HabitLogUpdatedPayload
            ) => void
        ) => {

            logListenersRef.current.add(
                callback
            );

            return () => {

                logListenersRef.current.delete(
                    callback
                );
            };
        },
        []
    );

    // ========================================
    // REGISTER: HabitUpdated
    // ========================================

    const onHabitUpdated = useCallback(
        (
            callback: (
                payload: HabitUpdatedPayload
            ) => void
        ) => {

            habitListenersRef.current.add(
                callback
            );

            return () => {

                habitListenersRef.current.delete(
                    callback
                );
            };
        },
        []
    );

    return {
        connected,
        onHabitLogUpdated,
        onHabitUpdated,
    };
};

export default useSignalR;
