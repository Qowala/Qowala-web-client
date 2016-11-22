<template>
  <div>
    <ul id="conversations">
      <li class="conversation" v-for="conversation in conversations">
        <router-link :to="{ name: 'conversation', params: { conversationID: conversation.threadID , conversationName: conversation.name}}">
          <template v-if="conversation.imageSrc">
            <img v-bind:src="conversation.imageSrc" class="conversation-img"/>
          </template>
          <!-- Temporary placeholder if conversation has no image -->
          <template v-else>
            <div class="conversation-img-default"></div>
          </template>
          <div class="conversation-name">{{ conversation.name }}</div>
          <template v-if="conversation.snippet">
            <div class="conversation-snippet">{{ conversation.snippet }}</div>
          </template>
          <!-- Display images in snippet if there are some -->
          <template v-for="attachment in conversation.snippetAttachments">
            <template class="conversation-snippet-attachment" v-if="attachment.attach_type === 'photo' || attachment.attach_type === 'animated_image'">
              <img class="conversation-snippet-attachment" v-bind:src="attachment.thumbnail_url"/>
            </template>
            <template v-else>
              <img class="conversation-snippet-attachment" v-bind:src="attachment.url"/>
            </template>
          </template>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'conversations-list',
  data() {
    return {
      conversations: [],
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
      const notifMsg = 'Qowala: ' + msg;
      // Let's check whether notification permissions have already been granted
      if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(notifMsg);
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function requestPermission (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            var notification = new Notification(notifMsg);
          }
        });
      }

      // At last, if the user has denied notifications, and you
      // want to be respectful there is no need to bother them any more.
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
}

.conversation-img, .conversation-img-default {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  left: 20px;
}

.conversation-img-default {
  background-color: gray;
}

.conversation-name {
  position: relative;
  left: 60px;
  color: gray;
  font-size: 1.1em;
}

.conversation-snippet {
  position: relative;
  top: 10px;
  left: 60px;
  font-size: 1.2em;
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-snippet-attachment {
  position: relative;
  top: 10px;
  left: 60px;
}
</style>
