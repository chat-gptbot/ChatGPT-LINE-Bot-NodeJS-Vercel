import { Client, middleware } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const events = req.body.events;

    // 複数イベントをループ（基本は1件）
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;

        // ChatGPTへ問い合わせ（ダミー応答にしておく）
        const replyText = `あなたのメッセージ: ${userMessage}`;

        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: replyText,
        });
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('エラー:', error);
    return res.status(500).send('Internal Server Error');
  }
}
