<script setup lang="ts">
import { z, ZodString } from "zod"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  type?: "text" | "password" | "email" | "tel" | "url",
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
  schema?: ZodString,
  modelValue?: string,
  filter?: (input: string) => string,
  error?: string,
}>(), {
  type: "text",
  required: false,
  modelValue: "",
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string): void,
  (event: "update:error", value: string): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  value: "",
  error: "",
  ime: false,
})

const maxLength = computed(() => props.schema?.maxLength ?? undefined)

watch(() => props.modelValue, () => {
  data.value = props.modelValue
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

  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
    emits("update:error", data.error)
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
  const target = event.target as HTMLInputElement
  let value = props.filter ? props.filter(target.value) : target.value
  if (props.type === "email" || props.type === "tel") {
    value = toHalfwidthAscii(value)
  }
  const validated = validate(value)
  if (validated) {
    data.value = validated
    emits("update:modelValue", data.value)
  }

  emits("blur", event)
}

function validate(value: string) {
  let error = ""

  if (value) {
    let schema = props.schema
    if (props.type === "email") {
      if (!schema) {
        schema = z.string()
      }
      schema = schema.email()
    } else if (props.type === "tel") {
      if (!schema) {
        schema = z.string()
      }
      schema = schema.regex(/^0[0-9-]{8,9}[0-9]$/, "電話番号の書式に誤りがあります。")
    } else if (props.type === "url") {
      if (!schema) {
        schema = z.string()
      }
      schema = schema.url("URLの書式に誤りがあります。")
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
    class="UITextBox"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UITextBox-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UITextBox-Content"
    >
      <div v-if="props.prefix && data.value" class="UITextBox-Prefix">{{ props.prefix }}</div>
      <div class="UITextBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UITextBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UITextBox-Content"
    >
      <div v-if="props.prefix" class="UITextBox-Prefix">{{ props.prefix }}</div>
      <input
        class="UITextBox-Input"
        :class="props.inputClass"
        :style="props.inputStyle"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        :maxlength="maxLength"
        :value="data.value"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      >
      <div v-if="props.suffix" class="UITextBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UITextBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UITextBox-Label {
  @apply block;
}

.UITextBox-Content {
  @apply flex flex-row items-center gap-2;
}

.UITextBox-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    w-full
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
}

.UITextBox-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UITextBox-Error {
  @apply text-sm text-red-500;
}

.UITextBox[data-required="true"] {
  .UITextBox-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UITextBox[data-readonly="true"] {
  .UITextBox-Content {
    @apply justify-start
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UITextBox[data-readonly="true"]) {
  .UITextBox[data-halign="start"] {
    .UITextBox-Content {
      @apply justify-start;
    }

    .UITextBox-Input {
      @apply w-auto;
    }
  }

  .UITextBox[data-halign="center"] {
    .UITextBox-Content {
      @apply justify-center;
    }

    .UITextBox-Input {
      @apply w-auto;
    }
  }

  .UITextBox[data-halign="end"] {
    .UITextBox-Content {
      @apply justify-end;
    }

    .UITextBox-Input {
      @apply w-auto;
    }
  }
}
</style>
