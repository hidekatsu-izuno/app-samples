<script setup lang="ts">
import { ValidatorKey } from "~~/utils/validator"
import { ZodNumber } from "zod"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  format?: string
  schema?: ZodNumber
  modelValue?: string
}>(), {
  type: "text",
  required: false,
  format: ',###.###',
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

  let num = parseNumber(value)
  if (num) {
    if (props.schema) {
      const result = props.schema.safeParse(num)
      if (result.success) {
        num = result.data
      } else {
        data.error = result.error.issues[0].message
      }
    }
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return formatNumber(num)
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
  emits("update:modelValue", data.value)
}

const emitFormattedValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const validated = validate(target.value)
  if (validated) {
    data.value = formatNumber(validated, props.format)
    emits("update:modelValue", data.value)
  }
}

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      return validate(data.value)
    })

    validator.on("clear", name, () => {
      data.error = ""
    })
  }
}
</script>

<template>
  <div class="DateBox">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <input type="text" :placeholder="placeholder"
      :value="data.value"
      @input="emitValue"
      @blur="emitFormattedValue"
      class="p-2.5 text-sm text-right text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
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
