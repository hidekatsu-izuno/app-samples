<script setup lang="ts">
import { ValidatorKey } from "@/composables/validator"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  type?: "text" | "password" | "email"
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  value?: string
  error?: string
}>(), {
  type: "text",
  required: false,
  value: "",
  error: "",
})

const data = reactive({
  error: props.error
})

const emits = defineEmits<{
  (event: "update:value", value: string): void
  (event: "update:error", value: string): void
}>()

const emitValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits("update:value", target.value)
}

const error = computed({
  get: () => props.error || data.error,
  set: (value) => {
    data.error = value || ""
    emits("update:error", value || "")
  }
})

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", () => {
      if (props.required) {
        if (!props.value) {
          error.value = "必須項目です。"
          return
        }
      }

      return {
        name,
        value: props.value
      }
    })
  }
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
