// ============================================================
// 旧カスタムSW: Flutter SW と競合するため廃止
// このファイルは過去に /sw.js を登録したクライアントの SW を
// 安全に解除するための no-op として残している
// ============================================================

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() =>
      self.clients.matchAll().then((clients) => {
        clients.forEach((c) => c.navigate(c.url));
      })
    )
  );
});
