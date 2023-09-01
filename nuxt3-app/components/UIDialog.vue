<script setup lang="ts">
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  modaless?: boolean,
  modelValue?: boolean,
}>(), {
  modaless: false,
  modelValue: false,
})

const elRef = ref()

watch(() => props.modelValue, () => {
  if (props.modelValue) {
    open()
  } else {
    close()
  }
})

onUnmounted(() => {
  clearAllBodyScrollLocks()
})

function open() {
  if (elRef.value) {
    disableBodyScroll(elRef.value, {
      reserveScrollBarGap: true,
    })
    if (props.modaless) {
      elRef.value.show()
    } else {
      elRef.value.showModal()
    }
  }
}

function close() {
  if (elRef.value) {
    elRef.value.close()
    enableBodyScroll(elRef.value)
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="elRef" class="UIDialog" v-bind="$attrs">
      <slot />
    </dialog>
  </Teleport>
</template>

<style>
.UIDialog {
  @apply fixed
    shadow-2xl
    outline-none
    rounded-lg
    inset-0
    w-1/2
    z-[2000];
}
</style>
