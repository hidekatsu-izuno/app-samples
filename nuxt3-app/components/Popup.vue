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
    <div ref="elRef" class="fixed bg-gray-900 bg-opacity-50 inset-0 z-40" :class="{ 'hidden': !modelValue }">
      <div tabindex="-1"
        class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full justify-center items-center flex">
        <div class="relative w-full h-full max-w-md md:h-auto">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" @click="() => close()"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
              <Icon icon="material-symbols:close" width="22px" height="22px" />
            </button>
            <div class="p-6 text-center">
              <Icon class="m-auto" icon="material-symbols:error-circle-rounded-outline" width="64px" height="64px" color="red" inline />
              <h3 class="mb-5 text-lg font-normal text-gray-500">{{ message }}</h3>
              <div class="flex justify-center gap-0.5">
                <button type="button" v-if="type === 'ok' || type === 'ok_cancel'" @click="() => close('ok')"
                  class="PopupOkButton text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">OK</button>
                <button type="button" v-if="type === 'yes_no' || type === 'yes_no_cancel'" @click="() => close('yes')"
                  class="PopupYesButton text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">Yes</button>
                <button type="button" v-if="type === 'yes_no' || type === 'yes_no_cancel'" @click="() => close('no')"
                  class="PopupNoButton text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No</button>
                <button type="button" v-if="type === 'ok_cancel' || type === 'yes_no_cancel'" @click="() => close('cancel')"
                  class="PopupCancelButton text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
