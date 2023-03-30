<script setup lang="ts">
import { createPopper } from '@popperjs/core'
import { ValidatorKey } from "@/utils/validator"
import { ZodDate } from "zod"
import { eachDayOfInterval, startOfDay, startOfWeek, lastDayOfWeek, lastDayOfMonth, startOfMonth, isSameMonth, isSameDay, sub, add, format, parseISO } from "date-fns"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  format?: string
  schema?: ZodDate
  modelValue?: string
}>(), {
  type: "text",
  required: false,
  format: 'uuuu/MM/dd',
  modelValue: "",
})

const data = reactive({
  value: props.modelValue || "",
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})

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
    placement: "bottom-end"
  })

  onUnmounted(() => {
    popper?.destroy()
  })
})

const validate = (value: string, format?: string) => {
  data.error = ""

  let date = parseDate(value, format)
  if (date) {
    if (props.schema) {
      const result = props.schema.safeParse(date, {
        errorMap: JapaneseErrorMap
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

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", data.value)
}

function onFocus(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.value) {
    const date = parseDate(target.value, props.format)
    if (date) {
      data.value = formatDate(date, "uuuuMMdd")
    }
  }
}

function onBlur(event: Event) {
  pickerRef.value?.classList.add("hidden")

  const target = event.target as HTMLInputElement
  const validated = validate(target.value)
  if (validated) {
    data.value = formatDate(validated, props.format)
    emits("update:modelValue", data.value)
  }
}

function onPickerIconMouseDown(event: Event) {
  event.preventDefault()
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
  data.value = format(date, "uuuuMMdd")
  nextTick(() => inputRef.value?.blur())
}

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      return validate(data.value, props.format)
    })

    validator.on("clear", name, () => {
      data.error = ""
    })
  }
}
</script>

<template>
  <div class="DateBox">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div class="relative">
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center" @mousedown="onPickerIconMouseDown">
        <Icon class="m-auto" icon="mdi:calendar" width="24px" height="24px" inline />
      </div>
      <input ref="inputRef" type="text" :placeholder="placeholder"
        :value="data.value"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        class="p-2 pr-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600"
        :class="{
          'block': !halign,
          'w-full': !halign,
          'self-start': halign === 'start',
          'self-center': halign === 'center',
          'self-end': halign === 'end',
        }"
      />
    </div>
    <div ref="pickerRef" @mousedown="onPickerMouseDown"
      class="hidden grid grid-cols-7 justify-contents-center align-contents-center p-2 bg-white rounded-md shadow-lg"
    >
      <div @click="onPickerPrevButtonClick"
        class="flex items-center justify-center w-8 h-8 rounded-md cursor-default hover:bg-gray-100"
      ><Icon icon="mdi:arrow-left" width="24px" height="24px" inline /></div>
      <div class="col-span-5 flex items-center justify-center h-8"
      >{{ format(pickerData.current, "uuuu/MM") }}</div>
      <div @click="onPickerNextButtonClick"
        class="flex items-center justify-center w-8 h-8 rounded-md cursor-default hover:bg-gray-100"
      ><Icon icon="mdi:arrow-right" width="24px" height="24px" inline /></div>
      <div v-for="week in ['日', '月', '火', '水', '木', '金', '土']"
        class="flex font-medium text-gray-500 items-center justify-center w-8 h-6"
      >{{ week }}</div>
      <div v-for="date in eachDayOfInterval({
          start: startOfWeek(startOfMonth(pickerData.current)),
          end: lastDayOfWeek(lastDayOfMonth(pickerData.current)),
        })"
        @click="() => onPickerDateClick(date)"
        class="flex font-medium items-center justify-center h-8 rounded-md cursor-default"
        :class="{
          'text-white': isSameDay(pickerData.start, date),
          'bg-blue-700': isSameDay(pickerData.start, date),
          'hover:bg-blue-800': isSameDay(pickerData.start, date),
          'hover:bg-gray-100': !isSameDay(pickerData.start, date),
          'text-gray-500': !isSameMonth(pickerData.current, date),
        }"
      >{{ date.getDate() }}</div>
    </div>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
