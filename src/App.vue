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
	height: 100%;
	overflow-x: hidden;
}
</style>
