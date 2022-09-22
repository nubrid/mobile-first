// TODO: https://developers.google.com/web/fundamentals/push-notifications/permission-ux
// self.addEventListener("push", event => {
//   const title = "Nubrid";
//   const options = {
//     body: event.data.text(),
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

workbox.skipWaiting()
workbox.clientsClaim()

workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest || [], {})

workbox.routing.registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/,
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  }),
)
