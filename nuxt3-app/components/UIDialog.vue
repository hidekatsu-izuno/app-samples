<script setup lang="ts">
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

const props = withDefaults(defineProps<{
  modelValue?: boolean,
  modaless?: boolean,
}>(), {
  modelValue: false,
  modaless: false,
})

const elRef = ref()

onMounted(() => {
  watch(() => props.modelValue, () => {
    if (props.modelValue) {
      if (!props.modaless) {
        elRef.value.showModal()
        disableBodyScroll(elRef.value, {
          reserveScrollBarGap: true,
        })
      } else {
        elRef.value.show()
      }
    } else {
      if (!props.modaless) {
        enableBodyScroll(elRef.value)
      }
      elRef.value.close()
    }
  }, { flush: "post" })

  onUnmounted(() => {
    clearAllBodyScrollLocks()
  })
})

const emits = defineEmits<{
  (event: "update:modelValue", value: boolean): void,
  (event: "close", value: any): void,
}>()

function close(result: any) {
  emits("update:modelValue", false)
  emits("close", result)
}

defineExpose({
  close
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="elRef" class="UIDialog fixed inset-0 w-1/2 rounded-lg shadow-2xl z-50">
      <slot />
    </dialog>
  </Teleport>
</template>
