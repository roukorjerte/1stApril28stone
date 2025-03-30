import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "emails.json");

export async function GET(req) {
  try {
    // Читаем файл с данными
    const fileData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileData);

    // Отправляем данные в виде ответа
    return new Response(
      JSON.stringify({ data }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при чтении файла:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении данных" }),
      { status: 500 }
    );
  }
}
