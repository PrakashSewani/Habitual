import { useEffect, useState } from "react";

type ClientOnlyProps = {
    children: React.ReactNode;
};

const ClientOnly = ({
    children,
}: ClientOnlyProps) => {
    const [mounted, setMounted] =
        useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <>{children}</>;
};

export default ClientOnly;