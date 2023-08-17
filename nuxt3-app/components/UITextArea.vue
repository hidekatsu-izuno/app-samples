<script setup lang="ts">
import { ZodString } from "zod"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "small" | "large",
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
  error?: string,
  filter?: (input: string) => string,
}>(), {
  required: false,
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
  value: "",
  error: "",
  ime: false,
})

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
  const value = props.filter ? props.filter(target.value) : target.value
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
    if (props.schema) {
      const result = props.schema.safeParse(value, {
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
    class="UITextArea"
    :data-required="props.required || undefined"
    :data-size="props.size || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign || undefined"
  >
    <label
      v-if="props.label"
      class="UITextArea-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UITextArea-Content"
    >
      <slot name="start" />
      <div class="UITextArea-Item">
        <div v-if="props.prefix && data.value" class="UITextArea-Prefix">{{ props.prefix }}</div>
        <div class="UITextArea-Text">{{ data.value }}</div>
        <div v-if="props.suffix && data.value" class="UITextArea-Suffix">{{ props.suffix }}</div>
      </div>
      <slot name="end" />
    </div>
    <div
      v-else
      class="UITextArea-Content"
    >
      <slot name="start" />
      <div v-if="props.prefix" class="UITextArea-Prefix">{{ props.prefix }}</div>
      <textarea
        class="UITextArea-Input"
        :class="props.inputClass"
        :style="props.inputStyle"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        :value="data.value"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <div v-if="props.suffix" class="UITextArea-Suffix">{{ props.suffix }}</div>
      <slot name="end" />
    </div>
    <div
      v-if="data.error"
      class="UITextArea-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UITextArea-Label {
  @apply block;
}

.UITextArea-Content {
  @apply flex flex-row items-center gap-2;
}

.UITextArea-Input {
  @apply flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400
    resize-none;
}

.UITextArea-Item {
  @apply flex flex-row items-center gap-2;
}

.UITextArea-Text {
  @apply min-h-[calc(1rem+8px)]
    whitespace-pre-wrap;
}

.UITextArea-Error {
  @apply text-sm text-red-500;
}

.UITextArea[data-required="true"] {
  .UITextArea-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UITextArea[data-size="large"] {
  .UITextArea-Content {
    @apply text-lg;
  }

  .UITextArea-Input {
    @apply px-3 py-1.5;
  }
}

.UITextArea[data-size="large"][data-readonly="true"] {
  .UITextArea-Content {
    @apply px-3 py-1.5;
  }

  .UITextArea-Text {
    @apply min-h-[calc(1rem+12px)];
  }
}

.UITextArea[data-size="small"] {
  .UITextArea-Content {
    @apply text-sm;
  }

  .UITextArea-Input {
    @apply px-1 py-0.5;
  }
}

.UITextArea[data-size="small"][data-readonly="true"] {
  .UITextArea-Content {
    @apply px-1 py-0.5;
  }

  .UITextArea-Text {
    @apply min-h-[calc(1rem+4px)];
  }
}

.UITextArea[data-halign="start"] {
  .UITextArea-Content {
    @apply justify-start;
  }
}

.UITextArea[data-halign="center"] {
  .UITextArea-Content {
    @apply justify-center;
  }
}

.UITextArea[data-halign="end"] {
  .UITextArea-Content {
    @apply justify-end;
  }
}

.UITextArea[data-halign="start"],
.UITextArea[data-halign="center"],
.UITextArea[data-halign="end"] {
  .UITextArea-Input {
    @apply flex-initial;
  }
}

.UITextArea[data-readonly="true"] {
  .UITextArea-Item {
    @apply flex-auto
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

.UITextArea[data-readonly="true"][data-halign="start"],
.UITextArea[data-readonly="true"][data-halign="center"],
.UITextArea[data-readonly="true"][data-halign="end"] {
  .UITextArea-Item,
  .UITextArea-Text {
    @apply flex-initial;
  }
}
</style>
