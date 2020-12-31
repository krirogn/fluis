<template>
  <div class="container">
    <h1>{{ config.backendURL }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

/// Enables the HJSON format parser
var Hjson = require('hjson')

export default Vue.extend({
  data: () => ({
    config: Hjson.parse(require('../fluis.config.hjson').default),
  }),
})
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;

  background-color: red;
}
</style>
