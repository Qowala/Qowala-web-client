<template>
  <div>
    <div class="conversation-header">
      <button v-on:click="returnBack"><i class="fa fa-arrow-left"></i></button><span class="conversation-name">{{ this.$route.params.conversationName }}</span>
    </div>
    <ul id="messages">
      <message v-bind:info="messageInfo" v-for="messageInfo in messages"></message>
    </ul>
    <form action="" v-on:submit.prevent="sendMsg">
      <input v-model="messageInput" autocomplete="off" />
      <button v-bind:class="{ enabled: isSendingEnabled }"><i class="fa fa-paper-plane-o"></i></button>
    </form>
  </div>
</template>

<script>
import Message from './Message';

export default {
  name: 'conversation-screen',
  components: {
    Message
  },
  data() {
    return {
      messageInput: '',
      messages: [],
      currentAvailability: localStorage.getItem('qowala-availability') || 'available',
      isWindowBlured: true
    };
  },
  computed: {
    isSendingEnabled: function () {
      return this.messageInput !== '';
    }
  },
  created: function () {
    // Set messages from cache
    const history = JSON.parse(localStorage.getItem('conversations-history'));
    if (history && history[this.$route.params.conversationID]) {
      this.messages = history[this.$route.params.conversationID];
    }

    const payload = {
      token: localStorage.getItem('qowala-token'),
      conversationID: this.$route.params.conversationID
    };
    this.$socket.emit('get/conversationHistory', payload);

    window.onblur = function() {
      this.isWindowBlured = true;
      console.log('blured: ', this.isWindowBlured);
    }

    window.onfocus = function() {
      this.isWindowBlured = false;
      console.log('blured: ', this.isWindowBlured);
    }
  },
  methods: {
    sendMsg: function sendMsg() {
      if (this.isSendingEnabled) {
        const payload = {
          token: localStorage.getItem('qowala-token'),
          msg: this.messageInput,
          conversationID: this.$route.params.conversationID
        };
        this.$socket.emit('chat message', payload);
        this.messageInput = '';
      }
    },
    returnBack: function returnBack() {
      this.$router.push('/');
    }
  },
	sockets: {
		'return/threadHistory': function (threadHistory) {
      this.messages = threadHistory;
      // Set history in localStorage as cache
      var history = JSON.parse(localStorage.getItem('conversations-history')) || {};
      history[this.$route.params.conversationID] = this.messages;
      localStorage.setItem('conversations-history', JSON.stringify(history));
		},
		'chat message': function (msg) {
      if (msg.conversationID === this.$route.params.conversationID){
        this.messages.push(msg);
      }
		},
    'need auth': function () {
      console.log('redirecting to login');
      this.$router.push('/login');
    },
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.conversation-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 20px;
  background-color: #3ad78d;
  color: white;
  padding: 10px;
  font-family: 'WorkSans-Bold', Arial, sans-serif;
  font-size: 1.2em;
  text-shadow: 0px 1px 2px #2da76e;
  z-index: 1;
}

.conversation-header button {
  margin-left: 5px;
  background: none;
  border: none;
  color: white;
  text-shadow: 0px 1px 2px #2da76e;
}

.conversation-header .conversation-name {
  margin-left: 20px;
}

form {
  background: #fff;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: calc(100% - 20px);
  text-align: center;
}

form input {
  border: 0;
  padding: 10px;
  width: 65%;
  height: 20px;
  margin-right: 5%;
  margin-left: 10px;
  background-color: #f0f0f0;
  border-radius: 20px;
  color: #4a4a4a;
  font-size: 1.25em;
  padding: 10px 20px;
}

form button {
  background: none;
  border: none;
  padding: 10px;
  color: #ccc;
  font-size: 1.4em;
  position: relative;
  top: 2px;
  right: 4px;
  border-radius: 50%;
}

form button.enabled {
  background-color: #3ad78d;
  color: white;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding-top: 40px;
  padding-bottom: 80px;
  background-color: #f0f0f0;
}
</style>
