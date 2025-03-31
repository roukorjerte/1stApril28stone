"use client";

import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.css";  // Импортируем CSS-модуль

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Запрашиваем данные с API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/recordsTable");
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        setData(result.data);  // Обработка полученных данных
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  // Сортировка данных: по уровню сначала, если уровни одинаковые - по timestamp
  const sortedData = [...data].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (a.timestamp && b.timestamp) return new Date(a.timestamp) - new Date(b.timestamp);
    return 0;
  });

  // Функция для выбора нужного класса для SVG
  const getTrophyClass = (place) => {
    switch (place) {
      case 1:
        return styles.gold;
      case 2:
        return styles.silver;
      case 3:
        return styles.bronze;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
        <div className ={styles.white_container}>
            <div className ={styles.title}>
                <h3 className={styles.h3}> Congratulations to all participants! </h3>
            </div>
            <table className={styles.table}>
            <thead className={styles.theadCustom}>
            <tr className={styles.level_container}>
                <th className={styles.number}>Place</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Surname</th>
                <th className={styles.number}>Level</th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((user, index) => (
                <tr key={index}>
                <td className={styles.number}>
                {index + 1 + "  "}
                {index < 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className={`${getTrophyClass(index + 1)} trophy`} viewBox="0 0 16 14">
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
                    </svg>
                )}
                </td>                <td className={styles.td}>{user.firstName}</td>
                <td className={styles.td}>{user.lastName}</td>
                <td className={styles.number}>{user.level}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default Leaderboard;
