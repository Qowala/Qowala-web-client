<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
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
body { font: 13px Helvetica, Arial; }
#app {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
