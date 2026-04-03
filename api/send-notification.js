// api/send-notification.js (デバッグ版)
import { kv } from '@vercel/kv';
import webpush from 'web-push';

export default async function handler(req, res) {
  // --- デバッグ開始 ---
  console.log('--- 環境変数のチェック ---');
  console.log('PUBLIC_KEYが存在するか:', !!process.env.VAPID_PUBLIC_KEY);
  console.log('PRIVATE_KEYが存在するか:', !!process.env.VAPID_PRIVATE_KEY);
  // --- デバッグ終了 ---

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(500).json({ 
      error: 'Vercelの環境変数が見つからないぜ。名前は合ってるのに不思議だな...' 
    });
  }

  webpush.setVapidDetails(
    'mailto:example@yourdomain.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  try {
    const subscription = await kv.get('user_subscription');
    if (!subscription) {
      return res.status(404).json({ error: '住所がないぜ' });
    }

    await webpush.sendNotification(subscription, JSON.stringify({
      title: 'Gより',
      body: '修行の時間だ！'
    }));

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}