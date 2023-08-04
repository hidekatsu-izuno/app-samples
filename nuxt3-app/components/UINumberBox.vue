<script setup lang="ts">
import { ZodNumber } from "zod"
import { ValidatorKey } from "~/utils/validator"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"
import { toHalfwidthAscii } from "~/utils/functions"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
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
}>(), {
  required: false,
  format: ",###.###",
  modelValue: "",
})

const maxLength = computed(() => getFormatMaxLength(props.format))

const data = reactive({
  focused: false,
  value: "",
  error: "",
  ime: false,
})

watch(() => props.modelValue, () => {
  if (data.focused) {
    data.value = props.modelValue
  } else {
    data.value = formatNumber(props.modelValue, props.format)
  }
}, { immediate: true })

if (props.name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", props.name, () => {
      return validate(data.value, props.format)
    })

    validator.on("clear", props.name, () => {
      data.error = ""
    })
  }
}

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string): void,
  (event: "blur", value: Event): void,
}>()

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

  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
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
  data.focused = false

  const target = event.target as HTMLInputElement
  data.value = toHalfwidthAscii(target.value)
  const validated = validate(data.value)
  if (validated) {
    data.value = formatNumber(validated, props.format)
    emits("update:modelValue", data.value)
  }
}

function validate(value: string, format?: string) {
  data.error = ""

  let num = parseNumber(value)
  if (num) {
    if (props.schema) {
      const result = props.schema.safeParse(num, {
        errorMap: JapaneseErrorMap,
      })
      if (result.success) {
        num = result.data
      } else {
        data.error = result.error.issues[0].message
      }
    }
  } else if (value) {
    data.error = "入力に誤りがあります。"
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return num
  }
}

function getFormatMaxLength(format: string) {
  let max = 17
  const index = format.indexOf(".")
  if (index !== -1) {
    max += format.length - index
  }
  return max
}

defineExpose({
  validate() {
    return validate(data.value, props.format)
  }
})
</script>

<template>
  <div class="UINumberBox"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UINumberBox-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UINumberBox-Content"
    >
      <div v-if="props.prefix && data.value" class="UINumberBox-Prefix">{{ props.prefix }}</div>
      <div class="UINumberBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UINumberBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UINumberBox-Content"
    >
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
.UINumberBox-Label {
  @apply block;
}

.UINumberBox-Content {
  @apply flex flex-row items-center gap-2;
}

.UINumberBox-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    w-full
    bg-gray-50 disabled:bg-gray-100
    text-right text-gray-900 disabled:text-gray-400;
}

.UINumberBox-Input::-webkit-inner-spin-button,
.UINumberBox-Input::-webkit-outer-spin-button {
  @apply appearance-none
    m-0;
}

.UINumberBox-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UINumberBox-Error {
  @apply text-sm text-red-500;
}

.UINumberBox[data-required="true"] {
  .UINumberBox-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UINumberBox[data-readonly="true"] {
  .UINumberBox-Content {
    @apply justify-start
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UINumberBox[data-readonly="true"]) {
  .UINumberBox[data-halign="start"] {
    .UINumberBox-Content {
      @apply justify-start;
    }
    .UINumberBox-Input {
      @apply w-auto;
    }
  }

  .UINumberBox[data-halign="center"] {
    .UINumberBox-Content {
      @apply justify-center;
    }
    .UINumberBox-Input {
      @apply w-auto;
    }
  }

  .UINumberBox[data-halign="end"] {
    .UINumberBox-Content {
      @apply justify-end;
    }
    .UINumberBox-Input {
      @apply w-auto;
    }
  }
}
</style>
