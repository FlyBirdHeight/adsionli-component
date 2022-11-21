<template>
  <div class="adsionli-refresh" @mousedown.stop="dragStart">
    <refresh-up :maxHeight="props.maxHeight" :text="props.text" v-if="props.drag == 'up'">
      <slot></slot>
    </refresh-up>
    <refresh-down v-else>
      <slot></slot>
    </refresh-down>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import { RefreshProps } from './refresh'
import RefreshUp from './up.vue'
import RefreshDown from './down.vue'
export default defineComponent({
  name: 'AdsionliRefresh',
  props: RefreshProps,
  setup(props, context) {
    const showText = ref<boolean>(false)
    const movePos = ref<number>(0)
    const dragHeight = ref<number>(0)
    provide('showText', showText)
    provide('dragHeight', dragHeight)
    const dragStart = (e: MouseEvent) => {
      window.addEventListener('mousemove', dragMove)
      window.addEventListener('mouseup', dragEnd)
      movePos.value = e.screenY
    }

    const dragMove = (e: MouseEvent) => {
      let height = e.screenY - movePos.value
      console.log(e, height)
      if (height >= props.minHeight) {
        showText.value = true
        dragHeight.value = height > props.maxHeight ? props.maxHeight : height
      } else {
        showText.value = false
      }
    }

    const dragEnd = async (e: MouseEvent) => {
      window.removeEventListener('mousemove', dragMove)
      window.removeEventListener('mouseup', dragEnd)
      showText.value = false
      movePos.value = 0
    }

    return {
      dragStart,
      dragMove,
      dragEnd,
      props,
    }
  },
  components: {
    RefreshUp,
    RefreshDown,
  },
})
</script>
