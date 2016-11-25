<template>
  <li v-bind:class="{ 'me-message': info.isSenderUser, 'other-message': !info.isSenderUser }" v-bind:title="info.timestampDatetime">
     {{ info.senderName }}: {{ info.body }}
    <template v-for="attachment in info.attachments">
      <template v-if="attachment.type === 'sticker'">
        <img v-bind:src="attachment.url"  v-bind:width="attachment.width"/>
      </template>
      <template v-if="attachment.type === 'photo' || attachment.type === 'animated_image'">
        <a v-bind:href="attachment.previewUrl">
          <img v-bind:src="attachment.thumbnailUrl" v-bind:alt="attachment.name"/>
        </a>
      </template>
      <template v-if="attachment.type === 'video'">
        <video v-bind:src="attachment.url" width="150px" controls/></video>
      </template>
      <template v-else>
        <img v-bind:src="attachment.image" v-bind:alt="attachment.title" width="150px"/>
      </template>
    </template>

    <div class="message-time">{{ info.timestampDatetime }}</div>
  </li>
</template>

<script>
export default {
  name: 'message',
  props: ['info'],
  data() {
    return {
      conversations: [],
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#messages li {
  padding: 20px;
  background-color: white;
  margin: 25px 70px 5px 50px;
  border-radius: 5px 15px 15px 15px;
  position: relative;
}

#messages li.me-message {
  margin: 25px 50px 5px 70px;
  border-radius: 15px 5px 15px 15px;
  background-color: #3ad78d;
  color: white;
  text-align: right;
}

#messages li.me-message + li.other-message {
  margin: 45px 70px 5px 50px;
}

#messages li.other-message + li.me-message {
  margin: 45px 50px 5px 70px;
}

.message-time {
  position: absolute;
  bottom: -20px;
  color: #a8a8a8;
}

li.me-message .message-time {
  right: 20px;
}
</style>
