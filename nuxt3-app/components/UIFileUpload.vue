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
  modelValue?: File,
  error?: string,
}>(), {
  required: false,
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value?: File): void,
  (event: "update:error", value: string): void,
  (event: "change", value: Event): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  value: undefined as File | undefined,
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
  data.value = target.files?.[0]
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

function validate(value?: File) {
  let error = ""

  if (value) {
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
    class="UIFileUpload"
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
      >
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
