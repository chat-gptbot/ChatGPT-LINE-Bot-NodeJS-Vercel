import { Client } from '@line/bot-sdk';
import OpenAI from 'openai';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;

        // ChatGPTに投げる！
        const chatResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage }],
        });

        const replyText = chatResponse.choices[0].message.content;

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
