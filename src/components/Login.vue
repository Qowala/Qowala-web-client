<template>
  <div id="login-screen">
    <img src="~assets/img/logo-white.png"/>
    <h1>Welcome to Qowala!</h1>
    <p>For starters, use your credentials to log in your preferred messaging app</p>
    <form action="" v-on:submit.prevent="sendCredentials">
      <label for="email">
        Email address
      </label>
      <input type="text" name="email" placeholder="Email address" autofocus v-model="email" />
      <label for="password">
        Password
      </label>
      <input type="password" name="password" placeholder="Password" v-model="password"/>
      <input id="submit" type="submit" value="Log in"/>
    </form>
    <div id="loading" v-if="loading">Login...</div>
    <div id="loading-failed" v-if="failed">Login failed!</div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      failed: false
    };
  },
  methods: {
    sendCredentials: function() {
      const credentials = {
        email: this.email,
        password: this.password
      };
      this.$socket.emit('login', credentials);
      this.failed = false;
      this.loading = true;
      this.email = '';
      this.password = '';
    },
    subscribeSw: function(token) {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        const applicationServerPublicKey = 'BP5DsTGZtwA4cqV1vgTggxDdy-6fBY5I--_3fPCHAir9kUS5rR_vAzHKc0htxxGx_sFz-02liGu8PgoZr9DEr3Y';

        // Register a Service Worker.
        navigator.serviceWorker.register('static/service-worker.js')
        .then(function(registration) {
          console.log('youhou, registered');

          // Force update of service worker
          registration.update();

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
            },
            token: token
          };

          this.$socket.emit('swSendNotification', payload);
        }.bind(this))
        .catch(function(error) {
          console.error('Service Worker Error: ', error);
        });
      } else {
        console.warn('Push messaging is not supported');
      }
    }
  },
  sockets: {
    'login ok': function (payload) {
      this.loading = false;
			localStorage.setItem('qowala-token', payload.token);
      localStorage.setItem('qowala-availability', payload.availability);
      console.log('redirecting to conversations list');
      // Subsribe to service worker to get notifications
      this.subscribeSw(payload.token);
      this.$router.push('/');
    },
    'login failed': function () {
      this.loading = false;
      this.failed = true;
      console.log('Login failed! ');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login-screen h1,
#login-screen p,
#login-screen #loading,
#login-screen #loading-failed {
  text-align: center;
  color: white;
}

#login-screen h1 {
  margin-bottom: 20px;
  font-family: 'WorkSans-Bold', Arial, sans-serif;
  font-size: 1.6em;
}

#login-screen p {
  margin-bottom: 20px;
}

#login-screen {
  background-color: #3AD78D;
  padding: 40px;
  height: 100%;
}

#login-screen img {
  width: 100px;
  margin: 20px auto 40px;
  display: block;
}

#login-screen label,
#login-screen input[type="text"],
#login-screen input[type="password"],
#login-screen input[type="text"]::placeholder,
#login-screen input[type="password"]::placeholder {
  color: white;
}

#login-screen label,
#login-screen input[type="text"]::placeholder,
#login-screen input[type="password"]::placeholder {
  text-transform: uppercase;
  font-size: 0.6em;
  font-family: 'WorkSans-Bold', Arial, sans-serif;
}

#login-screen label {
  display: block;
  width: 130px;
  margin: 10px auto 0;
  position: relative;
  right: 65px;
}

#login-screen input[type="text"]::placeholder,
#login-screen input[type="password"]::placeholder {
  color: #98ECC4;
  position: relative;
  right: 12px;
  bottom: 6px;
}

#login-screen form input {
  display: block;
  margin: 5px auto 0;
  width: 260px;
  background-color: #3AD78D;
  height: 30px;
  border-radius: 5px;
  border: solid 2px white;
}

#login-screen form input:focus {
  -moz-box-shadow:    0px 5px 16px 1px #19B96D;
  -webkit-box-shadow: 0px 5px 16px 1px #19B96D;
  box-shadow:         0px 5px 16px 1px #19B96D;
}

#login-screen input[type="text"],
#login-screen input[type="password"] {
  font-size: 0.9em;
  padding-left: 20px;
  font-family: 'WorkSans-Bold', Arial, sans-serif;
}

#login-screen input[type="submit"] {
  background-color: white;
  color: #3AD78D;
  width: 100px;
  margin-top: 40px;
  font-family: 'WorkSans-Bold', Arial, sans-serif;
  font-size: 0.9em;
}

#login-screen #loading,
#login-screen #loading-failed {
  margin-top: 20px;
}

</style>
