"use client";

import {
    useSyncExternalStore,
} from "react";

type ClientOnlyProps = {
    children: React.ReactNode;
};

const emptySubscribe = () => {
    return () => { };
};

const ClientOnly = ({
    children,
}: ClientOnlyProps) => {

    const isClient =
        useSyncExternalStore(
            emptySubscribe,
            () => true,
            () => false
        );

    if (!isClient) {
        return null;
    }

    return <>{children}</>;
};

export default ClientOnly;