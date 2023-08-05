<script setup lang="ts">
import { createPopper } from "@popperjs/core"
import { ZodDate } from "zod"
import { eachDayOfInterval, startOfDay, startOfWeek, lastDayOfWeek, lastDayOfMonth, startOfMonth, isSameDay, sub, add } from "date-fns"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"
import { toHalfwidthAscii } from "~/utils/functions"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
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
  format?: string,
  schema?: ZodDate,
  modelValue?: string,
  error?: string,
}>(), {
  required: false,
  format: "uuuu/MM/dd",
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
  data.focused = false

  if (pickerRef.value) {
    pickerRef.value.style.display = "none"
  }

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

function onPickerDateClick(date: Date) {
  data.value = formatDate(date, "uuuuMMdd")
  nextTick(() => inputRef.value?.blur())
}

function validate(value: string) {
  let error = ""

  let date = parseDate(value, data.focused ? "uuuuMMdd" : props.format)
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
    return formatDate(date, "uuuu-MM-dd")
  }

  if (error !== data.error) {
    data.error = error
    emits("update:error", data.error)
  }
}

function getFormatMaxLength(format: string) {
  return format.length * 4
}
</script>

<template>
  <div
    class="UIDateBox"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UIDateBox-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UIDateBox-Content"
    >
      <div v-if="props.prefix && data.value" class="UIDateBox-Prefix">{{ props.prefix }}</div>
      <div class="UIDateBox-Text">{{ data.value }}</div>
      <div v-if="props.suffix && data.value" class="UIDateBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UIDateBox-Content"
    >
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
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
        >
        <div class="UIDateBox-InputCalender" @mousedown="onPickerIconMouseDown">
          <UIIcon name="calendar" />
        </div>
      </div>
      <div v-if="props.suffix" class="UIDateBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      ref="pickerRef"
      class="UIDateBox-Calender"
      style="display: none"
      @mousedown="onPickerMouseDown"
    >
      <div
        class="UIDateBox-CalendarPrevInput"
        @click="onPickerPrevButtonClick"
      >
        <UIIcon name="arrow-left" />
      </div>
      <div class="UIDateBox-CalendarMonth">{{ formatDate(pickerData.current, "uuuu/MM") }}</div>
      <div
        class="UIDateBox-CalendarNextInput"
        @click="onPickerNextButtonClick"
      >
        <UIIcon name="arrow-right" />
      </div>
      <div class="UIDateBox-CalenderSunday" />
      <div class="UIDateBox-CalenderMonday" />
      <div class="UIDateBox-CalenderTuesday" />
      <div class="UIDateBox-CalenderWednesday" />
      <div class="UIDateBox-CalenderThursday" />
      <div class="UIDateBox-CalenderFriday" />
      <div class="UIDateBox-CalenderSaturday" />
      <div
        v-for="date in eachDayOfInterval({
          start: startOfWeek(startOfMonth(pickerData.current)),
          end: lastDayOfWeek(lastDayOfMonth(pickerData.current)),
        })"
        :key="date.getTime()"
        class="UIDateBox-CalenderDate"
        :class="[
          isSameDay(pickerData.start, date) ? 'UIDateBox-CalenderDate-today' : '',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
        :style="props.inputStyle"
        @click="() => onPickerDateClick(date)"
      >{{ date.getDate() }}</div>
    </div>
    <div
      v-if="data.error"
      class="UIDateBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIDateBox-Label {
  @apply block;
}

.UIDateBox-Content {
  @apply flex flex-row items-center gap-2;
}

.UIDateBox-InputArea {
  @apply grid
    w-full;
}

.UIDateBox-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    pl-2 pr-10 py-1
    w-full
    disabled:bg-gray-100
    text-gray-900 bg-gray-50 disabled:text-gray-400;
  grid-area: 1/1;
}
.UIDateBox-Input::-webkit-inner-spin-button,
.UIDateBox-Input::-webkit-outer-spin-button {
  @apply appearance-none
    m-0;
}

.UIDateBox-InputCalender {
  @apply flex items-center justify-end
    px-1;
  grid-area: 1/1;

  .UIIcon {
    @apply text-2xl;
  }
}

.UIDateBox-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UIDateBox-Error {
  @apply text-sm text-red-500;
}

.UIDateBox-Calender {
  @apply grid grid-cols-7 justify-center items-center
    shadow-lg
    rounded-md
    p-2
    bg-white
    text-sm
    z-10;
}

.UIDateBox-CalenderPrevInput,
.UIDateBox-CalendarNextInput {
  @apply flex items-center justify-center
    rounded-md
    w-8 h-8
    hover:bg-gray-100
    cursor-default;

  .UIIcon {
    @apply text-2xl;
  }
}

.UIDateBox-CalendarMonth {
  @apply col-span-5
    flex items-center justify-center
    h-8;
}

.UIDateBox-CalenderSunday,
.UIDateBox-CalenderMonday,
.UIDateBox-CalenderTuesday,
.UIDateBox-CalenderWednesday,
.UIDateBox-CalenderThursday,
.UIDateBox-CalenderFriday,
.UIDateBox-CalenderSaturday {
  @apply flex items-center justify-center
    w-8 h-6
    font-bold text-gray-400;
}

.UIDateBox-CalenderSunday::before {
  content: '日'
}
.UIDateBox-CalenderMonday::before {
  content: '月'
}
.UIDateBox-CalenderTuesday::before {
  content: '火'
}
.UIDateBox-CalenderWednesday::before {
  content: '水'
}
.UIDateBox-CalenderThursday::before {
  content: '木'
}
.UIDateBox-CalenderFriday::before {
  content: '金'
}
.UIDateBox-CalenderSaturday::before {
  content: '土'
}

.UIDateBox-CalenderDate {
  @apply flex items-center justify-center
    rounded-md
    h-8
    hover:bg-gray-100
    cursor-default;
}

.UIDateBox-CalenderDate-today {
  @apply bg-blue-700 hover:bg-blue-800
    text-white font-bold;
}

.UIDateBox[data-required="true"] {
  .UIFileUpload-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UIDateBox[data-disabled="true"] {
  .UIDateBox-InputCalender {
    .UIIcon {
      @apply text-gray-400;
    }
  }
}

.UIDateBox[data-readonly="true"] {
  .UIDateBox-Content {
    @apply justify-start
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UIDateBox[data-readonly="true"]) {
  .UIDateBox[data-halign="start"] {
    .UIDateBox-Content {
      @apply justify-start;
    }

    .UIDateBox-InputArea {
      @apply w-auto;
    }
  }

  .UIDateBox[data-halign="center"] {
    .UIDateBox-Content {
      @apply justify-center;
    }

    .UIDateBox-InputArea {
      @apply w-auto;
    }
  }

  .UIDateBox[data-halign="end"] {
    .UIDateBox-Content {
      @apply justify-end;
    }

    .UIDateBox-InputArea {
      @apply w-auto;
    }
  }
}
</style>
