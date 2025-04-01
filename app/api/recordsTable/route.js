import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "emails.json");

const API_KEY = "diana-dima-bonya-2024-AuGuSt";

export async function GET(req) {
  try {
    // Проверяем API-ключ
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      return new Response(JSON.stringify({ error: "Хватит ломать мой сайт!!!>_<" }), { status: 403 });
    }

    // Читаем файл с данными
    const fileData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileData);

    // Отправляем данные в виде ответа
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при чтении файла:", error);
    return new Response(JSON.stringify({ error: "Ошибка при получении данных" }), { status: 500 });
  }
}
