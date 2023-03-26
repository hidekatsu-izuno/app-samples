<script setup lang="ts">
import { ValidatorKey } from "@/composables/validator"
import { z } from "zod"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  type?: "text" | "password" | "email"
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
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
  if (data.error) {
    data.error = ""
  }
  emits("update:value", target.value)
}

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      data.error = ""

      let schema = z.string()
      if (props.required) {
        schema = schema.nonempty(`必須項目です。`)
      }
      if (props.maxLength != null) {
        schema = schema.max(props.maxLength, `${props.maxLength}文字以下で入力してください。`)
      }
      if (props.type === "email") {
        schema = schema.email(`無効なメールアドレスです。`)
      }
      const result = schema.safeParse(data.value)
      if (result.success) {
        return data.value
      } else {
        data.error = result.error.issues[0].message
        return
      }
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
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
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
