<template>
  <div class="adsionli-refresh" @mousedown.stop="dragStart" @touchstart.stop="dragStart">
    <refresh-up :maxHeight="props.maxHeight" :text="props.text" v-if="props.drag == 'up'">
      <slot></slot>
    </refresh-up>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import { RefreshProps } from './refresh'
import RefreshUp from './up.vue'
export default defineComponent({
  name: 'AdsionliRefresh',
  props: RefreshProps,
  setup(props, context) {
    const showText = ref<boolean>(false)
    const movePos = ref<number>(0)
    const dragHeight = ref<number>(0)
    const textValue = ref<string>(props.text)
    provide('showText', showText)
    provide('dragHeight', dragHeight)
    provide('textValue', textValue)
    const dragStart = (e: MouseEvent | TouchEvent) => {
      if (e instanceof TouchEvent) {
        window.addEventListener('touchmove', dragMove)
        window.addEventListener('touchend', dragEnd)
        movePos.value = e.touches[0].clientY
      } else {
        window.addEventListener('mousemove', dragMove)
        window.addEventListener('mouseup', dragEnd)
        movePos.value = e.screenY
      }
    }

    const dragMove = (e: MouseEvent | TouchEvent) => {
      let height
      if (e instanceof TouchEvent) {
        height = e.touches[0].clientY - movePos.value
      } else {
        height = e.screenY - movePos.value
      }
      showText.value = height >= props.minHeight ? true : false
      dragHeight.value = height > props.maxHeight ? props.maxHeight : height
    }

    const dragEnd = async (e: MouseEvent | TouchEvent) => {
      window.removeEventListener('mousemove', dragMove)
      window.removeEventListener('mouseup', dragEnd)
      window.removeEventListener('touchmove', dragMove)
      window.removeEventListener('touchend', dragEnd)
      movePos.value = 0
      textValue.value = props.loadText;
      let returnData = await refreshAction()
      textValue.value = props.successText;
      context.emit('getData', returnData)
      setTimeout(() => {
        showText.value = false
        dragHeight.value = 0
        textValue.value = props.text
      }, 500)
    }

    const refreshAction = function () {
      return new Promise(async (resolve, reject) => {
        try {
          let returnData = props.refreshFunc === null ? null : await props.refreshFunc()
          resolve(returnData)
        } catch (e) {
          reject(e)
        }
      })
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
  },
})
</script>
