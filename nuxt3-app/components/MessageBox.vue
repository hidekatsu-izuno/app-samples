<script setup lang="ts">
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

const props = withDefaults(defineProps<{
  type?: "ok" | "ok-cancel" | "yes-no" | "yes-no-cancel",
  modelValue?: boolean,
  message?: string,
  modaless?: boolean,
}>(), {
  type: "ok",
  modelValue: false,
  message: "",
  modaless: false
})

const elRef = ref()

onMounted(() => {
  watch(() => props.modelValue, () => {
    if (props.modelValue) {
      if (!props.modaless) {
        elRef.value.showModal()
        disableBodyScroll(elRef.value)
      } else {
        elRef.value.show()
      }
    } else {
      if (!props.modaless) {
        enableBodyScroll(elRef.value)
      }
      elRef.value.close()
    }
  }, { flush: 'post' })

  onUnmounted(() => {
    clearAllBodyScrollLocks()
  })
})

const emits = defineEmits<{
  (event: "update:modelValue", value: boolean): void
  (event: "close", value?: "ok" | "yes" | "no" | "cancel"): void
}>()

function close(result?: "ok" | "yes" | "no" | "cancel") {
  emits("update:modelValue", false)
  emits("close", result)
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="elRef" class="MessageBox fixed inset-0 w-1/2 rounded-lg shadow-2xl z-50">
      <div class="p-6 text-center">
        <Icon name="alert-circle-outline" class="text-red-500 text-6xl" />
        <h3 class="mb-5 text-lg font-normal text-gray-500"><slot /></h3>
        <div class="flex justify-center gap-0.5">
          <button type="button" autofocus v-if="type === 'ok' || type === 'ok-cancel'" @click="close('ok')"
            class="PopupOkButton text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">OK</button>
          <button type="button" autofocus v-if="type === 'yes-no' || type === 'yes-no-cancel'" @click="close('yes')"
            class="PopupYesButton text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">Yes</button>
          <button type="button" v-if="type === 'yes-no' || type === 'yes-no-cancel'" @click="close('no')"
            class="PopupNoButton text-gray-500 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No</button>
          <button type="button" v-if="type === 'ok-cancel' || type === 'yes-no-cancel'" @click="close('cancel')"
            class="PopupCancelButton text-gray-500 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">キャンセル</button>
        </div>
      </div>
      <button type="button" @click="close()"
        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
        <Icon name="close-circle" class="text-2xl" />
      </button>
    </dialog>
  </Teleport>
</template>
