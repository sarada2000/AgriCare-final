/* AgriCare service worker
   Lets alarm notifications show on Android, and opens AgriCare when a notification is tapped.
   Must sit in the site's root folder (next to index.html). */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", event => {
    event.notification.close();
    const target = new URL((event.notification.data && event.notification.data.url) || "pages/monitor.html", self.registration.scope).href;
    event.waitUntil((async () => {
        const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        // focus an open AgriCare tab if there is one
        for (const c of all) {
            if (c.url.startsWith(self.registration.scope) && "focus" in c) {
                await c.focus();
                if ("navigate" in c && !c.url.includes("monitor.html")) { try { await c.navigate(target); } catch (e) {} }
                return;
            }
        }
        if (self.clients.openWindow) await self.clients.openWindow(target);
    })());
});
