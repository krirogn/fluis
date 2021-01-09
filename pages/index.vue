<template>
  <div class="container">
    <h1>{{ config.backendURL }}</h1>
  </div>
</template>

<script lang="ts">
/// Standard Vue/Nuxt modules
import Vue from 'vue'
import axios from '~/plugins/axios'

/// Enables the HJSON format parser
var Hjson = require('hjson')

export default Vue.extend({
  data: () => ({
    config: Hjson.parse(require('../fluis.config.hjson').default),
    ver: undefined,
  }),
  mounted() {
    axios({
      method: 'get',
      url: "v"
    })
    .then( (r) => {
      alert(r.data);
    })
    .catch( (error) => {
      alert(error);
    })
  }
})
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;

  background-color: red;
}
</style>
