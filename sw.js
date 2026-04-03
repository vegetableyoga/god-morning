// sw.js (サービスワーカー)

// 1. プッシュ通知を受け取った時の処理
self.addEventListener('push', function(event) {
  console.log('プッシュ通知を受信したぜ！');

  let data = { title: 'Gより', body: '修行の時間だ！' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Gより', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // アイコンのパスを確認
    badge: '/favicon.png',      // ステータスバーに出る小さなアイコン
    vibrate: [200, 100, 200],   // 振動パターン
    data: {
      url: '/' // タップした時に開くURL
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 2. 通知をタップした時の処理
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});