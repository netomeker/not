self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || 'Campanha Certeira';
  const options = {
    body: payload.body || 'Hora de agir na sua campanha.',
    icon: payload.icon || './icon-money.svg',
    badge: payload.badge || payload.icon || './icon-money.svg',
    tag: payload.tag || 'campanha-certeira-push',
    data: {
      clickUrl: payload.clickUrl || './index.html'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickUrl = event.notification?.data?.clickUrl || './index.html';

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const matchedClient = allClients.find((client) => client.url.includes(clickUrl));

    if (matchedClient) {
      matchedClient.focus();
      return;
    }

    await self.clients.openWindow(clickUrl);
  })());
});
