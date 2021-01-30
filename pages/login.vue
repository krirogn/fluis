<template>
  <div class="container">
    <input type="text" placeholder="Username" v-model="uname"><br>
    <input type="password" placeholder="Password" v-model="pass"><br>
    <button type="button" class="btn play" @click="login">Play Now</button>
  </div>
</template>

<script lang="ts">
/// Standard Vue/Nuxt modules
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
VueCookies.config('7d')

import Login from '~/assets/modules/Login'
import axios from '~/plugins/axios'

/// Enables the HJSON format parser
var Hjson = require('hjson')

export default Vue.extend({
  layout: 'login',
  data: () => ({
    config: Hjson.parse(require('../fluis.config.hjson').default),
    uname: "",
    pass: ""
  }),
  mounted() {
    var login = new Login(axios);
    login.IsLoggedIn(this);
  },
  methods: {
    login() {
      var login = new Login(axios);
	  login.LogIn(this.pass, this.uname, this);
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
