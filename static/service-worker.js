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

self.addEventListener('notificationclick', function(event) {
  // Android doesn't close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // XXX This should be able to focus when tab already opened,
  // but it currently always open a window.
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
