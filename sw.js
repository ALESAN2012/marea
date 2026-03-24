// Marea Agenda — Service Worker v3.0
const CACHE = 'marea-v3';
const CORE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (!res || res.status !== 200) return res;
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => e.request.destination === 'document' ? caches.match('./index.html') : undefined))
  );
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.title || 'Marea', {
    body: d.body || 'Tienes un recordatorio',
    icon: '🌊', badge: '🌊',
    vibrate: [200, 100, 200],
    tag: d.tag || 'marea-notif',
    renotify: true,
    actions: [{ action: 'view', title: 'Ver' }, { action: 'dismiss', title: 'Descartar' }]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    for (const c of cs) if ('focus' in c) return c.focus();
    if (clients.openWindow) return clients.openWindow('/');
  }));
});
