<template>
  <div ref="refreshUp" class="refresh-up">
    <div v-show="showText" ref="upText" class="refresh-text">{{ props.text }}</div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, inject, watch } from 'vue'
import { RefreshUpProps } from './up'
export default defineComponent({
  name: 'RefreshUp',
  props: RefreshUpProps,
})
</script>
<script lang="ts" setup>
const upText = ref(null)
const refreshUp = ref(null)
const props = defineProps()
const text = ref<string>(props.text)
const showText = inject('showText');
const dragHeight = inject('dragHeight');
onMounted(() => {
  upText.value.style.height = '0px'
  upText.value.style.maxHeight = `${props.maxHeight}px`
  refreshUp.value.style.width = '400px'
})
watch(dragHeight, (newV, oldV) => {
    console.log(newV)
    upText.value.style.height = `${newV}px`;
})
</script>
