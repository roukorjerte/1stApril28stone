'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
    const [email, setEmail] = useState("");
    const caretPos = useRef();
    const ref = useRef(null);

    function getCaretPosition(el) {
        if (el.selectionStart || el.selectionStart === '0') {
            return {
                start: el.selectionStart,
                end: el.selectionEnd
            };
        }
        return { start: 0, end: 0 };
    }

    function setCaretPosition(el, pos) {
        if (el && pos && el.setSelectionRange) {
            el.setSelectionRange(pos.start, pos.end);
        }
    }

    function handleChange(e) {
        caretPos.current = getCaretPosition(ref.current);
        setEmail(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Предотвращаем переход на новую строку
            handleLogin(); // Теперь Enter вызывает handleLogin
        }
    }

    useEffect(() => {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
        setCaretPosition(ref.current, caretPos.current);
    }, [email]);

    async function handleLogin() {
        try {
            localStorage.setItem("userEmail", email);

            const response = await fetch("/api/saveEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, level: 0 })
            });

            if (response.ok) {
                window.location.href = "/changePassword";
            } else {
                alert("Ошибка в поиске никнейма");
            }
        } catch (error) {
            console.error("Ошибка в запросе:", error);
            alert("Ошибка, невозможно залогиниться");
        }
}
    

    return (
        <>
            <div className={styles.container}>
                <div className={styles.white_container}>
                    <div className={styles.title}>
                        <Image
                            src="/jeka.png"
                            layout="intrinsic"
                            width={312}
                            height={118}
                            alt="logo"
                            className="responsive-logo"
                        />
                    </div>

                    <textarea
                        id="pswdbox"
                        className={styles.pswdbox}
                        value={email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        style={{ resize: 'none', width: "100%", overflowY: 'hidden' }}
                        spellCheck="false"
                        placeholder="Введите ваш Ник в Telegram"
                        ref={ref}
                    />

                    <button className={`${styles.logInBtn} button`} onClick={handleLogin}>
                        Log in
                    </button>

                </div>
            </div>
        </>
    );
}
