<template>
  <div class="container">
    <div class="back"></div>

    <vue-plyr :options="options" ref="plyr">
      <video controls playsinline>
        <source ref="videoSource"
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

//@ts-ignore
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
    },

    firstPlay: true,
    startTime: 0,
    watchingAJAX: false
  }),
  mounted() {
    this.loadData();

    /// 
    //@ts-ignore
    this.$refs.plyr.player.on('playing', () => {
      if (this.firstPlay) {
        //@ts-ignore
        this.$refs.plyr.player.currentTime = this.startTime;
        this.firstPlay = false;
      }

      this.nowPlaying();
    });
  },
  methods: {
    nowPlaying() {
      
      let sendRec = () => setTimeout( () => {
        var urlType;
        (this.$route.params.type == 's') ? urlType = "shows" : urlType = "movies";

        console.log("Start Update");
        
        //@ts-ignore
        if (this.$refs.plyr.player.playing && !this.watchingAJAX) {
          this.watchingAJAX = true;
          axios({
            method: 'post',
            url: "watchTime",
            data: {
              type: urlType,
              //@ts-ignore
              login: $cookies.get('SNID'),
              id: this.$route.params.id,
              //@ts-ignore
              time: Math.floor(this.$refs.plyr.player.currentTime)
            }
          })
          .then( (r) => {
            console.log("Updated time");
            this.watchingAJAX = false;

            //@ts-ignore
            if (this.$refs.plyr.player.playing) {
              sendRec();
            }
          })
          .catch( (error) => {
            alert(error);
            this.watchingAJAX = false;

            //@ts-ignore
            if (this.$refs.plyr.player.playing) {
              sendRec();
            }
          })
        }
      }, 10000);

      sendRec();

    },
    loadData() {
      var urlType: String;
      (this.$route.params.type == 's') ? urlType = "shows" : urlType = "movies";

      axios({
        method: 'get',
        //@ts-ignore
        url: "https://api.themoviedb.org/3/"+((this.$route.params.type == 's') ? "tv/" : "movie/")+this.$route.params.id+"?api_key=a41b38cff983f069924ae937ffdd7631"
      })
      .then( (mdb) => {
        
        axios({
          method: 'get',
          //@ts-ignore
          url: "content?type="+urlType+"&login="+$cookies.get('SNID')+"&id="+this.$route.params.id
        })
        .then( (r) => {
          //@ts-ignore
          this.$refs.plyr.player.source = {
            type: 'video',
            title: 'Goofy',
            sources: [
              {
                src: r.data[0],
                type: 'video/mp4',
                size: 720,
              } 
            ],
            poster: "https://image.tmdb.org/t/p/original"+mdb.data.backdrop_path
          };

          this.startTime = r.data[1];
        })
        .catch( (error) => {
          alert(error);
        })

      })
      .catch( (error) => {
        alert(error);
      })
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  $backMargin: 20px;
  $backSize: 30px;
  .back {
    width: $backSize;
    height: $backSize;

    position: absolute;
    top: $backMargin;
    left: $backMargin;
    z-index: 99;

    background-color: white;
  }
}
</style>
