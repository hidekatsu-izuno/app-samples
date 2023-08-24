<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: "ok" | "ok-cancel" | "yes-no" | "yes-no-cancel",
  modelValue?: boolean,
  modaless?: boolean,
}>(), {
  type: "ok",
  modelValue: false,
  modaless: false,
})

const emits = defineEmits<{
  (event: "update:modelValue", value: boolean): void,
  (event: "close", value?: "ok" | "yes" | "no" | "cancel"): void,
}>()

defineExpose({
  close,
})

function close(result?: "ok" | "yes" | "no" | "cancel") {
  emits("update:modelValue", false)
  emits("close", result)
}
</script>

<template>
  <UIDialog
    class="UIAlert"
    role="alertdialog"
    :modaless="props.modaless"
    :model-value="props.modelValue"
    @close="close"
  >
    <div class="p-6 text-center">
      <UIIcon name="alert-circle-outline" class="text-red-500 text-6xl" />
      <h3 class="mb-5 text-lg font-normal text-gray-900">
        <slot />
      </h3>
      <div class="flex justify-center gap-0.5">
        <button
          v-if="props.type === 'ok' || props.type === 'ok-cancel'"
          type="button"
          autofocus
          class="PopupOkButton text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          @click="close('ok')"
        >OK</button>
        <button
          v-if="props.type === 'yes-no' || props.type === 'yes-no-cancel'"
          type="button"
          autofocus
          class="PopupYesButton text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          @click="close('yes')"
        >Yes</button>
        <button
          v-if="props.type === 'yes-no' || props.type === 'yes-no-cancel'"
          type="button"
          class="PopupNoButton text-gray-400 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
          @click="close('no')"
        >No</button>
        <button
          v-if="props.type === 'ok-cancel' || props.type === 'yes-no-cancel'"
          type="button"
          class="PopupCancelButton text-gray-400 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
          @click="close('cancel')"
        >キャンセル</button>
      </div>
    </div>
    <button
      type="button"
      class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
      @click="close()"
    >
      <UIIcon name="close-circle" class="text-2xl" />
    </button>
  </UIDialog>
</template>
