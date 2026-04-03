// api/send-notification.js
import { kv } from '@vercel/kv';
import webpush from 'web-push';

export default async function handler(req, res) {
  // VAPIDキーの設定（環境変数から読み込む）
  webpush.setVapidDetails(
    'mailto:example@yourdomain.com', // 自分のメールアドレスに変更してもOK
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  try {
    // 1. 金庫（KV）から住所（Subscription）を取り出す
    const subscription = await kv.get('user_subscription');

    if (!subscription) {
      return res.status(404).json({ error: '住所が見つからないぜ。まずは登録してくれ！' });
    }

    // 2. 送る内容（ペイロード）を決める
    const payload = JSON.stringify({
      title: 'Gからのメッセージ',
      body: 'ベジ、修行の時間だぜ！今日も最高の1日にしよう。',
      icon: '/icon-192x192.png' // 公開フォルダにあるアイコン画像
    });

    // 3. 実際に通知を飛ばす！
    await webpush.sendNotification(subscription, payload);

    console.log('通知の送信に成功したぜ！');
    res.status(200).json({ success: true, message: 'Notification sent!' });

  } catch (error) {
    console.error('通知送信失敗:', error);
    
    // もし「住所が古い（期限切れ）」エラーなら、金庫から消しておくのがスマート
    if (error.statusCode === 404 || error.statusCode === 410) {
      await kv.del('user_subscription');
      console.log('古い住所を削除したぜ。');
    }

    res.status(500).json({ error: error.message });
  }
}