<template>
  <div ref="refreshBody" class="adsionli-refresh" @mousedown.stop="dragStart" @touchstart.stop="dragStart">
    <refresh-up :maxHeight="props.maxHeight" :text="props.text" v-if="props.drag == 'up'" />
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, provide, Ref } from 'vue'
import { RefreshProps } from './refresh'
import RefreshUp from './up.vue'
export default defineComponent({
  name: 'AdsionliRefresh',
  props: RefreshProps,
  setup(props, { emit, slots }) {
    const refreshBody: Ref<Nullable<HTMLElement>> = ref(null)
    const showText = ref<boolean>(false)
    const movePos = ref<number>(0)
    const dragHeight = ref<number>(0)
    const textValue = ref<string>(props.text)
    const isRefresh: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)
    provide('showText', showText)
    provide('dragHeight', dragHeight)
    provide('textValue', textValue)
    const dragStart = (e: MouseEvent | TouchEvent) => {
      const slotDom: HTMLOptionElement = (refreshBody.value!.childNodes as NodeListOf<HTMLOptionElement>)[2]
      if (slotDom!.scrollTop > 10 || slotDom!.getBoundingClientRect().y < 0) return
      if(loading.value) return
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
      isRefresh.value = height > props.minHeight ? true : false
    }

    const dragEnd = async (e: MouseEvent | TouchEvent) => {
      window.removeEventListener('mousemove', dragMove)
      window.removeEventListener('mouseup', dragEnd)
      window.removeEventListener('touchmove', dragMove)
      window.removeEventListener('touchend', dragEnd)
      if (isRefresh.value) {
        movePos.value = 0
        textValue.value = props.loadText
        loading.value = true;
        let returnData = await refreshAction()
        loading.value = false;
        textValue.value = props.successText
        emit('getData', returnData)
        setTimeout(() => {
          showText.value = false
          dragHeight.value = 0
          textValue.value = props.text
        }, 500)
      }
      isRefresh.value = false
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
      refreshBody,
    }
  },
  components: {
    RefreshUp,
  },
})
</script>
