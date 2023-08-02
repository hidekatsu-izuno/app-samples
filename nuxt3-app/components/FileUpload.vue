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
  modelValue?: File,
}>(), {
  required: false
})

const data = reactive({
  value: undefined as File | undefined,
  error: "",
  clicked: false
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
  (event: "update:modelValue", value?: File): void
  (event: "blur", value: Event): void
}>()

function onClick(event: Event) {
  data.clicked = true
}

function onFocus(event: Event) {
  emits("focus", event)
}

function onChange(event: Event) {
  if (data.clicked) {
    data.clicked = false
  }
  const target = event.target as HTMLInputElement
  data.value = target.files?.[0]
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", target.files?.[0])
}

function onBlur(event: Event) {
  if (data.clicked) {
    data.clicked = false
    return
  }

  const target = event.target as HTMLInputElement
  const validated = validate(target.files?.[0])
  if (validated) {
    data.value = validated
    emits("update:modelValue", data.value)
  }

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
  <div class="FileUpload">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <input
      type="file"
      :placeholder="placeholder"
      :tabindex="tabindex"
      :accept="accept"
      :value="data.value"
      class="px-2 py-1 text-gray-900 bg-gray-50 resize-none border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
      @click="onClick"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
    >
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >
      {{ data.error }}
    </div>
  </div>
</template>
