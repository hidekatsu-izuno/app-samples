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
  <div class="UINumberBox">
    <label
      v-if="props.label"
      class="block"
    >{{ props.label }} <span v-if="props.required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="flex flex-row items-center justify-start gap-2 px-2 py-1 text-gray-900 border border-gray-200"
    >
      <template v-if="data.value">
        <div v-if="props.prefix">{{ props.prefix }}</div>
        <div class=" whitespace-pre-wrap">{{ data.value || "&#8203;" }}</div>
        <div v-if="props.suffix">{{ props.suffix }}</div>
      </template>
      <template v-else>&#8203;</template>
    </div>
    <div
      v-else
      class="flex flex-row items-center gap-2"
      :class="[
        props.halign === 'start' ? 'justify-start' :
        props.halign === 'center' ? 'justify-center' :
        props.halign === 'end' ? 'justify-start' :
        '',
      ]"
    >
      <div v-if="props.prefix">{{ props.prefix }}</div>
      <input
        type="text"
        inputmode="decimal"
        class="px-2 py-1 text-right text-gray-900 bg-gray-50 border border-gray-300 rounded-md outline-none disabled:text-gray-400 disabled:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        :class="[
          props.halign ? '' : 'w-full',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
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
      <div v-if="props.suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UINumberBox > input[type="number"]::-webkit-inner-spin-button,
.UINumberBox > input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
