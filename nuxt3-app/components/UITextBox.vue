<script setup lang="ts">
import type { ZodSchema, ZodString } from "zod"
import { z } from "zod"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"

const props = withDefaults(defineProps<{
  type?: "text" | "password" | "email" | "tel" | "url",
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
  schema?: ZodString,
  modelValue?: string,
  filter?: (input: string) => string,
  error?: string,
}>(), {
  type: "text",
  halign: "start",
  required: false,
  disabled: false,
  readonly: false,
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
  maxLength: undefined as number | undefined,
  value: "",
  error: "",
  ime: false,
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
}, { immediate: true })

watch(() => props.schema?.maxLength, () => {
  data.maxLength = props.schema?.maxLength ?? undefined
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
  let value = props.filter ? props.filter(target.value) : target.value
  if (props.type === "email" || props.type === "tel") {
    value = toHalfwidthAscii(value)
  }
  if (value !== data.value) {
    data.value = value
    emits("update:modelValue", data.value)
  }

  try {
    validate(data.value)
    emits("change", event)
  } catch (err) {
    // no handle
  }

  emits("blur", event)
}

function validate(value: string) {
  let error = ""

  if (value) {
    let schema: ZodSchema | undefined = props.schema
    if (!schema) {
      if (props.type === "email") {
        schema = z.string().email()
      } else if (props.type === "tel") {
        schema = z.string().refine(isTelephoneNo, "電話番号の書式に誤りがあります。")
      } else if (props.type === "url") {
        schema = z.string().url()
      }
    }

    if (schema) {
      const result = schema.safeParse(value, {
        errorMap: JapaneseErrorMap,
      })
      if (result.success) {
        value = result.data
      } else {
        error = result.error.issues[0].message
      }
    }
  } else if (props.required) {
    error = "必須入力です。"
  }

  if (!error) {
    return value || undefined
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
    class="UITextBox"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UITextBox-Content">
      <div v-if="props.prefix && data.value" class="UITextBox-Prefix">{{ props.prefix }}</div>
      <div class="UITextBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UITextBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UITextBox-Content">
      <div v-if="props.prefix" class="UITextBox-Prefix">{{ props.prefix }}</div>
      <input
        class="UITextBox-Input"
        :class="props.inputClass"
        :style="props.inputStyle"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        :maxlength="data.maxLength"
        :value="data.value"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <div v-if="props.suffix" class="UITextBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UITextBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UITextBox-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UITextBox-Input {
  @apply flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-[0.25em] py-[0.125em]
    min-w-0
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
}

.UITextBox-Error {
  @apply text-sm text-red-500;
}

.UITextBox[data-readonly="true"] {
  .UITextBox-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UITextBox-Text {
    @apply whitespace-pre-wrap;
  }
}

.UITextBox[data-size="lg"] {
  .UITextBox-Content {
    @apply text-lg;
  }
}

.UITextBox[data-size="sm"] {
  .UITextBox-Content {
    @apply text-sm;
  }
}

.UITextBox[data-halign="start"] {
  .UITextBox-Input {
    @apply text-start;
  }

  &[data-readonly="true"] .UITextBox-Content {
    @apply justify-start;
  }
}

.UITextBox[data-halign="center"] {
  .UITextBox-Input {
    @apply text-center;
  }

  &[data-readonly="true"] .UITextBox-Content {
    @apply justify-center;
  }
}

.UITextBox[data-halign="end"] {
  .UITextBox-Input {
    @apply text-end;
  }

  &[data-readonly="true"] .UITextBox-Content {
    @apply justify-end;
  }
}
</style>
