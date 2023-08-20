<script setup lang="ts">
import { createPopper } from "@popperjs/core"
import { ZodDate } from "zod"
import { eachDayOfInterval, startOfDay, startOfWeek, lastDayOfWeek, lastDayOfMonth, startOfMonth, isSameDay, sub, add } from "date-fns"
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
  schema?: ZodDate,
  modelValue?: string,
  error?: string,
}>(), {
  halign: "start",
  required: false,
  format: "uuuu/MM/dd",
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
  if (pickerRef.value) {
    pickerRef.value.style.display = "none"
  }

  const target = event.target as HTMLInputElement
  try {
    const value = validate(toHalfwidthAscii(target.value))
    const svalue = formatDate(value, props.format)
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

function onMouseDown(event: Event) {
  if (pickerRef.value) {
    pickerRef.value.style.display = "none"
  }
}

function onInputPickerButtonMouseDown(event: Event) {
  event.preventDefault()
  if (props.disabled) {
    return
  }

  inputRef.value?.focus()

  pickerData.start = parseDate(data.value) || startOfDay(new Date())
  pickerData.current = pickerData.start

  if (pickerRef.value) {
    pickerRef.value.style.display = ""
  }
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

function onPickerDateClick(event: Event, date: Date) {
  const value = formatDate(date, "uuuuMMdd")
  if (value !== data.value) {
    data.value = value
    emits("update:modelValue", data.value)
    emits("change", event)
  }

  nextTick(() => inputRef.value?.blur())
}

function validate(value: string) {
  let error = ""

  let date
  if (value) {
    if (/^[0-9]{8}|[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
      date = parseDate(value)
    } else {
      date = parseDate(value, props.format)
    }
  }

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
    return formatDate(date, "uuuu-MM-dd") || undefined
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
    class="UIDateBox"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UIDateBox-Content">
      <div v-if="props.prefix && data.value" class="UIDateBox-Prefix">{{ props.prefix }}</div>
      <div class="UIDateBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UIDateBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UIDateBox-Content">
      <div v-if="props.prefix" class="UIDateBox-Prefix">{{ props.prefix }}</div>
      <div class="UIDateBox-InputArea">
        <input
          ref="inputRef"
          class="UIDateBox-Input"
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
          @mousedown="onMouseDown"
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
        />
        <div class="UIDateBox-InputPickerButton" @mousedown="onInputPickerButtonMouseDown">
          <UIIcon name="calendar" />
        </div>
      </div>
      <div v-if="props.suffix" class="UIDateBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      ref="pickerRef"
      class="UIDateBox-Picker"
      style="display: none"
      @mousedown="onPickerMouseDown"
    >
      <div
        class="UIDateBox-PickerPrevInput"
        @click="onPickerPrevButtonClick"
      >
        <UIIcon name="arrow-left" />
      </div>
      <div class="UIDateBox-PickerMonth">{{ formatDate(pickerData.current, "uuuu/MM") }}</div>
      <div
        class="UIDateBox-PickerNextInput"
        @click="onPickerNextButtonClick"
      >
        <UIIcon name="arrow-right" />
      </div>
      <div class="UIDateBox-PickerSunday" />
      <div class="UIDateBox-PickerMonday" />
      <div class="UIDateBox-PickerTuesday" />
      <div class="UIDateBox-PickerWednesday" />
      <div class="UIDateBox-PickerThursday" />
      <div class="UIDateBox-PickerFriday" />
      <div class="UIDateBox-PickerSaturday" />
      <div
        v-for="date in eachDayOfInterval({
          start: startOfWeek(startOfMonth(pickerData.current)),
          end: lastDayOfWeek(lastDayOfMonth(pickerData.current)),
        })"
        :key="date.getTime()"
        class="UIDateBox-PickerDate"
        :class="[
          isSameDay(pickerData.start, date) ? 'UIDateBox-PickerDate-today' : '',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
        :style="props.inputStyle"
        @click="(event) => onPickerDateClick(event, date)"
      >{{ date.getDate() }}</div>
    </div>
    <div
      v-if="data.error"
      class="UIDateBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIDateBox-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UIDateBox-InputArea {
  @apply flex-auto
    grid;
}

.UIDateBox-Input {
  @apply flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    pl-[0.25em] pr-8 py-[0.125em]
    min-w-0
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
  grid-area: 1/1;
}

.UIDateBox-InputPickerButton {
  @apply justify-self-end
    flex items-center justify-end
    px-1;
  grid-area: 1/1;

  .UIIcon {
    @apply text-2xl;
  }
}

.UIDateBox-Picker {
  @apply grid grid-cols-7 justify-center items-center
    shadow-lg
    rounded-md
    p-2
    bg-white
    text-sm
    z-[1000];
}

.UIDateBox-PickerPrevInput,
.UIDateBox-PickerNextInput {
  @apply flex items-center justify-center
    rounded-md
    w-8 h-8
    hover:bg-gray-100
    cursor-default;

  .UIIcon {
    @apply text-2xl;
  }
}

.UIDateBox-PickerMonth {
  @apply col-span-5
    flex items-center justify-center
    h-8;
}

.UIDateBox-PickerSunday,
.UIDateBox-PickerMonday,
.UIDateBox-PickerTuesday,
.UIDateBox-PickerWednesday,
.UIDateBox-PickerThursday,
.UIDateBox-PickerFriday,
.UIDateBox-PickerSaturday {
  @apply flex items-center justify-center
    w-8 h-6
    font-bold text-gray-400;
}

.UIDateBox-PickerSunday::before {
  content: '日'
}
.UIDateBox-PickerMonday::before {
  content: '月'
}
.UIDateBox-PickerTuesday::before {
  content: '火'
}
.UIDateBox-PickerWednesday::before {
  content: '水'
}
.UIDateBox-PickerThursday::before {
  content: '木'
}
.UIDateBox-PickerFriday::before {
  content: '金'
}
.UIDateBox-PickerSaturday::before {
  content: '土'
}

.UIDateBox-PickerDate {
  @apply flex items-center justify-center
    rounded-md
    h-8
    hover:bg-gray-100
    cursor-default;
}

.UIDateBox-PickerDate-today {
  @apply bg-blue-700 hover:bg-blue-800
    text-white font-bold;
}

.UIDateBox-Error {
  @apply text-sm text-red-500;
}

.UIDateBox[data-readonly="true"] {
  .UIDateBox-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UIDateBox-Text {
    @apply whitespace-pre-wrap;
  }
}

.UIDateBox[data-size="lg"] {
  .UIDateBox-Content {
    @apply text-lg;
  }
}

.UIDateBox[data-size="sm"] {
  .UIDateBox-Content {
    @apply text-sm;
  }
}

.UIDateBox[data-halign="start"] {
  .UIDateBox-Input {
    @apply text-start;
  }

  &[data-readonly="true"] .UIDateBox-Content {
    @apply justify-start;
  }
}

.UIDateBox[data-halign="center"] {
  .UIDateBox-Input {
    @apply text-center;
  }

  &[data-readonly="true"] .UIDateBox-Content {
    @apply justify-center;
  }
}

.UIDateBox[data-halign="end"] {
  .UIDateBox-Input {
    @apply text-end;
  }

  &[data-readonly="true"] .UIDateBox-Content {
    @apply justify-end;
  }
}
</style>
