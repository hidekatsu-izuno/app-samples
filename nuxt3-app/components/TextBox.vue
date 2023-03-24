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
}>(), {
  type: "text",
  required: false,
  value: "",
})

const data = reactive({
  value: props.value || "",
  error: "",
})

watch(() => props.value, () => {
  data.value = props.value
})

const emits = defineEmits<{
  (event: "update:value", value: string): void
}>()

const emitValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  data.value = target.value
  emits("update:value", target.value)
}

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      data.error = ""
      if (props.required) {
        if (!data.value) {
          data.error = "必須項目です。"
          return
        }
      }
      return data.value
    })

    validator.on("clear", name, () => {
      data.error = ""
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
      :value="data.value"
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
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
