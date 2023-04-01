<script setup lang="ts">
import { ValidatorKey } from "@/utils/validator"
import { formatMessages } from "esbuild";
import { ZodNumber } from "zod"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
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
  maxLength: getFormatMaxLength(props.format),
  focused: false,
  value: props.modelValue || "",
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = data.focused ? props.modelValue : formatNumber(props.modelValue, props.format)
})

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      return validate(data.value, props.format)
    })

    validator.on("clear", name, () => {
      data.error = ""
    })
  }
}

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", data.value)
}

function onFocus(event: Event) {
  data.focused = true

  const target = event.target as HTMLInputElement
  if (target.value) {
    const num = parseNumber(target.value, props.format)
    if (num) {
      data.value = formatNumber(num)
    }
  }
}

function onBlur(event: Event) {
  data.focused = false

  const target = event.target as HTMLInputElement
  const validated = validate(target.value)
  if (validated) {
    data.value = formatNumber(validated, props.format)
    emits("update:modelValue", data.value)
  }
}

function validate(value: string, format?: string) {
  data.error = ""

  let num = parseNumber(value)
  if (num) {
    if (props.schema) {
      const result = props.schema.safeParse(num, {
        errorMap: JapaneseErrorMap
      })
      if (result.success) {
        num = result.data
      } else {
        data.error = result.error.issues[0].message
      }
    }
  } else if (value) {
    data.error = "入力に誤りがあります。"
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return formatNumber(num)
  }
}

function getFormatMaxLength(format: string) {
  let max = 17
  const index = format.indexOf(".")
  if (index !== -1) {
    max += format.length - index
  }
  return max
}
</script>

<template>
  <div class="NumberBox">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <input :type="data.focused ? 'number' : 'text'" :placeholder="placeholder" :maxlength="data.maxLength"
      :value="data.value"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      class="p-2 text-sm text-right text-gray-900 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
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
    />
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.NumberBox > input[type="number"]::-webkit-inner-spin-button,
.NumberBox > input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
