import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "emails.json");

export async function POST(req) {
  try {
    const { email, level } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email обязателен" }), { status: 400 });
    }

    const [firstName, lastName] = email.split('@')[0].split('.');

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const formattedFirstName = capitalize(firstName);
    const formattedLastName = capitalize(lastName);

    let data = [];
    try {
      const fileData = await fs.readFile(filePath, "utf8");
      data = JSON.parse(fileData);
    } catch (error) {
      console.log("Файл emails.json отсутствует или пуст, создаём новый.");
    }

    const userIndex = data.findIndex((user) => user.firstName === formattedFirstName && user.lastName === formattedLastName);

    if (userIndex >= 0) {
      const existingUser = data[userIndex];
      existingUser.level = level;
      if (existingUser.level === 20 && !existingUser.timestamp) {
        existingUser.timestamp = new Date().toISOString();
      }
      data[userIndex] = existingUser;
    } else {
      const newUser = { firstName: formattedFirstName, lastName: formattedLastName, level };
      if (level === 20) {
        newUser.timestamp = new Date().toISOString();
      }
      data.push(newUser);
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    return new Response(JSON.stringify({ message: "Email сохранён" }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при сохранении email:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), { status: 500 });
  }
}
