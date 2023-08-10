<script setup lang="ts">
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  modelValue?: boolean,
}>(), {
  modelValue: false,
})

const emits = defineEmits<{
  (event: "update:modelValue", value: boolean): void,
}>()

const data = reactive({
  throttleTimerId: undefined as NodeJS.Timeout | undefined,
  durationTimerId: undefined as NodeJS.Timeout | undefined,
  value: false
})

const elRef = ref()

onMounted(() => {
  watch(() => data.value, () => {
    if (data.value) {
      elRef.value.showModal()
      disableBodyScroll(elRef.value, {
        reserveScrollBarGap: true,
      })
    } else {
      enableBodyScroll(elRef.value)
      elRef.value.close()
    }
  }, { flush: "post" })

  onUnmounted(() => {
    clearAllBodyScrollLocks()
  })
})

defineExpose({
  show,
  hide,
})

async function show(options?: { throttle: number, duration: number }) {
  if (options?.throttle) {
    await new Promise(resolve => {
      data.throttleTimerId = setTimeout(() => {
        data.throttleTimerId = undefined
        resolve(undefined)
      }, options.throttle)
    })
  }
  if (!data.value) {
    data.value = true
    emits("update:modelValue", data.value)
  }
  if (options?.duration) {
    data.durationTimerId = setTimeout(() => {
      hide()
      data.durationTimerId = undefined
    }, options.duration)
  }
}

function hide() {
  if (data.throttleTimerId) {
    clearTimeout(data.throttleTimerId)
    data.throttleTimerId = undefined
  }
  if (data.durationTimerId) {
    clearTimeout(data.durationTimerId)
    data.durationTimerId = undefined
  }
  if (data.value) {
    data.value = false
    emits("update:modelValue", data.value)
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="elRef" class="UILoadingIndicator" v-bind="$attrs">
      <div class="UILoadingIndicator-Loading" />
    </dialog>
  </Teleport>
</template>

<style>
.UILoadingIndicator {
  @apply fixed
    shadow-2xl
    rounded-lg
    p-2
    w-16 h-16
    overflow-hidden
    z-50;
}

.UILoadingIndicator-Loading {
  @apply border border-8 border-t-blue-700 border-l-blue-400 border-b-blue-200 border-r-blue-50 rounded-full
    w-full h-full;
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
