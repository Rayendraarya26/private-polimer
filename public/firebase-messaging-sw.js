importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.setConfig({
    debug: false
});

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

registerRoute(
    ({ url }) =>
        url.pathname.startsWith('/assets/css/') ||
        url.pathname.startsWith('/assets/fontawesome/') ||
        url.pathname.startsWith('/assets/media/') ||
        url.pathname.startsWith('/assets/plugins/'),
    new CacheFirst({
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] })
        ],
    })
);

registerRoute(
    ({ url }) =>
        url.pathname.startsWith('/assets/js/'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] })
        ],
    })
);

self.addEventListener('push', function (event) {
    console.log(event)
    const a = event.data.json();
    const title = a.data.title;
    const options = {
        body: a.data.body,
        vibrate: [200, 100, 200],
        icon: 'https://polimer.bbkkp.kemenperin.go.id/assets/media/logos/logo-only.png',
        badge: 'https://polimer.bbkkp.kemenperin.go.id/assets/media/logos/logo-only.png',
        data: {
            url: a.data.url
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    if (event.notification.data != null) {
        event.notification.close();
        clients.openWindow(event.notification.data.url);
    }
});
