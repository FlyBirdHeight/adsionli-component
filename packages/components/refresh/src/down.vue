<template>
  <div class="refresh-down">
    <div ref="refreshDownText" class="refresh-text">松手刷新</div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
export default defineComponent({
  name: 'RefreshDown',
  setup(props, context) {
    const refreshDownText = ref(null)
    onMounted(() => {
      // refreshDownText.value.style.height = '0px'
      // refreshDownText.value.style.maxHeight = `${props.maxHeight}px`
    })
    context.expose({
      refreshDownText,
    })
    return {}
  },
})
</script>
