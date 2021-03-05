<template>
  <div class="container">

    <!-- The header -->
    <div v-if="header.backdrop_path != null" class="head">
      <!-- The background title -->
      <div class="background" :style="{ backgroundImage: 'url(' + dbCmsHigh + header.backdrop_path + ')' }"></div>
      <div class="fade">
        <div class="cont">
          <p class="titleName" ref="titleNameElem">{{ headerName }}</p><br>
          <div class="buttons">
            <button type="button" @click="playHeader()" class="btn play">Play Now</button>
            <!--button type="button" class="btn list">Watch List</button-->
          </div>
        </div>
      </div>

      <!-- The header bar -->
      <div class="header">
        <div class="logo">
          <img src="~/assets/images/logo.svg" draggable="false">
          <p>fluis</p>
        </div>
        <button type="button" @click="$router.push('/logout')" class="btn play logout">Logout</button>
      </div>
    </div>


    <!-- The movies slide -->
    <slide v-if="movies.length != 0" title="My Movies">
      <card v-for="m in movies" :image="dbCmsLow + m.poster_path" @click="select(m, 'movie')" />
    </slide>

    <!-- The show slide -->
    <slide v-if="shows.length != 0" title="My Shows" style="margin-top:60px;">
      <card v-for="s in shows" :image="dbCmsLow + s.poster_path" @click="select(s, 'tv')" />
    </slide>


    <!-- The title card -->
    <transition name="infoSlide">
      <div v-if="selected != null" class="card">
        <div class="deselect" @click="deselect"></div>
        <div class="info">
          
          <div class="left">
            <card class="mi" :image="dbCmsLow + selected.poster_path" />
          </div>

          <div class="right">
            <p class="overview" ref="overview">{{ selected.overview }}</p>

            <div v-if="selectedType == 'tv'" class="episode-select" ref="episodeSelect">
              <div ref="seasonButtons" style="overflow-y:hidden;overflow-x:auto;">
                <button type="button" v-for="s in seasons" @click="seasonSelect(s)" v-bind:style="{ backgroundColor: (s == selectedSeason) ? '#614B79' : 'white', color: (s == selectedSeason) ? 'white' : 'black' }" class="btn season-select">{{ s }}</button>
              </div>

              <div v-if="$refs.episodeSelect && $refs.seasonButtons" class="episodes" :style="{ '--episodeSelectHeight': $refs.episodeSelect.offsetHeight, '--seasonButtonsHeight': $refs.seasonButtons.offsetHeight }">
                <div v-for="e in episodes" class="episode" @click="play(e.episode_number)">
                  <p class="number">{{ e.episode_number }}</p>
                  <p class="name">{{ e.name }}</p>
                </div>
              </div>
              
              <!--div v-if="showSeasonDropdown" ref="seasonDropdownContent" class="season-dropdown">
                <a v-for="s in seasons" @click="seasonSelect(s)">{{ s }}</a>
              </div-->
            </div>

            <div v-if="selectedType != 'tv'" class="bttm">
              <button type="button" @click="play()" class="btn play">Play Now</button>
              <!--button type="button" class="btn list">Watch List</button-->
            </div>
          </div>
          <div v-if="!videoEnabled" class="bgImg" :style="{ backgroundImage: 'url(' + dbCmsHigh + selected.backdrop_path + ')' }">
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
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
//@ts-ignore
VueCookies.config('7d')

import axios from '~/plugins/axios'

/// Enables the HJSON format parser
//import Hjson from 'hjson'
import fitty from 'fitty'

/// Components
import slide from '~/components/slide.vue'
import card from '~/components/card.vue'

export default Vue.extend({
  components: {
    slide,
    card
  },
  data: () => ({
    selected: null,
    selectedType: "",
    selectedSeason: "",
    selectedEpisode: "",
    selectedVideoWidth: "90%",

    dbCmsLow: 'https://image.tmdb.org/t/p/w500',
    dbCmsHigh: 'https://image.tmdb.org/t/p/original',
    videoEnabled: true,

    header: {},
    headerName: "",
    categories: [],

    /// The movie info
    moviesID: [],
    movies: [],

    /// The show info
    showsID: [],
    shows: [],
    seasons: [],
    episodes: [], // This will change a lot

    /// DOM
    showSeasonDropdown: false,
  }),
  mounted() {
    this.getMovieData();
    this.getShowData();

    var waitForElement = () => {
      if (this.movies.length == this.moviesID.length && this.moviesID.length > 0 &&
          this.shows.length == this.showsID.length && this.showsID.length > 0) {
        
        var mH = this.movies[Math.floor(Math.random() * this.movies.length)];
        //var sH = this.shows[Math.floor(Math.random() * this.shows.length)];
        
        if (mH == undefined) {// && sH == undefined) {
          alert("You have no titles");
        } else {
          this.header = mH;
          //@ts-ignore
          this.headerName = mH.title;
        }
        /*else if (mH != undefined && sH == undefined) {
          this.header = mH;
          //@ts-ignore
          this.headerName = mH.title;
        } else if (mH == undefined && sH != undefined) {
          this.header = sH;
          //@ts-ignore
          this.headerName = sH.name;
        } else if (mH != undefined && sH != undefined) {
          if (Math.random() < 0.5) {
            this.header = mH;
            //@ts-ignore
            this.headerName = mH.title;
          } else {
            this.header = sH;
            //@ts-ignore
            this.headerName = sH.name;
          }
        }*/
        
        setTimeout( () => {
          var f = fitty('.titleName', {
            multiLine: true,
            minSize: 40,
          });
          f[0].fit();
        }, 250);
      } else {
        setTimeout(waitForElement, 250);
      }
    }
    waitForElement();
  },
  methods: {
    /// When a title is selected
    select(i: any, type: string) {
      this.selected = i;
      this.selectedType = type;
      
      // Get the trailer
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
        this.videoEnabled = false;
      })

      // Get the seasons and episodes
      if (type == "tv") {
        this.getSeasons(i.id, () => {
          this.selectedSeason = this.seasons[0];
          this.getEpisodes(i.id);
        });
      }
      
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


    /// DOM Methods
    seasonDropdown() {
      this.showSeasonDropdown = !this.showSeasonDropdown;
    },
    seasonSelect(s: string) {
      this.showSeasonDropdown = false;
      this.selectedSeason = s;
    },


    /// Fetch from TMDB
    /// Get movie data
    getMovieData() {
      axios({
        method: 'get',
        //@ts-ignore
        url: "getMoviesID?login="+$cookies.get('SNID')
      })
      .then( (r) => {
        //@ts-ignore
        this.moviesID = r.data;

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
      })
      .catch( (error) => {
        alert(error);
      })
    },
    /// Get show data
    getShowData() {
      /// 
      axios({
        method: 'get',
        //@ts-ignore
        url: "getShowsID?login="+$cookies.get('SNID')
      })
      .then( (r) => {
        //@ts-ignore
        this.showsID = r.data;

        /// Get the info from the IDs
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
      })
      .catch( (error) => {
        alert(error);
      })
    },
    /// 
    getSeasons(id: string, callback: Function) {
      axios({
        method: 'get',
        //@ts-ignore
        url: "getSeasonsFromID?login="+$cookies.get('SNID')+"&id="+id
      })
      .then( (r) => {
        //@ts-ignore
        this.seasons = r.data;

        callback();
      })
      .catch( (error) => {
        alert(error);
      })
    },
    getEpisodes(id: string) {
      axios({
        method: 'get',
        //@ts-ignore
        url: "getEpisodesFromID?login="+$cookies.get('SNID')+"&id="+this.selected.id+"&season="+this.selectedSeason
      })
      .then( (r) => {
        //this.episodes = r.data;
        console.log(r.data.length);
        //this.episodes = [];

        for (var i = 0; i < r.data.length; i++) {
          console.log(r.data[i]);
          
          axios({
            method: 'get',
            url: "https://api.themoviedb.org/3/tv/"+id+"/season/"+this.selectedSeason+"/episode/"+r.data[i]+"?api_key=a41b38cff983f069924ae937ffdd7631"
          })
          .then( (b) => {
            //@ts-ignore
            this.episodes.push(b.data);
          })
          .catch( (error) => {
            alert(error);
          })
        }
      })
      .catch( (error) => {
        alert(error);
      })
    },
    play(episode: number = 1) {
      var type = "s";
      //@ts-ignore
      (this.movies.includes(this.selected) == true) ? type = "m" : "s";

      if (type == "m") {
        this.$router.push('/play/'+type+'/'+this.selected.id);
      } else {
        this.$router.push('/play/'+type+'/'+this.selected.id+'/'+this.selectedSeason+'/'+episode);
      }
      
    },
    playHeader() {
      this.$router.push('/play/m/'+this.header.id);
    }
  }
})
</script>

<style scoped lang="scss">
$primaryColor: #614B79;

.container {
  width: 100vw;
  height: 100vh;

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
    background-color: $primaryColor;
    color: white;

    margin-right: 10px;
  }
  .play:hover {
    background-color: rgba($color: white, $alpha: 0.0);
    border: $primaryColor solid 2px;
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

    margin-top: 40px;

    .header {
      width: 100%;
      height: 60px;

      position: absolute;
      top: -40px;
      left: 0;

      //background-image: linear-gradient(1deg, rgba(0, 0, 0, 0) 30%, black 50%, black 100%);

      .logout {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);

        font-size: 14px;
      }

      .logo {
        height: 90%;

        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);

        display: inline-block;

        img {
          height: 80%;

          position: relative;
          float: left;
          top: 50%;
          transform: translateY(-50%);

          user-select: none;
        }

        p {
          position: relative;
          float: right;
          top: 50%;
          transform: translateY(-50%);

          color: $primaryColor;
          font-size: 48px;

          user-select: none;
        }
      }
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

        .episode-select {
          width: 100%;

          position: relative;
          display: inline-block;

          margin-top: $margin;
          margin-bottom: $margin;

          //background-color: yellow;

          .season-select {
            margin-right: 10px;

            border-radius: 0;
            color: white;
            background-color: $primaryColor;
          }
          .season-select:hover {
            background-color: rgb(99, 0, 99);
            cursor: pointer;
          }

          .season-dropdown {
            width: 100%;

            position: absolute;
            background-color: gray;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1000;

            a {
              color: white;
              padding: 12px 16px;
              text-decoration: none;
              display: block;
            }
            a:hover {
              background-color: #ddd;
            }
          }

          .episodes {
            width: 100%;
            max-height: calc(var(--episodeSelectHeight) - 20px - var(--seasonButtonsHeight));
            
            margin-top: 20px;
            margin-bottom: 10px;

            overflow-x: hidden;
            overflow-y: scroll;

            //background-color: blue;

            .episode {
              width: 100%;
              height: 40px;

              margin-bottom: 10px;
              padding-left: 10px;
              padding-right: 10px;

              background-color: $primaryColor;

              border-radius: 10px;

              .number {
                width: 10%;

                position: relative;
                top: 50%;
                transform: translateY(-50%);

                float: left;

                color: white;
              }

              .name {
                width: 90%;

                position: relative;
                top: 50%;
                transform: translateY(-50%);

                text-align: right;

                float: right;

                color: white;
              }
            }
            .episode:hover {
              cursor: pointer;
            }
          }
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
