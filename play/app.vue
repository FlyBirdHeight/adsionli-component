<template>
  测试
  <br />
  <adsionli-button class="adsionli-button">hello button</adsionli-button>

  <adsionli-refresh @getData="getData" :drag="'up'" :text="'松开刷新...'" :refreshFunc="getHttpData">
    <div v-if="animateData.length == 0" style="width: 400px; height: 400px">暂无数据</div>
    <div v-else>
      <ul>
        <li v-for="(item, key) in animateData" :key="key">
          <div>
            <p>动画名: {{ item.anime }}</p>
            <p>角色: {{ item.character }}</p>
            <p>名言: {{ item.quote }}</p>
          </div>
        </li>
      </ul>
    </div>
  </adsionli-refresh>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, ref, nextTick } from 'vue'
export default defineComponent({
  name: 'App',
  setup(props) {
    const animateData = ref<any[]>([])
    const getData = (data) => {
      animateData.value.unshift(...data.data)
    }
    const getHttpData = () => {
      return axios.get('https://animechan.vercel.app/api/quotes')
    }
    return {
      getData,
      getHttpData,
      animateData,
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
