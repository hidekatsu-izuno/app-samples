<script setup lang="ts">
import { ValidatorKey } from "~~/utils/validator"
import { z, ZodString } from "zod"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  type?: "text" | "password" | "email"
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  schema?: ZodString
  modelValue?: string
}>(), {
  type: "text",
  required: false,
  modelValue: "",
})

const data = reactive({
  value: props.modelValue || "",
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})


const validate = (value: string) => {
  data.error = ""

  if (value) {
    if (props.schema) {
      const result = props.schema.safeParse(value)
      if (result.success) {
        value = result.data
      } else {
        data.error = result.error.issues[0].message
      }
    }
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return value || ""
  }
}

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void
}>()

const emitValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", target.value)
}

const name = props.name
if (name) {
  let schema = props.schema || z.string()
  if (props.required) {
    if (schema.minLength != null) {
      schema = schema.nonempty()
    }
  }
  if (props.type === "email") {
    if (!schema.isEmail) {
      schema = schema.email()
    }
  }

  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      data.error = ""

      const result = schema.safeParse(data.value)
      if (result.success) {
        return result.data
      } else {
        data.error = result.error.issues[0].message
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
