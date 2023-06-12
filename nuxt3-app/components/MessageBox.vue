<script setup lang="ts">
import * as focusTrap from "focus-trap"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

const props = withDefaults(defineProps<{
  type?: "ok" | "ok_cancel" | "yes_no" | "yes_no_cancel"
  modelValue?: boolean
  message?: string
}>(), {
  type: "ok",
  modelValue: false,
  message: "",
})

const elRef = ref()

onMounted(() => {
  const trap = focusTrap.createFocusTrap(elRef.value, {
    initialFocus: props.type.startsWith("yes") ? ".PopupYesButton"
       : ".PopupOkButton"
    })

  watch(() => props.modelValue, () => {
    if (props.modelValue) {
      disableBodyScroll(elRef.value)
      trap.activate()
    } else {
      trap.deactivate()
      enableBodyScroll(elRef.value)
    }
  }, { flush: 'post' })

  onUnmounted(() => {
    trap.deactivate()
    clearAllBodyScrollLocks()
  })
})

const emits = defineEmits<{
  (event: "update:modelValue", value: boolean): void
  (event: "close", value?: "ok" | "yes" | "no" | "cancel"): void
}>()

const close = (result?: "ok" | "yes" | "no" | "cancel") => {
  emits("update:modelValue", false)
  emits("close", result)
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="elRef" class="MessageBox inset-0 rounded-lg shadow-2xl" :open="modelValue">
      <button type="button" @click="() => close()"
        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
        <div class="icon-[mdi--close-circle] text-2xl"></div>
      </button>
      <div class="p-6 text-center">
        <div class="icon-[mdi--alert-circle-outline] text-red-500 text-6xl"></div>
        <h3 class="mb-5 text-lg font-normal text-gray-500">{{ message }}</h3>
        <div class="flex justify-center gap-0.5">
          <button type="button" autofocus v-if="type === 'ok' || type === 'ok_cancel'" @click="() => close('ok')"
            class="PopupOkButton text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">OK</button>
          <button type="button" autofocus v-if="type === 'yes_no' || type === 'yes_no_cancel'" @click="() => close('yes')"
            class="PopupYesButton text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">Yes</button>
          <button type="button" v-if="type === 'yes_no' || type === 'yes_no_cancel'" @click="() => close('no')"
            class="PopupNoButton text-gray-500 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No</button>
          <button type="button" v-if="type === 'ok_cancel' || type === 'yes_no_cancel'" @click="() => close('cancel')"
            class="PopupCancelButton text-gray-500 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">キャンセル</button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
