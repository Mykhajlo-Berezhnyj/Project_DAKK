import { Req, Res } from "./contacts";

type TelegramUpdate = {
  callback_query?: {
    id: string;
    from: { id: number; first_name: string; username?: string };
    message: {
      message_id: number;
      chat: { id: number; type: string };
      text: string;
    };
    data?: string;
  };
  message?: any;
};

export default async function webhook(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const update: TelegramUpdate = req.body;

  if (update.callback_query) {
    const user = update.callback_query.from;
    const chatId = update.callback_query.message.chat.id;
    const messageId = update.callback_query.message.message_id;
    const newText = `${update.callback_query.message.text} \n В роботі ${user.first_name}`;
    const editUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/editMessageText`;

    await fetch(editUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
      }),
    });
  }

  return res.status(200).json({ ok: true });
}
