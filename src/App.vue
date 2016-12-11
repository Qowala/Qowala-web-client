<template>
  <div id="app">
    <router-view></router-view>
    {{ this.subscription }}
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      subscription: {},
    };
  },
  created: function () {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');

      var endpoint;
      var key;
      var authSecret;
      const applicationServerPublicKey = 'BP5DsTGZtwA4cqV1vgTggxDdy-6fBY5I--_3fPCHAir9kUS5rR_vAzHKc0htxxGx_sFz-02liGu8PgoZr9DEr3Y';

      // Register a Service Worker.
      navigator.serviceWorker.register('static/service-worker.js')
      .then(function(registration) {
      console.log('youhou, registered');
        // Use the PushManager to get the user's subscription to the push service.
        return registration.pushManager.getSubscription()
        .then(function(subscription) {
          // If a subscription was found, return it.
          if (subscription) {
            console.log('already a subscription: ', subscription);
            return subscription;
          }

          function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
              .replace(/\-/g, '+')
              .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
          }

          const convertedVapidKey = urlBase64ToUint8Array(applicationServerPublicKey);
          // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
          // send notifications that don't have a visible effect for the user).
          return registration.pushManager.subscribe({ userVisibleOnly: true,
          applicationServerKey: convertedVapidKey});
        });
      }).then(function(subscription) {
        // Retrieve the user's public key.
        console.log('retrieving user key...');

        this.subscription = subscription;
        console.log('subscription added: ', subscription);

        const payload = {
          subscription: subscription,
          notification: {
            title: 'Bob',
            body: 'heeeey it should work',
            icon: '/static/img/favicon.png'
          }
        };

        this.$socket.emit('swSendNotification', payload);
      }.bind(this))
      .catch(function(error) {
        console.error('Service Worker Error: ', error);
      });
    } else {
      console.warn('Push messaging is not supported');
    }
  },
	sockets: {
		'err': function(err) {
			console.log('An error occured: ', err);
		},
    'auth failed': function(err) {
      console.log('redirecting to login');
      this.$router.push('/login');
    }
	}
};
</script>

<style>
html, body{ margin:0; padding:0; height:100%; width:100%; }
body { font: 13px 'WorkSans-Regular', Arial, sans-serif; }
#app {
  height: 100%;
  overflow-x: hidden;
}
</style>
