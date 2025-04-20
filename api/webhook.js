import { Client } from '@line/bot-sdk'; // LINE SDKのインポート
import openai from 'openai'; // OpenAIのインポート

const client = new Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body.events[0];
    const userMessage = body.message.text;
    const replyToken = body.replyToken;

    // OpenAIのAPI呼び出し
    const openaiResponse = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    // OpenAIの応答をLINEに返信
    const message = openaiResponse.choices[0].message.content;

    await client.replyMessage(replyToken, {
      type: 'text',
      text: message,
    });

    res.status(200).send('OK');
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
