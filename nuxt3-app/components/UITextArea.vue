<script setup lang="ts">
import { ZodString } from "zod"
import { ValidatorKey } from "~/utils/validator"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
  placeholder?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  schema?: ZodString,
  modelValue?: string,
}>(), {
  required: false,
  modelValue: ""
})

const data = reactive({
  value: "",
  error: ""
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
}, { immediate: true })

if (props.name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", props.name, () => {
      return validate(data.value)
    })

    validator.on("clear", props.name, () => {
      data.error = ""
    })
  }
}

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: string): void
  (event: "blur", value: Event): void
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", target.value)
}

function onBlur(event: Event) {
  const target = event.target as HTMLInputElement
  const validated = validate(target.value)
  if (validated) {
    data.value = validated
    emits("update:modelValue", data.value)
  }

  emits("blur", event)
}

function validate(value: string) {
  data.error = ""

  if (value) {
    const schema = props.schema

    if (schema) {
      const result = schema.safeParse(value, {
        errorMap: JapaneseErrorMap
      })
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
    return value
  }
}
</script>

<template>
  <div class="UITextArea">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200 whitespace-pre-wrap"
    >{{ data.value || '&#8203;' }}</div>
    <textarea
      v-else
      class="px-2 py-1 text-gray-900 bg-gray-50 resize-none border border-gray-300 rounded-md outline-none disabled:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
      :placeholder="placeholder"
      :value="data.value"
      :disabled="disabled"
      :tabindex="tabindex"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
    />
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
