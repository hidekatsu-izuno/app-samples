<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  halign?: "start" | "center" | "end"
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  error?: string
}>(), {
})

const emits = defineEmits<{
  (event: "update:error", value: string): void
  (event: "click", value: MouseEvent): void
}>()

const emitError = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits("update:error", target.value)
}

const onClick = (event: MouseEvent) => {
  emits("click", event)
}
</script>

<template>
  <div class="Button flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <button type="button"
      @click="onClick"
      class="font-medium text-white px-4 py-1.5 m-0 bg-blue-700 rounded-md outline-none hover:bg-blue-800 focus:ring-4 focus:ring-blue-500"
      :class="[
        {
          'block': !halign,
          'w-full': !halign,
          'self-start': halign === 'start',
          'self-center': halign === 'center',
          'self-end': halign === 'end',
        },
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
    ><slot /></button>
    <div v-if="error"
      class="block text-sm text-red-500"
    >{{ error }}</div>
  </div>
</template>
