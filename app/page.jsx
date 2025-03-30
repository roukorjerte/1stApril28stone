"use client"; // Обязательно, если используешь хуки

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/loginPage");
    }, []);

    return null;
}
