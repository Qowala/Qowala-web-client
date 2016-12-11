// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  try {
    var payload = event.data.json();
  }
  catch (e) {
    var payload = {
      title: 'Empty title',
      body: 'no payload',
      icon: '/static/img/favicon.png'
    };
  }

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon
    })
  );
});
