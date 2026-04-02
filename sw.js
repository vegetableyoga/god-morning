// sw.js - 裏方（Service Worker）の台本
self.addEventListener('install', (event) => {
  console.log('裏方が配属されました');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('裏方が活動を開始しました');
});

// 通知がクリックされた時の挙動
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // すでに開いていればそこにフォーカス、なければ新しく開く
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});