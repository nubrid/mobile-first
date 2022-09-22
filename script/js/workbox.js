export async function registerServiceWorkers() {
  if ("serviceWorker" in navigator) {
    const { Workbox } = await import("workbox-window")
    const workbox = new Workbox("./serviceWorker.js")

    workbox.addEventListener("activated", event => {
      if (__DEV__)
        // eslint-disable-next-line no-console
        console.log("ServiceWorker activated: ", event)
    })
    workbox.addEventListener("waiting", event => {
      if (__DEV__)
        // eslint-disable-next-line no-console
        console.log("ServiceWorker waiting for activation: ", event)
    })
    workbox.register()
  }
  // TODO: pre-workbox v4
  // if ("serviceWorker" in navigator)
  //   window.addEventListener("load", () =>
  //     navigator.serviceWorker
  //       .register("./serviceWorker.js")
  //       .then(registration => {
  //         if (__DEV__)
  //           // eslint-disable-next-line no-console
  //           console.log(
  //             "ServiceWorker registered: ",
  //             registration,
  //           );
  //         // TODO: https://developers.google.com/web/fundamentals/push-notifications/permission-ux
  //         // registration.pushManager.subscribe({ userVisibleOnly: true });
  //       })
  //       .catch(error => {
  //         if (__DEV__) console.log("ServiceWorker registration failed: ", error) // eslint-disable-line no-console
  //       }),
  //   )
}

export function unregisterServiceWorkers() {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.ready.then(registration =>
      registration.unregister(),
    )
}
