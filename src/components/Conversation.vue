<template>
  <div>
    <template v-if="info.imageSrc">
      <img v-bind:src="info.imageSrc" class="conversation-img"/>
    </template>
    <!-- Temporary placeholder if conversation has no image -->
    <template v-else>
      <div class="conversation-img-default"></div>
    </template>
    <div class="conversation-name">{{ info.name }}</div><div class="conversation-time">{{ this.timedelta }}</div>
    <template v-if="info.snippet">
      <div class="conversation-snippet">{{ info.snippet }}</div>
    </template>
    <!-- Display images in snippet if there are some -->
    <template v-for="attachment in info.snippetAttachments">
      <template class="conversation-snippet-attachment" v-if="attachment.attach_type === 'photo' || attachment.attach_type === 'animated_image'">
        <img class="conversation-snippet-attachment" v-bind:src="attachment.thumbnail_url"/>
      </template>
      <template v-else>
        <img class="conversation-snippet-attachment" v-bind:src="attachment.url"/>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'conversation',
  props: ['info'],
  data() {
    return {
      conversations: [],
    };
  },
  computed:  {
    timedelta: function() {
      // Property displays time delta like "6h ago"

      const one_day=1000*60*60*24;
      const one_hour=1000*60*60;
      const one_minute=1000*60;
      const conversationDate = new Date(this.info.timestamp);
      const today = new Date();

      // Calculate time delta from conversation to now
      const timeDelta = (today.getTime()-conversationDate.getTime());

      // Choose best unit to display according to time delta
      const timeDeltaMinutes = timeDelta/(one_minute);
      if (timeDeltaMinutes > 60) {
        const timeDeltaHours = timeDelta/(one_hour);
        if (timeDeltaHours > 24) {
          const timeDeltaDays = timeDelta/(one_day);
          return Math.ceil(timeDeltaDays) + 'd ago';
        }
        return Math.ceil(timeDeltaHours) + 'h ago';
      }
      return Math.ceil(timeDeltaMinutes) + 'm ago';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
	overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60%;
}

.conversation-time {
  position: absolute;
  right: 55px;
  top: 20px;
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
