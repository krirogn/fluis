<template>
  <div class="container">

    <!-- The header -->
    <div v-if="header.backdrop_path != null" class="head">
      <!-- The background title -->
      <div class="background" :style="{ backgroundImage: dbCmsHigh + header.backdrop_path + ')' }"></div>
      <div class="fade">
        <div class="cont">
          <p class="titleName" ref="titleNameElem">{{ header.title }}</p><br>
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
        <div v-for="m in movies" class="mov" :style="{ backgroundImage: dbCmsLow + m.poster_path + ')' }" @click="select(m, 'movie')">
          <div class="fade"></div>
        </div>
      </div>
    </div>

    <!-- The show slide -->
    <div v-if="shows.length != 0" class="t" style="margin-top:60px;">
      <p class="h">My Shows</p>
      <div class="titles">
        <div v-for="s in shows" class="mov" :style="{ backgroundImage: dbCmsLow + s.poster_path + ')' }" @click="select(s, 'tv')">
          <div class="fade"></div>
        </div>
      </div>
    </div>


    <!-- The title card -->
    <transition name="infoSlide">
      <div v-if="selected != null" class="card">
        <div class="deselect" @click="deselect"></div>
        <div class="info">
          <div class="left">
            <div class="mov mi" :style="{ backgroundImage: dbCmsLow + selected.poster_path + ')' }"></div>
          </div>
          <div class="right">
            <p class="overview">{{ selected.overview }}</p>

            <div class="bttm">
              <button type="button" class="btn play">Play Now</button>
              <button type="button" class="btn list">Watch List</button>
            </div>
          </div>
          <div v-if="!videoEnabled" class="bgImg" :style="{ backgroundImage: dbCmsHigh + selected.backdrop_path + ')' }">
            <div class="fade"></div>
          </div>
          <div v-else>
            <div class="videoDiv"><video class="video" ref="selectedVideoPlayer" loop></video></div>
            <div class="fade" ref="fadeElem" :style="{ width: selectedVideoWidth }"></div>
          </div>
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
//import Hjson from 'hjson'
import fitty from 'fitty'

export default Vue.extend({
  data: () => ({
    selected: null,
    selectedVideoWidth: "90%",

    dbCmsLow: 'url(https://image.tmdb.org/t/p/w500',
    dbCmsHigh: 'url(https://image.tmdb.org/t/p/original',
    videoEnabled: true,

    header: {},
    categories: [],

    /// The movie info
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
    movies: [],

    /// The show info
    showsID: [
      "246",
      "1418",
      "6357",
      "67075"
    ],
    shows: []
  }),
  mounted() {
    this.getMovieData();
    this.getShowData();
  },
  methods: {
    /// When a title is selected
    select(i: any, type: string) {
      this.selected = i;
      
      axios({
        method: 'get',
        url: "https://api.themoviedb.org/3/"+type+"/"+i.id+"/videos?api_key=a41b38cff983f069924ae937ffdd7631"
      })
      .then( (r) => {
        axios({
          method: 'get',
          url: "ytURL?id="+r.data.results[0].key
        })
        .then( (u) => {
          if (this.$refs.selectedVideoPlayer) {
            //@ts-ignore
            this.$refs.selectedVideoPlayer.src = u.data;
            //@ts-ignore
            this.$refs.selectedVideoPlayer.muted = true;

            //@ts-ignore
            this.$refs.selectedVideoPlayer.addEventListener('loadeddata', () => {
              this.fade(this.$refs.selectedVideoPlayer as HTMLElement);

              //@ts-ignore
              this.$refs.selectedVideoPlayer.currentTime = 10;
              //@ts-ignore
              this.$refs.selectedVideoPlayer.play();
              //@ts-ignore
              this.selectedVideoWidth = this.$refs.selectedVideoPlayer.offsetWidth+"px";
            }, false);
          }
        })
        .catch( (error) => {
          this.videoEnabled = false;
        })
      })
      .catch( (error) => {
        alert(error);
      })
      
    },
    /// When a title is deselected
    deselect() {
      this.selected = null;
      this.videoEnabled = true;
    },

    /// Helpers
    fade(element: HTMLElement) {
      var op = 0;
      var timer = setInterval(function() {
          if (op >= 1) clearInterval(timer);
          element.style.opacity = op as any as string;
          element.style.filter = 'alpha(opacity=' + op * 100 + ")";
          op += op * 0.1 || 0.1;
      }, 50);
    },

    /// Fetch from TMDB
    /// Get movie data
    getMovieData() {
      for (var i = 0; i < this.moviesID.length; i++) {
        axios({
          method: 'get',
          url: "https://api.themoviedb.org/3/movie/"+this.moviesID[i]+"?api_key=a41b38cff983f069924ae937ffdd7631"
        })
        .then( (r) => {
          //@ts-ignore
          this.movies.push(r.data);
        })
        .catch( (error) => {
          alert(error);
        })
      }

      var waitForElement = () => {
        if(this.movies.length == this.moviesID.length) {
          this.header = this.movies[Math.floor(Math.random() * this.movies.length)];
          
          setTimeout( () => {
            var f = fitty('.titleName', {
              multiLine: true,
              minSize: 40,
            });
            f[0].fit();
          }, 250);
        } else{
          setTimeout(waitForElement, 250);
        }
      }
      waitForElement();
    },
    /// Get show data
    getShowData() {
      for (var i = 0; i < this.showsID.length; i++) {
        axios({
          method: 'get',
          url: "https://api.themoviedb.org/3/tv/"+this.showsID[i]+"?api_key=a41b38cff983f069924ae937ffdd7631"
        })
        .then( (r) => {
          //@ts-ignore
          this.shows.push(r.data);
        })
        .catch( (error) => {
          alert(error);
        })
      }
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
          width: 100%;
          height: 100%;

          text-align: left;
          //font-size: 5vw;
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
    /*.cat:hover, .cat:focus {
      transform: scale(1);
    }*/
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
