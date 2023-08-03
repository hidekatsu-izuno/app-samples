<script setup lang="ts">
import { ValidatorKey } from "~/utils/validator"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
  placeholder?: string,
  tabindex?: number,
  accept?: string,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  modelValue?: File,
}>(), {
  required: false
})

const data = reactive({
  value: undefined as File | undefined,
  error: "",
  active: false,
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})

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
  (event: "update:modelValue", value?: File): void
  (event: "blur", value: Event): void
}>()

function onClick(event: Event) {
  data.active = true
}

function onFocus(event: Event) {
  emits("focus", event)
}

function onChange(event: Event) {
  if (data.active) {
    data.active = false
  }
  const target = event.target as HTMLInputElement
  data.value = target.files?.[0]
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", data.value)
}

function onBlur(event: Event) {
  if (data.active) {
    data.active = false
    return
  }
  validate(data.value)
  emits("blur", event)
}

function validate(value?: File) {
  data.error = ""

  if (value) {
    // no handle
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return value
  }
}
</script>

<template>
  <div class="UIFileUpload">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200"
    >{{ data.value?.name || '&#8203;' }}</div>
    <input
      v-else
      type="file"
      class="px-2 py-1 text-gray-900 bg-gray-50 resize-none border border-gray-300 rounded-md outline-none disabled:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
      :placeholder="placeholder"
      :accept="accept"
      :disabled="disabled"
      :tabindex="tabindex"
      @click="onClick"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
    />
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
