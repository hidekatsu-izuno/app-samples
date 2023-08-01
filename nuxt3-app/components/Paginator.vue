<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string,
  halign?: "start" | "center" | "end",
  tabindex?: number,
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  modelValue?: number,
}>(), {
  modelValue: 1,
})

const data = reactive({
  value: Math.max(props.modelValue, 1)
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: number): void
  (event: "blur", value: Event): void
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onChange(event: Event) {
  emits("update:modelValue", 1)
}

function onBlur(event: Event) {
  emits("blur", event)
}

</script>

<template>
  <div class="Paginator">

  </div>
</template>
