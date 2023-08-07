<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
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
  error?: string,
}>(), {
  required: false,
  modelValue: () => [],
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: File[]): void,
  (event: "update:error", value: string): void,
  (event: "change", value: Event): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  value: [] as File[],
  error: "",
  clicked: false,
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})

watch(() => props.error, () => {
  data.error = props.error
}, { immediate: true })

defineExpose({
  validate() {
    return validate(data.value)
  },
})

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

  if (data.error) {
    data.error = ""
    emits("update:error", data.error)
  }

  const target = event.target as HTMLInputElement
  data.value = target.files ? Array.from(target.files) : []
  emits("update:modelValue", data.value)

  try {
    validate(data.value)
    emits("change", event)
  } catch (err) {
    // no handle
  }
}

function onBlur(event: Event) {
  if (data.clicked) {
    data.clicked = false
    return
  }

  try {
    validate(data.value)
  } catch (err) {
    // no handle
  }

  emits("blur", event)
}

function validate(value: File[]) {
  let error = ""

  if (value.length > 0) {
    // no handle
  } else if (props.required) {
    error = "必須入力です。"
  }

  if (!error) {
    return value
  }

  if (error !== data.error) {
    data.error = error
    emits("update:error", data.error)
  }

  throw new RangeError(error)
}
</script>

<template>
  <div
    class="UIMultiFileUpload"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-halign="props.halign"
  >
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
      >
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

.UIMultiFileUpload[data-required="true"] {
  .UIMultiFileUpload-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UIMultiFileUpload[data-halign="start"] {
  .UIMultiFileUpload-Content {
    @apply justify-start;
  }

  .UIMultiFileUpload-Input {
    @apply w-auto;
  }
}

.UIMultiFileUpload[data-halign="center"] {
  .UIMultiFileUpload-Content {
    @apply justify-center;
  }

  .UIMultiFileUpload-Input {
    @apply w-auto;
  }
}

.UIMultiFileUpload[data-halign="end"] {
  .UIMultiFileUpload-Content {
    @apply justify-end;
  }

  .UIMultiFileUpload-Input {
    @apply w-auto;
  }
}
</style>
