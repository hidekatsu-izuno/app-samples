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
  modelValue?: File[],
}>(), {
  required: false,
  modelValue: () => [],
})

const data = reactive({
  value: [] as File[],
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
  (event: "update:modelValue", value: File[]): void,
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
  data.value = target.files ? Array.from(target.files) : []
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

function validate(value: File[]) {
  data.error = ""

  if (value && value.length > 0) {
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
  <div class="UIMultiFileUpload"
  :class="[
      props.required ? 'UIMultiFileUpload-required' : '',
      props.disabled ? 'UIMultiFileUpload-disabled' : '',
      props.halign ? `UIMultiFileUpload-halign-${props.halign}` : '',
  ]">
    <label
      v-if="props.label"
      class="UIMultiFileUpload-Label"
    >{{ props.label }}</label>
    <div class="UIMultiFileUpload-Content">
      <div v-if="props.prefix" class="UIMultiFileUpload-Prefix">{{ props.prefix }}</div>
      <input
        class="UIMultiFileUpload-Input"
        type="file"
        multiple="true"
        :class="props.inputClass"
        :style="props.inputStyle"
        :placeholder="props.placeholder"
        :accept="props.accept"
        :tabindex="props.tabindex"
        :disabled="props.disabled"
        @click="onClick"
        @focus="onFocus"
        @change="onChange"
        @blur="onBlur"
      />
      <div v-if="props.suffix" class="UIMultiFileUpload-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UIMultiFileUpload-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIMultiFileUpload-Label {
  @apply block;
}

.UIMultiFileUpload-Content {
  @apply flex flex-row items-center gap-2;
}

.UIMultiFileUpload-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    w-full
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400
    resize-none;
}

.UIMultiFileUpload-Error {
  @apply text-sm text-red-500;
}

.UIMultiFileUpload-required {
  .UIMultiFileUpload-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UIMultiFileUpload-halign-start {
  .UIMultiFileUpload-Content {
    @apply justify-start;
  }

  .UIMultiFileUpload-Input {
    @apply w-auto;
  }
}

.UIMultiFileUpload-halign-center {
  .UIMultiFileUpload-Content {
    @apply justify-center;
  }

  .UIMultiFileUpload-Input {
    @apply w-auto;
  }
}

.UIMultiFileUpload-halign-end {
  .UIMultiFileUpload-Content {
    @apply justify-end;
  }

  .UIMultiFileUpload-Input {
    @apply w-auto;
  }
}
</style>
