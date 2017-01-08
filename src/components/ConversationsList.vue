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
      currentAvailability: localStorage.getItem('qowala-availability') || 'available',
      isWindowBlured: false
    };
  },
  beforeMount: function() {
    // Set conversations list from cache
    this.conversations = JSON.parse(localStorage.getItem('conversations-list'));

    const payload = {
      token: localStorage.getItem('qowala-token')
    };
    this.$socket.emit('get/conversations', payload);

    window.onblur = function() {
      this.isWindowBlured = true;
    }

    window.onfocus = function() {
      this.isWindowBlured = false;
    }
  },
  watch: {
    currentAvailability: function (availability) {
      const payload = {
        token: localStorage.getItem('qowala-token'),
        availability: availability
      };
      this.$socket.emit('put/availability', payload);
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
			if (this.currentAvailability === 'available' && this.isWindowBlured) {
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
  display: flex;
  flex-wrap: wrap;
  max-width: 100vw;
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
  position: fixed;
  display: flex;
  align-items: center;
  background-color: #fff;
  right: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 25px;
  padding: 10px 20px;
  box-shadow: 0px 6px 24px -3px rgba(0,0,0,.15);
}

.switch {
  position: relative;
  display: flex;
  align-items: center;
  width: 50px;
  height: 30px;
  background-color: #f0f0f0;
  margin-left: 20px;
  padding: 0px 5px;
  border-radius: 50px;
  transition: all .5s ease;
}

.switch::before {
  content: 'ON';
  left: 5px;
  color: #3AD78D;
}

.switch::after {
  content: 'OFF';
  right: 5px;
  color: #d9d9d9;
}

.switch::after, .switch::before {
  position: absolute;
  font-size: 9px;
  font-family: 'WorkSans-Bold';
}

input#availability-toggle {
  opacity: 0;
}

.switch label {
  z-index: 2;
  position: absolute;
  background: #d9d9d9;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  transition: all .5s ease;
  cursor: pointer;
}

.switch input[type=checkbox]:checked + label {
   left: 35px;
   background-color: #3AD78D;
 }

</style>
