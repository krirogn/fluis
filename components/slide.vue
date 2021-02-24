<template>
  <div class="t">
      <p class="h">{{ title }}</p>
      <div class="titles">
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'slide',
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style scoped lang="scss">
$margin: 20px;

.t {
  width: 100%;
  position: relative;
  left: 0;
  top: calc(50vh + 40px + 40px);

  .h {
    text-align: left;
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif;
    text-transform: capitalize;
    color: white;

    margin-bottom: 25px;
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
</style>
