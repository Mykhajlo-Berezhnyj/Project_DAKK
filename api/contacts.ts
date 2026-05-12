export type Req = {
  method: string;
  body: {
    requestId: number;
    name: string;
    phone: string;
    message: string;
    type: string;
  };
};

export type Res = {
  status: (code: number) => Res;
  json: (data: any) => void;
};

const processRequest = new Set<number>();

export default async function sendMessage(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method not allowed",
    });
  }
  const { requestId, name, phone, message, type } = req.body;
  if (processRequest.has(requestId)) {
    return res.status(200).json({
      ok: true,
      duplicate: true,
    });
  }
  const botToken = process.env.BOT_TOKEN;
  console.log("🚀 ~ sendMessage ~ botToken:", botToken);
  const chatID = process.env.CHAT_ID;
  console.log("🚀 ~ sendMessage ~ chatID:", chatID);

  const text = `
       📝 Нове звернення:
        👤 : ${name}
        📞: ${phone}
        💬: ${message}
        👥: ${type}
    `;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatID,
        text,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Взяти в роботу", callback_data: "take_job" }],
            // [
            //   {
            //     text: "Відкрити Crisp",
            //     url: `https://project-dakk.vercel.app/open-crisp?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}`,
            //   },
            // ],
          ],
        },
      }),
    });

    console.log("🚀 ~ sendMessage ~ data:", data);
    const result = await data.json();
    console.log("🚀 ~ sendMessage ~ result:", result);

    if (!result.ok) {
      throw new Error(result.description || "Telegram send error");
    }
    processRequest.add(requestId);
    return res.status(200).json({ ok: true, result: data });
  } catch (error) {
    console.log("🚀 ~ sendMessage ~ error:", error);
    return res
      .status(500)
      .json({ error: "Failed to send message", details: error });
  }
}
