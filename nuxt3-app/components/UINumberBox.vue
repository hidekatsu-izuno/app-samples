<script setup lang="ts">
import { ZodNumber } from "zod"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"
import { toHalfwidthAscii } from "~/utils/functions"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
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
  schema?: ZodNumber,
  modelValue?: string,
  error?: string,
}>(), {
  halign: "end",
  required: false,
  format: ",###.###",
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
  if (data.focused) {
    data.value = props.modelValue
  } else {
    data.value = formatNumber(props.modelValue, props.format)
  }
}, { immediate: true })

watch(() => props.error, () => {
  data.error = props.error
}, { immediate: true })

defineExpose({
  validate() {
    return validate(data.value)
  },
})

function onFocus(event: Event) {
  data.focused = true

  const target = event.target as HTMLInputElement
  if (target.value) {
    const num = parseNumber(target.value, props.format)
    if (num) {
      data.value = formatNumber(num)
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
    const svalue = formatNumber(value, props.format)
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

  let num
  if (value) {
    if (/^[0-9,]+(.[0-9]*)?$/.test(value)) {
      num = parseNumber(value)
    } else {
      num = parseNumber(value, props.format)
    }
  }

  if (num != null) {
    if (props.schema) {
      const result = props.schema.safeParse(num, {
        errorMap: JapaneseErrorMap,
      })
      if (result.success) {
        num = result.data
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
    return num
  }

  if (error !== data.error) {
    data.error = error
    emits("update:error", data.error)
  }

  throw new RangeError(error)
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
  <div
    class="UINumberBox"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UINumberBox-Content">
      <div v-if="props.prefix && data.value" class="UINumberBox-Prefix">{{ props.prefix }}</div>
      <div class="UINumberBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UINumberBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UINumberBox-Content">
      <div v-if="props.prefix" class="UINumberBox-Prefix">{{ props.prefix }}</div>
      <input
        class="UINumberBox-Input"
        type="text"
        inputmode="decimal"
        :class="props.inputClass"
        :style="props.inputStyle"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        :maxlength="maxLength"
        :value="data.value"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <div v-if="props.suffix" class="UINumberBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UINumberBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UINumberBox-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UINumberBox-Input {
  @apply flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-[0.25em] py-[0.125em]
    min-w-0
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    @apply appearance-none
      m-0;
  }
}

.UINumberBox-Error {
  @apply text-sm text-red-500;
}

.UINumberBox[data-readonly="true"] {
  .UINumberBox-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UINumberBox-Text {
    @apply whitespace-pre-wrap;
  }
}

.UINumberBox[data-size="lg"] {
  .UINumberBox-Content {
    @apply text-lg;
  }
}

.UINumberBox[data-size="sm"] {
  .UINumberBox-Content {
    @apply text-sm;
  }
}

.UINumberBox[data-halign="start"] {
  .UINumberBox-Input {
    @apply text-start;
  }

  &[data-readonly="true"] .UINumberBox-Content {
    @apply justify-start;
  }
}

.UINumberBox[data-halign="center"] {
  .UINumberBox-Input {
    @apply text-center;
  }

  &[data-readonly="true"] .UINumberBox-Content {
    @apply justify-center;
  }
}

.UINumberBox[data-halign="end"] {
  .UINumberBox-Input {
    @apply text-end;
  }

  &[data-readonly="true"] .UINumberBox-Content {
    @apply justify-end;
  }
}
</style>
