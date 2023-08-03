<script setup lang="ts">
import { createPopper } from "@popperjs/core"
import { ZodDate } from "zod"
import { eachDayOfInterval, startOfDay, startOfWeek, lastDayOfWeek, lastDayOfMonth, startOfMonth, isSameDay, sub, add } from "date-fns"
import { ValidatorKey } from "~/utils/validator"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"
import { toHalfwidthAscii } from "~/utils/functions"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
  placeholder?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  format?: string,
  schema?: ZodDate,
  modelValue?: string,
}>(), {
  required: false,
  format: "uuuu/MM/dd",
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
  data.value = data.focused ? props.modelValue : formatDate(props.modelValue, props.format)
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

const inputRef = ref()
const pickerRef = ref()

const start = startOfDay(new Date())
const pickerData = reactive({
  start,
  current: start,
})

let popper: ReturnType<typeof createPopper>

onMounted(() => {
  popper = createPopper(inputRef.value, pickerRef.value, {
    placement: "bottom-end",
  })

  onUnmounted(() => {
    popper?.destroy()
  })
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string): void,
  (event: "blur", value: Event): void,
}>()

function onFocus(event: Event) {
  data.focused = true

  const target = event.target as HTMLInputElement
  if (target.value) {
    const date = parseDate(target.value, props.format)
    if (date) {
      data.value = formatDate(date, "uuuuMMdd")
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

  pickerRef.value?.classList.add("hidden")

  const target = event.target as HTMLInputElement
  const validated = validate(toHalfwidthAscii(target.value))
  if (validated) {
    data.value = formatDate(validated, props.format)
    emits("update:modelValue", data.value)
  }

  emits("blur", event)
}

function onPickerIconMouseDown(event: Event) {
  event.preventDefault()
  if (props.disabled) {
    return
  }

  inputRef.value?.focus()

  pickerData.start = parseDate(data.value) || startOfDay(new Date())
  pickerData.current = pickerData.start

  pickerRef.value?.classList.remove("hidden")
  popper?.update()
}

function onPickerMouseDown(event: Event) {
  event.preventDefault()
}

function onPickerPrevButtonClick() {
  pickerData.current = sub(pickerData.current, { months: 1 })
}

function onPickerNextButtonClick() {
  pickerData.current = add(pickerData.current, { months: 1 })
}

function onPickerDateClick(date: Date) {
  data.value = formatDate(date, "uuuuMMdd")
  nextTick(() => inputRef.value?.blur())
}

function validate(value: string, format?: string) {
  data.error = ""

  let date = parseDate(value, format)
  if (date) {
    if (props.schema) {
      const result = props.schema.safeParse(date, {
        errorMap: JapaneseErrorMap,
      })
      if (result.success) {
        date = result.data
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
    return formatDate(date, "uuuu-MM-dd")
  }
}

function getFormatMaxLength(format: string) {
  return format.length * 4
}
</script>

<template>
  <div class="UIDateBox">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200"
    >{{ data.value || '&#8203;' }}</div>
    <div
      v-else
      class="relative"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
      ]"
    >
      <input
        ref="inputRef"
        type="text"
        inputmode="numeric"
        class="pl-2 pr-10 py-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md outline-none disabled:text-gray-400 disabled:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        :class="[
          halign ? `self-${halign}` : 'block w-full',
        ]"
        :placeholder="placeholder"
        :tabindex="tabindex"
        :maxlength="maxLength"
        :value="data.value"
        :disabled="disabled"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center" @mousedown="onPickerIconMouseDown">
        <UIIcon name="calendar" class="text-2xl" :class="[disabled ? 'text-gray-400' : '']" />
      </div>
    </div>
    <div
      ref="pickerRef"
      class="hidden grid grid-cols-7 justify-contents-center align-contents-center text-sm p-2 bg-white rounded-md shadow-lg z-10"
      @mousedown="onPickerMouseDown"
    >
      <div
        class="flex items-center justify-center w-8 h-8 rounded-md cursor-default hover:bg-gray-100"
        @click="onPickerPrevButtonClick"
      >
        <UIIcon name="arrow-left" class="text-2xl" />
      </div>
      <div class="col-span-5 flex items-center justify-center h-8">{{ formatDate(pickerData.current, "uuuu/MM") }}</div>
      <div
        class="flex items-center justify-center w-8 h-8 rounded-md cursor-default hover:bg-gray-100"
        @click="onPickerNextButtonClick"
      >
        <UIIcon name="arrow-right" class="text-2xl" />
      </div>
      <div
        v-for="week in ['日', '月', '火', '水', '木', '金', '土']"
        :key="week"
        class="flex font-medium text-gray-400 items-center justify-center w-8 h-6"
      >{{ week }}</div>
      <div
        v-for="date in eachDayOfInterval({
          start: startOfWeek(startOfMonth(pickerData.current)),
          end: lastDayOfWeek(lastDayOfMonth(pickerData.current)),
        })"
        :key="date.getTime()"
        class="flex font-medium items-center justify-center h-8 rounded-md cursor-default"
        :class="[
          isSameDay(pickerData.start, date) ? 'text-white bg-blue-700 hover:bg-blue-800' : 'text-gray-400 hover:bg-gray-100',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
        :style="props.inputStyle"
        @click="() => onPickerDateClick(date)"
      >{{ date.getDate() }}</div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style scoped>
.DateBox input[type="number"]::-webkit-inner-spin-button,
.DateBox input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
