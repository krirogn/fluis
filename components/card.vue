<template>
  <div class="mov" :style="{ backgroundImage: 'url(' + image + ')' }" @click="clicked">
    <div v-if="fade" div class="fade"></div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    image: {
      type: String,
    },
    fade: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clicked() {
      this.$emit('click');
    }
  }
}
</script>

<style scoped lang="scss">
  $cardColor: #111111;

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

  .fade {
    width: 100%;
    height: 100%;

    background-image:  linear-gradient(180deg, rgba($cardColor, 0.1) 0%,rgba($cardColor, 1) 100%);
  }
</style>
