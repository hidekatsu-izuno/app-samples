<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  value?: boolean
  tabindex?: number
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
}>(), {
  value: true
})

const data = reactive({
  error: "",
})

const emits = defineEmits<{
  (event: "change", value: Event): void
}>()

const onChange = (event: Event) => {
  emits("change", event)
}
</script>

<template>
  <div class="Check flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <label class="block"
      :class="{
        'block': !halign,
        'w-full': !halign,
        'self-start': halign === 'start',
        'self-center': halign === 'center',
        'self-end': halign === 'end',
      }"
    ><input type="checkbox" @change="onChange"
      :class="props.inputClass"
      :style="props.inputStyle"
    /><slot /></label>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
