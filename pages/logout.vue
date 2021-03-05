<template>
  <div class="container">
    <input type="checkbox" placeholder="da" v-model="da"><br>
    <button type="button" class="btn play" @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
/// Standard Vue/Nuxt modules
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
//@ts-ignore
VueCookies.config('7d')

import Login from '~/assets/modules/Login'
import axios from '~/plugins/axios'

/// Enables the HJSON format parser
var Hjson = require('hjson')

export default Vue.extend({
  data: () => ({
    config: Hjson.parse(require('../fluis.config.hjson').default),
    da: false
  }),
  methods: {
    logout() {
      var login = new Login(axios);
      login.LogOut(this.da, this);
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  background-color: black;

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
  }
  .play:hover {
    background-color: rgba($color: white, $alpha: 0.0);
    border: purple solid 2px;
    padding: 8px 13px;
    cursor: pointer;
  }
}
</style>
