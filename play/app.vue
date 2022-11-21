<template>
  测试
  <br />
  <adsionli-button class="adsionli-button">hello button</adsionli-button>
  <!-- <div
    id="refreshDom"
    style="margin: 30px; width: 400px; background-color: rgba(255, 0, 255, 1)"
    @mousedown.stop="dragStart"
    @mouseup.stop="dragEnd"
  >
    <div style="height: 400px; display: flex; justify-content: center; align-items: center">adsionli</div>
  </div> -->
  <adsionli-refresh :drag="'up'">
    <div style="width: 400px; height: 400px">
      测试一下下拉刷新
    </div>
  </adsionli-refresh>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue'
export default defineComponent({
  name: 'App',
  setup(props) {
    const dom = ref(null)
    const newDom = ref(null)
    const startPos = ref<number>(0)
    const endPos = ref<number>(0)
    const first = ref<boolean>(false)
    const dragStart = (e) => {
      window.addEventListener('mousemove', dragMove)
      window.addEventListener('mouseup', dragEnd)
      dom.value = document.getElementById('refreshDom')
      newDom.value = document.createElement('div')

      newDom.value.style.height = '0px'
      newDom.value.style.backgroundColor = 'rgba(255,255,255,1)'
      dom.value.insertBefore(newDom.value, dom.value.childNodes[0])
      startPos.value = e.screenY
      console.log(e);
    }
    const dragMove = (e) => {
      endPos.value = e.screenY
      let height = endPos.value - startPos.value
      if (height < 80) {
        newDom.value.style.height = `${height > 0 ? height : 0}px`
      }
      if (height > 40 && !first.value) {
        first.value = true
        newDom.value.appendChild(document.createTextNode('正在刷新......'))
      }
    }

    const dragEnd = (e) => {
      window.removeEventListener('mousemove', dragMove)
      window.removeEventListener('mouseup', dragEnd)
      newDom.value.style.transition = '0.5s all linear'
      newDom.value.style.height = '0px'

      dom.value.removeChild(dom.value.children[0])
      nextTick(() => {
        dom.value = null
        newDom.value = null
        startPos.value = 0
        endPos.value = 0
        first.value = false
      })
    }

    return {
      dragStart,
      dragMove,
      dragEnd,
    }
  },
})
</script>

<style lang="scss">
#refreshDom {
  transition: 1s all linear;
  overflow-y: auto;
}
</style>
