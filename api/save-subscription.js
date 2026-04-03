// api/save-subscription.js
const { kv } = require('@vercel/kv');

export default async function handler(req, res) {
  // POSTメソッド以外は受け付けないぜ
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const subscription = req.body;
    
    // 「user_subscription」という名前で、宇宙のメモ帳（KV）に保存する！
    // 本来はユーザーIDごとに分けるけど、今はベジ専用だから1つでOKだ。
    await kv.set('user_subscription', subscription);

    console.log('住所の保存に成功したぜ！');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('保存失敗:', error);
    res.status(500).json({ error: error.message });
  }
}