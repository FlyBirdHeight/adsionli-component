<template>
  <button class="adsionli-button" @click.stop="clickButton">
    <slot>点击一下</slot>
  </button>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { buttonProps } from './button'
export default defineComponent({
  name: 'AdsionliButton',
  props: buttonProps,
  setup(props) {
    const clickButton = () => {
      console.log('clickButton')
    }
    const data = ref<number>('123')
    return {
      clickButton,
    }
  },
})
</script>
<style scoped>
.adsionli-button {
  height: 50px;
  width: 50px;
}
</style>
