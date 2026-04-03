// api/save-subscription.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // POSTメソッド以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const subscription = req.body;
    
    // 「user_subscription」という名前で、KVに保存する
    await kv.set('user_subscription', subscription);

    console.log('住所の保存に成功したぜ！');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('保存失敗:', error);
    res.status(500).json({ error: error.message });
  }
}