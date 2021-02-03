<template>
  <div class="container">

    <vue-plyr :options="options" ref="plyr">
      <video controls playsinline>
        <source
          src="https://fluis-media.s3.fr-par.scw.cloud/Avatar/1/1.mp4"
          type="video/mp4"
        />
      </video>
    </vue-plyr>

  </div>
</template>

<script lang="ts">
/// Standard Vue/Nuxt modules
import Vue from 'vue'
import axios from '~/plugins/axios'

import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

export default Vue.extend({
  components: {
    VuePlyr
  },
  data: () => ({
    options: {
      controls: [
        'play-large',
        'play',
        'rewind',
        'fast-forward',
        'progress',
        'current-time',
        'mute', 'volume',
        'captions',
        'settings',
        'airplay',
        'fullscreen'
      ]
    }
  }),
  mounted() {
    //console.log(this.$refs.plyr.player.currentTime);
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  
}
</style>
