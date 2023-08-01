<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string,
  halign?: "start" | "center" | "end",
  type?: "filled" | "outline",
  tabindex?: number,
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  error?: string,
}>(), {
  type: "filled"
})

const emits = defineEmits<{
  (event: "click", value: MouseEvent): void
}>()

function onClick(event: MouseEvent) {
  emits("click", event)
}
</script>

<template>
  <div class="Button flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <button type="button" :tabindex="tabindex"
      @click="onClick"
      class="font-medium px-4 py-1.5 m-0 rounded-md outline-none hover:bg-blue-800 focus:ring-2 focus:ring-blue-200"
      :class="[
        type === 'outline' ? 'text-blue-700 border border-blue-700 hover:text-white hover:bg-blue-700' : 'text-white bg-blue-700',
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
    ><slot /></button>
    <div v-if="error"
      class="block text-sm text-red-500"
    >{{ error }}</div>
  </div>
</template>
