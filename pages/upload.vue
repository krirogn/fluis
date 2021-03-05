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
            <button type="button" @click="play(header)" class="btn play">Play Now</button>
            <!--button type="button" class="btn list">Watch List</button-->
          </div>
        </div>
      </div>

      <!-- The header bar -->
      <div class="header">
        
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
                <button type="button" v-for="s in seasons" @click="seasonSelect(s)" v-bind:style="{ backgroundColor: (s == selectedSeason) ? 'purple' : 'white', color: (s == selectedSeason) ? 'white' : 'black' }" class="btn season-select">{{ s }}</button>
              </div>

              <div v-if="$refs.episodeSelect && $refs.seasonButtons" class="episodes" :style="{ '--episodeSelectHeight': $refs.episodeSelect.offsetHeight, '--seasonButtonsHeight': $refs.seasonButtons.offsetHeight }">
                <div v-for="e in episodes" class="episode">
                  <p class="number">{{ e.episode_number }}</p>
                  <p class="name">{{ e.name }}</p>
                </div>
              </div>
              
              <!--div v-if="showSeasonDropdown" ref="seasonDropdownContent" class="season-dropdown">
                <a v-for="s in seasons" @click="seasonSelect(s)">{{ s }}</a>
              </div-->
            </div>

            <div v-if="selectedType != 'tv'" class="bttm">
              <button type="button" @click="play(selected)" class="btn play">Play Now</button>
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

export default Vue.extend({
  data: () => ({
    
  })
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
}
</style>
