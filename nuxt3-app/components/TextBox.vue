<script setup lang="ts">
withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  type?: "text" | "password" | "email"
  label?: string
  placeholder?: string
  value?: string
  error?: string
}>(), {
  type: "text",
  value: "",
})

const emits = defineEmits<{
  (event: "update:value", value: string): void
  (event: "update:error", value: string): void
}>()

const emitValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits("update:value", target.value)
}

const emitError = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits("update:error", target.value)
}
</script>

<template>
  <div class="TextBox">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <input :type="type" :placeholder="placeholder"
      :value="value"
      @input="emitValue"
      class="p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
      :class="{
        'block': !halign,
        'w-full': !halign,
        'self-start': halign === 'start',
        'self-center': halign === 'center',
        'self-end': halign === 'end',
      }"
    />
    <div v-if="error"
      class="block text-sm text-red-500"
    >{{ error }}</div>
  </div>
</template>
