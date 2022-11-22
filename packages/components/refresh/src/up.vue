<template>
  <div ref="refreshUp" class="refresh-up">
    <div ref="upText" class="refresh-text">{{ showText ? textValue : '' }}</div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, inject, watch, Ref } from 'vue'
import { RefreshUpProps } from './up'
export default defineComponent({
  name: 'RefreshUp',
  props: RefreshUpProps,
  setup(props) {
    const upText: Ref<Nullable<HTMLElement>> = ref(null)
    const refreshUp: Ref<Nullable<HTMLElement>> = ref(null)
    const text: Ref<string> = ref<string>(props.text)
    const showText: Ref<boolean> = inject('showText') || ref<boolean>(false)
    const dragHeight: Ref<number> = inject('dragHeight') || ref<number>(0)
    const textValue: Ref<string> = inject('textValue') || ref<string>('')
    onMounted(() => {
      upText.value!.setAttribute('style', `height: 0px; max-height: ${props.maxHeight}px`)
      refreshUp.value!.setAttribute('style', 'width:400px')
    })
    watch(dragHeight, (newV: number, oldV: number) => {
      upText.value!.setAttribute('style', `height: ${newV}px`)
    })
    return {
      upText,
      refreshUp,
      textValue,
      showText,
    }
  },
})
</script>
