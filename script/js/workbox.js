export function registerServiceWorkers() {
  if ("serviceWorker" in navigator)
    window.addEventListener("load", () =>
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then(registration => {
          if (__DEV__)
            // eslint-disable-next-line
            console.log(
              "ServiceWorker registered: ",
              registration,
            );
          // TODO: https://developers.google.com/web/fundamentals/push-notifications/permission-ux
          // registration.pushManager.subscribe({ userVisibleOnly: true });
        })
        .catch(error => {
          if (__DEV__) console.log("ServiceWorker registration failed: ", error) // eslint-disable-line no-console
        }),
    )
}

export function unregisterServiceWorkers() {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.ready.then(registration =>
      registration.unregister(),
    )
}
