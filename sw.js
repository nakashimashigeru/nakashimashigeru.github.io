// ============================================================
// OtakuIQ Service Worker — オフラインフォールバック
//
// 役割:
//   - offline.html をインストール時にキャッシュ
//   - ナビゲーションリクエストがネットワーク失敗した場合に offline.html を返す
//   - それ以外のリクエストはネットワークに委譲
//     （Flutter生成の flutter_service_worker.js がアセットをキャッシュする）
//
// ビルド時の注意:
//   flutter build web --pwa-strategy=offline-first を使用すると
//   Flutter がアセット用 SW を生成し、本 SW と並行して動作する。
// ============================================================

const CACHE_NAME = 'otakuiq-offline-v1';
const OFFLINE_URL = '/offline.html';

// ── Install: offline.html をキャッシュ ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// ── Activate: 古いキャッシュを削除 ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: ナビゲーション失敗時に offline.html へフォールバック ──
self.addEventListener('fetch', (event) => {
  // HTMLナビゲーションリクエストのみ対象
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(OFFLINE_URL)
    )
  );
});
