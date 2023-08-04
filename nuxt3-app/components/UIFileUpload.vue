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
  <div class="UIFileUpload"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UIFileUpload-Label"
    >{{ props.label }}</label>
    <div class="UIFileUpload-Content">
      <div v-if="props.prefix" class="UIFileUpload-Prefix">{{ props.prefix }}</div>
      <input
        class="UIFileUpload-Input"
        type="file"
        :class="props.inputClass"
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
      <div v-if="props.suffix" class="UIFileUpload-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UIFileUpload-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIFileUpload-Label {
  @apply block;
}

.UIFileUpload-Content {
  @apply flex flex-row items-center gap-2;
}

.UIFileUpload-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    w-full
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400
    resize-none;
}

.UIFileUpload-Error {
  @apply text-sm text-red-500;
}

.UIFileUpload[data-required="true"] {
  .UIFileUpload-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UIFileUpload[data-halign="start"] {
  .UIFileUpload-Content {
    @apply justify-start;
  }

  .UIFileUpload-Input {
    @apply w-auto;
  }
}

.UIFileUpload[data-halign="center"] {
  .UIFileUpload-Content {
    @apply justify-center;
  }

  .UIFileUpload-Input {
    @apply w-auto;
  }
}

.UIFileUpload[data-halign="end"] {
  .UIFileUpload-Content {
    @apply justify-end;
  }

  .UIFileUpload-Input {
    @apply w-auto;
  }
}
</style>
