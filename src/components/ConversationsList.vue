<template>
  <div>
    <div class="availability-header">Right now you are <span class="availability-status">{{ currentAvailability }}</span></div>
    <ul id="conversations">
      <li class="conversation" v-for="conversationInfo in conversations">
        <router-link :to="{ name: 'conversation', params: { conversationID: conversationInfo.threadID , conversationName: conversationInfo.name}}">
          <conversation v-bind:info="conversationInfo"></conversation>
        </router-link>
      </li>
    </ul>
    <div class="availability-setting">
      Right now you are {{ currentAvailability }}
      <div class="switch">
        <input id="availability-toggle" type="checkbox" v-model="currentAvailability" true-value="available" false-value="unavailable">
        <label for="availability-toggle"></label>
      </div>
    </div>
  </div>
</template>

<script>
import Conversation from './Conversation';

export default {
  name: 'conversations-list',
  components: {
    Conversation
  },
  data() {
    return {
      conversations: [],
      currentAvailability: localStorage.getItem('qowala-availability') || 'available'
    };
  },
  beforeMount: function() {
    // Set conversations list from cache
    this.conversations = JSON.parse(localStorage.getItem('conversations-list'));

    const payload = {
      token: localStorage.getItem('qowala-token')
    };
    this.$socket.emit('get/conversations', payload);
  },
  watch: {
    currentAvailability: function (availability) {
      localStorage.setItem('qowala-availability', this.currentAvailability);
    }
  },
  methods: {
    sendMsg: function sendMsg() {
			const payload = {
				token: localStorage.getItem('qowala-token'),
				msg: this.messageInput
			};
      this.$socket.emit('chat message', payload);
      this.messageInput = '';
    },
    notifyMe: function notifyMe(msg) {
      const options = {
        body: msg,
        icon: '/static/img/favicon.png'
      }

      Notification.requestPermission().then(function(result) {
        console.log(result);
      });

      const notification = new Notification('New message:', options);
    }
  },
	sockets: {
		'return/threadlist': function (threadList) {
      console.log('received thread list: ', threadList);
      this.conversations = threadList;
      // Set conversation list in localStorage as cache
      localStorage.setItem('conversations-list', JSON.stringify(threadList));
		},
		'chat message': function (msg) {
      // Reload thread list when new message
      const payload = {
        token: localStorage.getItem('qowala-token'),
      };
      this.$socket.emit('get/conversations', payload);

			// Send notification only if user available
			if (this.currentAvailability === 'available') {
				this.notifyMe(msg.body);
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
.availability-header {
  background-color: #3AD78D;
  height: 20px;
  padding: 10px;
  text-align: center;
  color: #b0efd1;
  font-size: 1.2em;
}

.availability-header .availability-status {
  color: white;
  text-shadow: 0px 2px 3px #2da76e;
}

#conversations {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

#conversations a {
  text-decoration: none;
  color: black;
}

.conversation {
  display: inline-block;
  padding: 20px;
  position: relative;
  width: 100%;
	height: 35px;
}

.availability-setting {
  width: 60%;
  background-color: #f0f0f0;
  border-radius: 25px;
  padding: 10px 30px;
  position: fixed;
  bottom: 10px;
  left: calc((40% - 60px) / 2);
}
</style>
