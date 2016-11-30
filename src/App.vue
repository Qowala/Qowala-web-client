<template>
  <div id="app">
    <div class="connection-info" v-show="disconnected">
      Houston! We lost the connection!
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      disconnected: false
    };
  },
	sockets: {
		'err': function(err) {
			console.log('An error occured: ', err);
		},
    'auth failed': function(err) {
      console.log('redirecting to login');
      this.$router.push('/login');
    },
    'connect': function(err) {
      console.log('Connected');
      this.disconnected = false;
    },
    'disconnect': function(err) {
      console.log('Got disconnected');
      this.disconnected = true;
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

.connection-info {
  position: fixed;
  padding: 10px;
  top: 50px;
  width: 80%;
  left: 10%;
  background-color: #f0f0f0;
  color: black;
  z-index: 1;
}
</style>
