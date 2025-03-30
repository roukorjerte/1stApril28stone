import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "emails.json");

export async function POST(req) {
    try {
        const { email, level } = await req.json();
        if (!email) {
            return new Response(JSON.stringify({ error: "Email обязателен" }), { status: 400 });
        }

        // Читаем текущий файл
        let data = [];
        try {
            const fileData = await fs.readFile(filePath, "utf8");
            data = JSON.parse(fileData);
        } catch (error) {
            console.log("Файл emails.json отсутствует или пуст, создаём новый.");
        }

        // Находим запись для данного email
        const userIndex = data.findIndex((user) => user.email === email);

        if (userIndex >= 0) {
            // Если пользователь уже существует, обновляем его данные
            const existingUser = data[userIndex];

            // Обновляем уровень
            existingUser.level = level;

            // Если достигнут уровень 15, добавляем или обновляем timestamp
            if (existingUser.level === 5 && !existingUser.timestamp) {
                existingUser.timestamp = new Date().toISOString();
            }

            // Обновляем запись в массиве
            data[userIndex] = existingUser;
        } else {
            // Если пользователя нет в базе, добавляем новый
            const newUser = { email, level };

            // Если уровень сразу 15, добавляем timestamp
            if (level === 5) {
                newUser.timestamp = new Date().toISOString();
            }

            data.push(newUser);
        }

        // Записываем обновлённый массив данных обратно в JSON
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

        return new Response(JSON.stringify({ message: "Email сохранён" }), { status: 200 });
    } catch (error) {
        console.error("Ошибка при сохранении email:", error);
        return new Response(JSON.stringify({ error: "Ошибка сервера" }), { status: 500 });
    }
}
