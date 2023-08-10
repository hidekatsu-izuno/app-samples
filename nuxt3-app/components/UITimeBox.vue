<script setup lang="ts">
import { ZodDate } from "zod"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"
import { toHalfwidthAscii } from "~/utils/functions"

const props = withDefaults(defineProps<{
  type?: "HHmm" | "HHmmss",
  size?: "small" | "large",
  halign?: "start" | "center" | "end",
  label?: string,
  placeholder?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  format?: string,
  schema?: ZodDate,
  modelValue?: string,
  error?: string,
}>(), {
  type: "HHmm",
  required: false,
  format: props => props.type === "HHmmss" ? "HH:mm:ss" : "HH:mm",
  modelValue: "",
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string): void,
  (event: "update:error", value: string): void,
  (event: "change", value: Event): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  focused: false,
  value: "",
  error: "",
  ime: false,
})

const maxLength = computed(() => getFormatMaxLength(props.format))

watch(() => props.modelValue, () => {
  data.value = data.focused ? props.modelValue : formatDate(props.modelValue, props.format)
}, { immediate: true })

watch(() => props.error, () => {
  data.error = props.error
}, { immediate: true })

defineExpose({
  validate() {
    return validate(data.value)
  },
})

const inputRef = ref()

function onFocus(event: Event) {
  data.focused = true

  const target = event.target as HTMLInputElement
  if (target.value) {
    const date = parseDate(target.value, props.format)
    if (date) {
      data.value = formatDate(date, props.type)
    }
  }

  emits("focus", event)
}

function onInput(event: Event) {
  if (data.ime) {
    return
  }

  if (data.error) {
    data.error = ""
    emits("update:error", data.error)
  }

  const target = event.target as HTMLInputElement
  data.value = target.value
  emits("update:modelValue", data.value)
}

function onCompositionStart(event: Event) {
  data.ime = true
}

function onCompositionEnd(event: Event) {
  data.ime = false
  onInput(event)
}

function onBlur(event: Event) {
  const target = event.target as HTMLInputElement
  try {
    const value = validate(toHalfwidthAscii(target.value))
    const svalue = value != null ? formatDate(value, props.format) : ""
    if (svalue !== data.value) {
      data.value = svalue
      emits("update:modelValue", data.value)
      emits("change", event)
    }
  } catch (err) {
    // no handle
  }

  data.focused = false
  emits("blur", event)
}

function validate(value: string) {
  let error = ""

  let date = parseDate(value, data.focused ? props.type : props.format)
  if (date) {
    if (props.schema) {
      const result = props.schema.safeParse(date, {
        errorMap: JapaneseErrorMap,
      })
      if (result.success) {
        date = result.data
      } else {
        error = result.error.issues[0].message
      }
    }
  } else if (value) {
    error = "入力に誤りがあります。"
  } else if (props.required) {
    error = "必須入力です。"
  }

  if (!error) {
    return formatDate(date, props.type === "HHmmss" ? "HH:mm:ss" : "HH:mm")
  }

  if (error !== data.error) {
    data.error = error
    emits("update:error", data.error)
  }

  throw new RangeError(error)
}

function getFormatMaxLength(format: string) {
  return format.length * 4
}
</script>

<template>
  <div
    class="UITimeBox"
    :data-required="props.required || undefined"
    :data-size="props.size"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UITimeBox-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UITimeBox-Content"
    >
      <div v-if="props.prefix && data.value" class="UITimeBox-Prefix">{{ props.prefix }}</div>
      <div class="UITimeBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UITimeBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UITimeBox-Content"
    >
      <div v-if="props.prefix" class="UITimeBox-Prefix">{{ props.prefix }}</div>
      <input
        ref="inputRef"
        class="UITimeBox-Input"
        type="text"
        inputmode="numeric"
        :placeholder="props.placeholder"
        :tabindex="props.tabindex"
        :disabled="props.disabled"
        :maxlength="maxLength"
        :value="data.value"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      >
      <div v-if="props.suffix" class="UITimeBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UITimeBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UITimeBox-Label {
  @apply block;
}

.UITimeBox-Content {
  @apply flex flex-row items-center gap-2;
}

.UITimeBox-Input {
  @apply flex-auto focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
}

.UITimeBox-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UITimeBox-Error {
  @apply text-sm text-red-500;
}

.UITimeBox[data-required="true"] {
  .UITimeBox-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UITimeBox[data-size="large"] {
  .UITimeBox-Input {
    @apply px-3 py-1.5
      text-lg;
  }
}

.UITimeBox[data-size="small"] {
  .UITimeBox-Input {
    @apply px-1 py-0.5
      text-sm;
  }
}

.UITimeBox[data-readonly="true"] {
  .UITimeBox-Content {
    @apply justify-start
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UITimeBox[data-readonly="true"]) {
  .UITimeBox[data-halign="start"] {
    .UITimeBox-Content {
      @apply justify-start;
    }

    .UITimeBox-Input {
      @apply flex-none;
    }
  }

  .UITimeBox[data-halign="center"] {
    .UITimeBox-Content {
      @apply justify-center;
    }

    .UITimeBox-Input {
      @apply flex-none;
    }
  }

  .UITimeBox[data-halign="end"] {
    .UITimeBox-Content {
      @apply justify-end;
    }

    .UITimeBox-Input {
      @apply flex-none;
    }
  }
}
</style>
