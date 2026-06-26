"use client";

import { useEffect, useState } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
};

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/me");
            const data = await res.json();

            setUser(data.user);
            setLoading(false);
        };

        fetchUser();
    }, []);

    return { user, loading };
}
