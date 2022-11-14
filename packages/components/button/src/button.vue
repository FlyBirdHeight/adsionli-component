<template>
  <button @click.stop="clickButton">
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
    const data = ref<string>('123')
    return {
      clickButton,
      data
    }
  },
})
</script>
