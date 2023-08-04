<script setup lang="ts">
import { ZodString } from "zod"
import { ValidatorKey } from "~/utils/validator"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"

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
  schema?: ZodString,
  modelValue?: string,
  filter?: (input: string) => string,
}>(), {
  required: false,
  modelValue: "",
})

const data = reactive({
  value: "",
  error: "",
  ime: false,
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
}, { immediate: true })

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
  (event: "update:modelValue", value: string): void,
  (event: "blur", value: Event): void,
}>()

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
  }
  emits("update:modelValue", target.value)
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
  const validated = validate(props.filter ? props.filter(target.value) : target.value)
  if (validated) {
    data.value = validated
    emits("update:modelValue", data.value)
  }

  emits("blur", event)
}

function validate(value: string) {
  data.error = ""

  if (value) {
    const schema = props.schema

    if (schema) {
      const result = schema.safeParse(value, {
        errorMap: JapaneseErrorMap,
      })
      if (result.success) {
        value = result.data
      } else {
        data.error = result.error.issues[0].message
      }
    }
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
  <div class="UITextArea"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UITextArea-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UITextArea-Content"
    >
      <div v-if="props.prefix && data.value" class="UITextArea-Prefix">{{ props.prefix }}</div>
      <div class="UITextArea-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UITextArea-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UITextArea-Content"
    >
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
  @apply
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    w-full
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400
    resize-none;
}

.UITextArea-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
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

.UITextArea[data-readonly="true"] {
  .UITextArea-Content {
    @apply justify-start
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UITextArea[data-readonly="true"]) {
  .UITextArea[data-halign="start"] {
    .UITextArea-Content {
      @apply justify-start;
    }

    .UITextArea-Input {
      @apply w-auto;
    }
  }

  .UITextArea[data-halign="center"] {
    .UITextArea-Content {
      @apply justify-center;
    }

    .UITextArea-Input {
      @apply w-auto;
    }
  }

  .UITextArea[data-halign="end"] {
    .UITextArea-Content {
      @apply justify-end;
    }

    .UITextArea-Input {
      @apply w-auto;
    }
  }
}
</style>
