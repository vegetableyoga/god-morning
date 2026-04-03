// api/send-notification.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 現在サーバーが見えている「すべての名前」をリストアップする
  const allKeys = Object.keys(process.env);
  
  // VAPID や KV が含まれる名前だけを抽出（セキュリティのため値は見ない）
  const targetKeys = allKeys.filter(k => 
    k.includes('VAPID') || k.includes('KV') || k.includes('VERCEL')
  );
  
  console.log('--- 捜査報告：見えている鍵のリスト ---');
  console.log(targetKeys);

  return res.status(200).json({ 
    found_keys: targetKeys,
    vapid_public_exists: !!process.env.VAPID_PUBLIC_KEY,
    vapid_private_exists: !!process.env.VAPID_PRIVATE_KEY,
    message: "この画面の found_keys の中に VAPID_... が入っているか確認してくれ！"
  });
}