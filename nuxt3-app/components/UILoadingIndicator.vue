<script setup lang="ts">
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

defineOptions({
  inheritAttrs: false,
})

const data = reactive({
  throttleTimerId: undefined as NodeJS.Timeout | undefined,
  durationTimerId: undefined as NodeJS.Timeout | undefined,
  value: false,
})

const elRef = ref()

init()

provide("useLoadingIndicator", {
  open,
  close,
  clear,
})

function init() {
  const router = useRouter()
  router.onError(() => {
    close()
  })
  router.beforeResolve((to, from) => {
    if (to === from || to.matched.every((comp, index) => comp.components && comp.components?.default === from.matched[index]?.components?.default)) {
      close()
    }
  })
  router.afterEach((_to, _from, failure) => {
    if (failure) {
      close()
    }
  })

  const nuxtApp = useNuxtApp()
  nuxtApp.hook("page:finish", close)
  nuxtApp.hook("vue:error", close)

  onMounted(() => {
    open()
  })

  onBeforeUnmount(() => {
    clear()
  })

  onUnmounted(() => {
    clearAllBodyScrollLocks()
  })
}

function open(options?: { throttle: number, duration: number }) {
  clear()

  if (options?.throttle) {
    data.throttleTimerId = setTimeout(() => {
      data.throttleTimerId = undefined
    }, options.throttle)
  }
  if (options?.duration) {
    data.durationTimerId = setTimeout(() => {
      data.durationTimerId = undefined
      close()
    }, options.duration + (options?.throttle || 0))
  }
  if (!data.value && elRef.value) {
    elRef.value.showModal()
    disableBodyScroll(elRef.value, {
      reserveScrollBarGap: true,
    })
    data.value = true
  }
}

function close() {
  clear()

  if (data.value) {
    if (elRef.value) {
      enableBodyScroll(elRef.value)
      elRef.value.close()
    }
    data.value = false
  }
}

function clear() {
  if (data.throttleTimerId) {
    clearTimeout(data.throttleTimerId)
    data.throttleTimerId = undefined
  }
  if (data.durationTimerId) {
    clearTimeout(data.durationTimerId)
    data.durationTimerId = undefined
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="elRef"
      class="UILoadingIndicator"
      :data-throttled="data.throttleTimerId != null"
      v-bind="$attrs"
    >
      <div class="UILoadingIndicator-Loading" />
    </dialog>
  </Teleport>
  <slot />
</template>

<style>
.UILoadingIndicator {
  @apply fixed
    shadow-2xl
    outline-none
    rounded-lg
    p-2
    w-16 h-16
    overflow-hidden
    z-50;
}

.UILoadingIndicator::backdrop {
  @apply opacity-0;
}

.UILoadingIndicator-Loading {
  @apply border border-8 border-t-blue-700 border-l-blue-400 border-b-blue-200 border-r-blue-50 rounded-full
    w-full h-full;
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.UILoadingIndicator[data-throttled="true"] {
  @apply opacity-0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
