<script setup lang="ts">
import { ValidatorKey } from "~/utils/validator"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
  placeholder?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  accept?: string,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  modelValue?: File,
}>(), {
  required: false,
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
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value?: File): void,
  (event: "blur", value: Event): void,
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

defineExpose({
  validate() {
    return validate(data.value)
  }
})
</script>

<template>
  <div class="UIFileUpload">
    <label
      v-if="props.label"
      class="block"
    >{{ props.label }} <span v-if="props.required" class="text-red-500">※</span></label>
    <div
      class="flex flex-row items-center gap-2"
      :class="[
        props.halign === 'start' ? 'justify-start' :
        props.halign === 'center' ? 'justify-center' :
        props.halign === 'end' ? 'justify-start' :
        '',
      ]"
    >
      <div v-if="props.prefix">{{ props.prefix }}</div>
      <input
        type="file"
        class="px-2 py-1 text-gray-900 bg-gray-50 resize-none border border-gray-300 rounded-md outline-none disabled:text-gray-400 disabled:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        :class="[
          props.halign ? '' : 'w-full',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
        :style="props.inputStyle"
        :placeholder="props.placeholder"
        :accept="props.accept"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        @click="onClick"
        @focus="onFocus"
        @change="onChange"
        @blur="onBlur"
      />
      <div v-if="props.suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
