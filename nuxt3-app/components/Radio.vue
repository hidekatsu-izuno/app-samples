<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  href?: string
  tabindex?: number
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
}>(), {
})

const data = reactive({
  error: "",
})

const emits = defineEmits<{
  (event: "click", value: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  emits("click", event)
}
</script>

<template>
  <div class="Radio flex flex-col">
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
    ><input type="radio"
      :class="props.inputClass"
      :style="props.inputStyle"
    /><slot /></label>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
