"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import * as signalR
    from "@microsoft/signalr";

export type HabitLogUpdatedPayload = {
    habitId: string;
    date: string;
    completed: boolean;
};

const HUB_URL =
    "https://localhost:7224/hubs/habits";

const useSignalR = () => {

    const [
        connection,
        setConnection,
    ] = useState<signalR.HubConnection | null>(null);

    const [
        connected,
        setConnected,
    ] = useState(false);

    const listenersRef = useRef<
        Set<
            (
                payload: HabitLogUpdatedPayload
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

                    // Unmounted during start (e.g. React Strict Mode).
                    // Swallow silently.

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
    // LISTENERS
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

            listenersRef.current.forEach(
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
    // REGISTER
    // ========================================

    const onHabitLogUpdated = useCallback(
        (
            callback: (
                payload: HabitLogUpdatedPayload
            ) => void
        ) => {

            listenersRef.current.add(
                callback
            );

            return () => {

                listenersRef.current.delete(
                    callback
                );
            };
        },
        []
    );

    return {
        connected,
        onHabitLogUpdated,
    };
};

export default useSignalR;
