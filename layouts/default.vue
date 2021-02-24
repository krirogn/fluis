<template>
  <div>
    <div v-if="!loggedIn">
      <div style="position:absolute;height:100vh;width:100vw;background:white;"><p>Load</p></div>
    </div>
    <div v-else>
      <Nuxt />
    </div>
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

export default Vue.extend({
  data: () => ({
    loggedIn: false
  }),
  created() {
    this.CheckLogin(this)

    // Creds
		console.log('FLUIS 2021');
		console.log('Developed by Kristian Fredrik Rognsvaag');
		console.log('- - - - - - - - - - - - - -' );
  },
  watch: {
    $route (to, from){
      this.CheckLogin(this);
    }
  },
  methods: {
		CheckLogin(that: any) {
    	var login = new Login(axios);
      login.IsLoggedIn(that)
    },
  }
})
</script>

<style>
body {
  background-color: black;
}

html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
