<script setup lang="ts">
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

defineOptions({
  inheritAttrs: false,
})

if (process.client) {
  document.addEventListener("keydown", listener, true)
}

const data = reactive({
  throttleTimerId: undefined as NodeJS.Timeout | undefined,
  durationTimerId: undefined as NodeJS.Timeout | undefined,
  value: true,
})

const elRef = ref()

provide("useLoadingIndicator", {
  show,
  hide,
})

const nuxtApp = useNuxtApp()
nuxtApp.hook("page:finish", hide)
nuxtApp.hook("vue:error", hide)

const router = useRouter()
router.onError(() => {
  hide()
})
router.beforeResolve((to, from) => {
  if (to === from || to.matched.every((comp, index) => comp.components && comp.components?.default === from.matched[index]?.components?.default)) {
    hide()
  }
})
router.afterEach((_to, _from, failure) => {
  if (failure) {
    hide()
  }
})

onMounted(() => {
  if (data.value) {
    if (elRef.value) {
      disableBodyScroll(elRef.value, {
        reserveScrollBarGap: true,
      })
    }
    document.removeEventListener("keydown", listener, true)
  }
})

onBeforeUnmount(() => {
  clear()
})

onUnmounted(() => {
  clearAllBodyScrollLocks()
  document.removeEventListener("keydown", listener, true)
})

function listener(event: Event) {
  event.preventDefault()
}

function show(options?: { throttle: number, duration: number }) {
  clear()

  if (options?.throttle) {
    data.throttleTimerId = setTimeout(() => {
      data.throttleTimerId = undefined
    }, options.throttle)
  }
  if (options?.duration) {
    data.durationTimerId = setTimeout(() => {
      data.durationTimerId = undefined
      hide()
    }, options.duration + (options?.throttle || 0))
  }
  if (!data.value) {
    document.addEventListener("keydown", listener, true)
    if (elRef.value) {
      disableBodyScroll(elRef.value, {
        reserveScrollBarGap: true,
      })
    }
    data.value = true
  }
}

function hide() {
  clear()

  if (data.value) {
    if (elRef.value) {
      enableBodyScroll(elRef.value)
    }
    document.removeEventListener("keydown", listener, true)
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
    <div
      v-if="data.value"
      ref="elRef"
      class="UILoadingIndicator"
      :data-throttled="data.throttleTimerId != null"
      v-bind="$attrs"
    >
      <div class="UILoadingIndicator-Loading" />
    </div>
  </Teleport>
  <slot />
</template>

<style>
.UILoadingIndicator {
  @apply fixed inset-0
    flex items-center justify-center
    bg-[rgba(0,0,0,0)]
    z-[3000];
}

.UILoadingIndicator-Loading {
  @apply flex items-center justify-center
    shadow-2xl
    w-16 h-16
    rounded-lg
    p-2
    bg-white
    overflow-hidden;
}

.UILoadingIndicator-Loading::before {
  @apply block
    border border-8 border-t-blue-700 border-l-blue-400 border-b-blue-200 border-r-blue-50 rounded-full
    w-full h-full;
  content: '';
  animation-name: spin;
  animation-duration: 2s;
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
