<template>
  <div class="container">

    <!-- The header -->
    <div v-if="header.backdrop_path != undefined" class="head">
      <!-- The background title -->
      <div class="background" :style="{ backgroundImage: 'url(https://image.tmdb.org/t/p/original' + header.backdrop_path + ')' }"></div>
      <div class="fade">
        <div class="cont">
          <p class="titleName">{{ header.title }}</p><br>
          <div class="buttons">
            <button type="button" class="btn play">Play Now</button>
            <button type="button" class="btn list">Watch List</button>
          </div>
        </div>
      </div>

      <!-- The header bar -->
      <div class="header">
        
      </div>
    </div>

    <!-- The category slide -->
    <!--div class="categories">
      <div v-for="c in categories" class="cat" :style="{ backgroundImage: 'url(' + c.img + ')' }">
        <div class="fade">
          <p>{{ c.name }}</p>
        </div>
      </div>
    </div-->
    <!-- The movies slide -->
    <div v-if="movies.length != 0" class="t">
      <p class="h">My Movies</p>
      <div class="titles">
        <div v-for="m in movies" class="mov" :style="{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500' + m.poster_path + ')' }" @click="select(m)">
          <div class="fade">

          </div>
        </div>
      </div>
    </div>

    <!-- The title card -->
    <transition name="infoSlide">
      <div v-if="selected != null" class="card">
        <div class="deselect" @click="deselect"></div>
        <div class="info">
          <div class="left">
            <div class="mov mi" :style="{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500' + selected.poster_path + ')' }"></div>
          </div>
          <div class="right">
            <p class="overview">{{ selected.overview }}</p>

            <div class="bttm">
              <button type="button" class="btn play">Play Now</button>
              <button type="button" class="btn list">Watch List</button>
            </div>
          </div>
          <!--div class="bgImg" :style="{ backgroundImage: 'url(https://image.tmdb.org/t/p/original' + selected.backdrop_path + ')' }">
            <div class="fade"></div>
          </div-->
          <div class="videoDiv"><video class="video" ref="selectedVideoPlayer" loop></video></div>
          <div class="fade" ref="fadeElem" :style="{ width: selectedVideoWidth }"></div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
/// Standard Vue/Nuxt modules
import Vue from 'vue'
import axios from '~/plugins/axios'

/// Enables the HJSON format parser
const Hjson = require('hjson')
import fitty from 'fitty'

export default Vue.extend({
  data: () => ({
    config: Hjson.parse(require('../fluis.config.hjson').default),

    selected: null,
    selectedVideoWidth: "90%",

    header: {},
    categories: [
      {
        name: "animation",
        img: "https://www.themoviedb.org/t/p/original/r39CgvHn1gVEtRGdBdDpC3a6c81.jpg"
      },
      {
        name: "action",
        img: "https://www.themoviedb.org/t/p/original/2nGKhDksmoDdkllXm5D5gy2urCg.jpg"
      },
      {
        name: "sci-fi",
        img: "https://www.themoviedb.org/t/p/original/jn52me8AagfNt7r84SgQbV0R9ZG.jpg"
      },
      {
        name: "fantasy",
        img: "https://www.themoviedb.org/t/p/original/x4NZ2JSb8ojOK0NPOScagYn6sQK.jpg"
      },
      {
        name: "anime",
        img: "https://www.themoviedb.org/t/p/original/kP5duNJEbTfXpBs6CITsaZ88pQi.jpg"
        //img: "https://www.themoviedb.org/t/p/original/5mUYDoFjDlPmDvnUWSknhYjGBBh.jpg"
      }
    ],
    moviesID: [
      "508442",
      "324552",
      "808",
      "4922",
      "1771",
      "2062",
      "431693",
      "464052",
      "475557",
      "400160",
      "287947",
      "8392"
    ],
    movies: []
  }),
  mounted() {
    fitty('.titleName', {
      multiLine: true
    });

    axios({
      method: 'get',
      url: "v"
    })
    .then( (r) => {
      //alert(r.data);
    })
    .catch( (error) => {
      alert(error);
    })

    for (var i = 0; i < this.moviesID.length; i++) {
      axios({
        method: 'get',
        url: "https://api.themoviedb.org/3/movie/"+this.moviesID[i]+"?api_key=a41b38cff983f069924ae937ffdd7631"
      })
      .then( (r) => {
        //@ts-ignore
        this.movies.push(r.data);

        this.header = this.movies[Math.floor(Math.random() * this.movies.length)];
      })
      .catch( (error) => {
        alert(error);
      })
    }
  },
  methods: {
    select(i: any) {
      this.selected = i;
      
      axios({
        method: 'get',
        url: "https://api.themoviedb.org/3/movie/"+i.id+"/videos?api_key=a41b38cff983f069924ae937ffdd7631"
      })
      .then( (r) => {
        axios({
          method: 'get',
          url: "ytURL?id="+r.data.results[0].key
        })
        .then( (u) => {
          if (this.$refs.selectedVideoPlayer) {
            this.$refs.selectedVideoPlayer.src = u.data;
            this.$refs.selectedVideoPlayer.muted = true;

            this.$refs.selectedVideoPlayer.addEventListener('loadeddata', () => {
              this.$refs.selectedVideoPlayer.currentTime = 10;
              this.$refs.selectedVideoPlayer.play();
              this.selectedVideoWidth = this.$refs.selectedVideoPlayer.offsetWidth+"px";
            }, false);
          }
        })
        .catch( (error) => {
          alert(error);
        })
      })
      .catch( (error) => {
        alert(error);
      })
      
    },
    deselect() {
      this.selected = null;
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  //background-color: black;

  .btn {
    border-radius: 20px;
    border: none;
    outline: none;

    padding: 10px 15px;

    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    text-transform: uppercase;
  }
  .play {
    background-color: purple;
    color: white;

    margin-right: 10px;
  }
  .play:hover {
    background-color: rgba($color: white, $alpha: 0.0);
    border: purple solid 2px;
    padding: 8px 13px;
    cursor: pointer;
  }

  .list {
    background-color: white;
    color: black;
  }
  .list:hover {
    background-color: rgba($color: white, $alpha: 0.0);
    border: white solid 2px;
    color: white;
    padding: 8px 13px;
    cursor: pointer;
  }

  $margin: 20px;
  $headHeight: 60vh;
  .head {
    width: 100vw;
    height: $headHeight;

    position: absolute;

    .header {
      width: 100%;
      height: 50px;

      position: absolute;
      top: 0;
      left: 0;

      //background-color: yellow;
    }

    .fade {
      width: calc(100% - (2 * #{$margin}));
      height: calc(100% - #{$margin} - 10px);

      position: absolute;
      top: $margin;
      left: $margin;

      background-image:  linear-gradient(rgba(0,0,0, 0) 0%,rgba(0,0,0, 1) 100%);

      .cont {
        width: 50%;

        position: relative;
        left: 0;
        top: calc(50% - ((#{$headHeight} - 50vh) / 2));
        transform: translateY(-50%);

        margin-left: calc(#{$margin} * 2);
        
        .titleName {
          width: 50%;

          text-align: left;
          font-size: 5vw;
          font-family: Arial, Helvetica, sans-serif;
          //font-weight: bold;
          text-transform: uppercase;

          color: white;

          margin-bottom: 5px;
          user-select: none;
        }

        .buttons {
          display: inline-block;
        }
      }
    }
    .background {
      width: calc(100% - (2 * #{$margin}));
      height: calc(100% - #{$margin} - 10px);

      border-radius: 20px;

      position: absolute;
      top: $margin;
      left: $margin;

      background-size: cover;
      background-repeat: no-repeat;
      background-position: center top;

      //background-size: calc(100% - (2 * #{$margin}) + 30px);
      //filter: blur(4px);
    }
  }

  $categoriesHeight: 30vh;
  .categories {
    width: 100%;
    height: $categoriesHeight;

    position: absolute;
    left: 0;
    top: 50%;

    padding-left: $margin;

    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;

    .cat {
      width: 30vw;
      height: 100%;

      display: inline-block;

      border-radius: 20px;
      cursor: pointer;

      background-size: cover;
      background-repeat: no-repeat;
      background-position: center top;

      margin-right: 20px;

      .fade {
        width: 100%;
        height: 100%;

        background-image:  linear-gradient(rgba(0,0,0, 0) 0%,rgba(0,0,0, 0.95) 100%);

        p {
          position: relative;
          top: 50%;
          transform: translateY(-50%);

          text-align: center;
          font-size: 300%;
          font-family: Arial, Helvetica, sans-serif;
          text-transform: capitalize;

          color: white;
        }
      }
    }
    .cat:hover, .cat:focus {
      //transform: scale(1);
    }
  }

  $movSpace: 20px;
  $movWidth: calc(15vw - (#{$movSpace} / 2));
  $movMovement: 20px;
  .mov {
    width: $movWidth;
    height: calc(#{$movWidth} * (16/9));

    display: inline-block;

    border-radius: 20px;
    cursor: pointer;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;

    margin-right: $movSpace;

    transition: transform 0.5s ease;
    transform: translateY(0px);
  }
  .mov:hover, .mov:focus {
    transform: translateY(-$movMovement);
  }

  .t {
    width: 100%;
    position: relative;
    left: 0;
    top: calc(50vh + 40px + 40px);
    //top: calc(50vh + #{$categoriesHeight} + 20px);

    .h {
      text-align: left;
      font-size: 36px;
      font-family: Arial, Helvetica, sans-serif;
      text-transform: capitalize;
      color: white;

      margin-bottom: 35px;
      padding-left: calc(#{$margin} * 3);
    }

    $titlesMarginTop: 20px;
    .titles {
      width: 100%;

      overflow-y: hidden;
      overflow-x: auto;
      white-space: nowrap;

      margin-top: -$titlesMarginTop;
      margin-bottom: $titlesMarginTop;
      padding-left: calc(#{$margin} * 3);
      padding-right: calc(#{$margin} * 3);
      padding-top: 20px;
    }
  }

  $cardColor: #111111;
  //$cardColor: #202020;
  .card {
    width: 100vw;
    height: 100vh;

    position: fixed;
    top: 0;
    left: 0;

    $infoHeight: 50%;
    .deselect {
      width: 100%;
      height: calc(100% - #{$infoHeight});

      position: inherit;
      top: 0;
      left: 0;
    }

    .info {
      width: 100%;
      height: $infoHeight;

      position: inherit;
      bottom: 0;
      left: 0;

      border-radius: 20px 20px 0 0;

      background-color: $cardColor;

      .left {
        height: 100%;

        float: left;

        .mi {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          left: 20px;

          cursor: default;
        }
      }

      .right {
        width: 35%;
        height: 100%;

        float: left;

        padding: $margin;

        .overview {
          color: white;
        }

        .bttm {
          position: absolute;
          bottom: $margin;
        }
      }

      .bgImg {
        width: 60%;
        height: 100%;

        position: absolute;
        right: 0;
        top: 0;
        z-index: -1;

        background-size: cover;
        background-repeat: no-repeat;
        background-position: center top;

        .fade {
          width: 100%;
          height: 100%;

          background-image:  linear-gradient(-90deg, rgba($cardColor, 0.1) 0%,rgba($cardColor, 1) 100%);
        }
      }

      .videoDiv {
        height: 100%;

        position: absolute;
        right: 0;
        top: 0;
        z-index: -1;

        border-radius: 0px 20px 0px 0px;
        overflow: hidden;

        .video {
          height: 100%;
          transform: scale(1.5);
        }
      }

      .fade {
          height: 100%;

          position: absolute;
          right: 0;
          top: 0;
          z-index: -1;

          background-image:  linear-gradient(-90deg, rgba($cardColor, 0.1) 0%, rgba($cardColor, 1) calc(100% - 10px), rgba($cardColor, 1) 100%);
        }
    }
  }
}

/// Animations
$infoSlideTime: .5s;
.infoSlide-enter-active {
  transition: all $infoSlideTime ease-out;
}
.infoSlide-enter {
  transform: translateY(100%);
}

.infoSlide-leave-active {
  transition: all $infoSlideTime ease-in;
}
.infoSlide-leave-to {
  transform: translateY(100%);
}
</style>
