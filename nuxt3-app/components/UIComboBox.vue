<script setup lang="ts">
import { createPopper } from "@popperjs/core"
import type { ZodString } from "zod"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
  placeholder?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  items?: Array<{ value: string, text?: string }>,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  schema?: ZodString,
  modelValue?: string,
  filter?: (input: string) => string,
  error?: string,
}>(), {
  halign: "start",
  items: () => [],
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
  focused: false,
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

const inputRef = ref()
const pickerRef = ref()

let popper: ReturnType<typeof createPopper>

onMounted(() => {
  popper = createPopper(inputRef.value, pickerRef.value, {
    placement: "bottom-start",
  })

  onUnmounted(() => {
    popper?.destroy()
  })
})

function onFocus(event: Event) {
  data.focused = true

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

async function onKeydown(event: KeyboardEvent) {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "Enter") {
    return
  }

  if (pickerRef.value) {
    const pickerEl = pickerRef.value
    if (pickerEl.style.display === "none") {
      await onInputPickerButtonMouseDown(event)
    } else if (event.key === "Enter") {
      const itemEl = pickerEl.querySelector('.UIComboBox-PickerItem[data-selected="true"]')
      if (itemEl) {
        itemEl.dispatchEvent(new MouseEvent("mousedown"))
      }
    } else {
      const isUp = event.key === "ArrowUp"
      const itemEls = pickerEl.querySelectorAll(".UIComboBox-PickerItem")
      let prevSelected = true
      let selected
      for (let i = 0; i < itemEls.length; i++) {
        const itemEl = (itemEls[isUp ? itemEls.length - i - 1 : i] as HTMLElement)
        if (itemEl.dataset.selected) {
          if (i === itemEls.length - 1) {
            selected = undefined
          } else {
            delete itemEl.dataset.selected
            prevSelected = true
          }
        } else if (prevSelected) {
          selected = itemEl
          prevSelected = false
        }
      }

      if (selected) {
        selected.dataset.selected = "true"
      }
    }
  }
}

function onBlur(event: Event) {
  if (pickerRef.value) {
    pickerRef.value.style.display = "none"
  }

  const target = event.target as HTMLInputElement
  let value = props.filter ? props.filter(target.value) : target.value
  value = props.items.find(item => item.value === value || item.text === value)?.value || data.value
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

  data.focused = false
  emits("blur", event)
}

async function onInputPickerButtonMouseDown(event: Event) {
  event.preventDefault()
  if (props.disabled) {
    return
  }

  if (pickerRef.value) {
    const pickerEl = pickerRef.value
    if (inputRef.value) {
      const inputEl = inputRef.value
      inputEl.focus()
      pickerEl.style.width = `${inputEl.offsetWidth}px`
    }
    pickerEl.style.display = ""

    const itemValueEls = pickerEl.querySelectorAll(".UIComboBox-PickerItemValue")
    let maxOffsetWidth = 0
    for (let i = 0; i < itemValueEls.length; i++) {
      itemValueEls[i].style.width = undefined
      maxOffsetWidth = Math.max(itemValueEls[i].offsetWidth, maxOffsetWidth)
    }
    for (let i = 0; i < itemValueEls.length; i++) {
      itemValueEls[i].style.width = `${maxOffsetWidth}px`
    }

    const itemEls = pickerEl.querySelectorAll(".UIComboBox-PickerItem")
    for (let i = 0; i < itemEls.length; i++) {
      const itemEl = itemEls[i]
      if ((itemEl.dataset.value ?? "") === data.value) {
        itemEl.dataset.selected = "true"
      } else {
        delete itemEl.dataset.selected
      }
    }
  }

  await popper?.update()
}

async function onPickerItemMouseDown(event: Event) {
  const target = event.target as HTMLElement
  const value = target.dataset.value ?? ""
  if (value !== data.value) {
    data.value = value
    emits("update:modelValue", data.value)
    emits("change", event)
  }
  await nextTick(() => inputRef.value?.blur())
}

function onPikcerItemMouseEnter(event: Event) {
  const target = event.target as HTMLElement
  const itemEls = target.parentElement?.querySelectorAll('.UIComboBox-PickerItem[data-selected="true"]')
  if (itemEls) {
    for (let i = 0; i < itemEls.length; i++) {
      const itemEl = (itemEls[i] as HTMLElement)
      delete itemEl.dataset.selected
    }
  }
  target.dataset.selected = "true"
}

function validate(value: string) {
  let error = ""

  if (value) {
    if (!props.items.some(item => item.value === value)) {
      error = "値が不正です。"
    } else {
      const schema = props.schema
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
    class="UIComboBox"
    :data-halign="props.halign || undefined"
    :data-size="props.size"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UIComboBox-Content">
      <div v-if="props.prefix && data.value" class="UIComboBox-Prefix">{{ props.prefix }}</div>
      <div class="UIComboBox-Text">{{ props.items.find(item => item.value === data.value)?.text }}</div>
      <div v-if="props.suffix && data.value" class="UIComboBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UIComboBox-Content">
      <div v-if="props.prefix" class="UIComboBox-Prefix">{{ props.prefix }}</div>
      <div class="UIComboBox-InputArea">
        <input
          ref="inputRef"
          class="UIComboBox-Input"
          type="text"
          :class="props.inputClass"
          :style="props.inputStyle"
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
          @keydown="onKeydown"
        />
        <div class="UIComboBox-InputPickerButton" @mousedown="onInputPickerButtonMouseDown">
          <UIIcon name="chevron-down" />
        </div>
      </div>
      <div v-if="props.suffix" class="UIComboBox-Suffix">{{ props.suffix }}</div>
    </div>
    <ul
      ref="pickerRef"
      class="UIComboBox-Picker"
      style="display: none"
      @mousedown="onPickerMouseDown"
    >
      <li
        v-for="(item, index) in (props.required ? props.items : [{ value: '', text: props.placeholder }, ...props.items])"
        :key="index"
        class="UIComboBox-PickerItem"
        :data-value="item.value"
        @mousedown="onPickerItemMouseDown"
        @mouseenter="onPikcerItemMouseEnter"
      >
        <div
          v-if="item.value"
          class="UIComboBox-PickerItemValue"
        >{{ item.value }}</div>
        <div
          v-if="item.text"
          class="UIComboBox-PickerItemText"
        >{{ item.text }}</div>
      </li>
    </ul>
    <div
      v-if="data.error"
      class="UIComboBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIComboBox-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UIComboBox-InputArea {
  @apply flex-auto
    grid;
}

.UIComboBox-Input {
  @apply appearance-none flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    pl-[0.25em] pr-8 py-[0.125em]
    min-w-0
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
  grid-area: 1/1;

  &[data-empty="true"] {
    @apply text-gray-400;
  }
}

.UIComboBox-InputOption {
  @apply text-gray-900;
}

.UIComboBox-InputPickerButton {
  @apply justify-self-end
    flex items-center justify-end
    px-1;
  grid-area: 1/1;

  .UIIcon {
    @apply text-2xl;
  }
}

.UIComboBox-Picker {
  @apply flex flex-col
    shadow-lg
    max-h-[20rem]
    border border-gray-300 rounded-md
    bg-white
    overflow-auto
    z-[1000];
}

.UIComboBox-PickerItem {
  @apply flex flex-row items-center gap-1
    first:rounded-t-md last:rounded-b-md
    px-2;
}

.UIComboBox-PickerItem[data-selected="true"] {
  @apply text-white bg-blue-500;
}

.UIComboBox-PickerItemValue,
.UIComboBox-PickerItemText {
  @apply flex flex-row items-center
    select-none pointer-events-none;
}

.UIComboBox-Error {
  @apply text-sm text-red-500;
}

.UIComboBox[data-readonly="true"] {
  .UIComboBox-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UIComboBox-Text {
    @apply whitespace-pre-wrap;
  }
}

.UIComboBox[data-size="lg"] {
  .UIComboBox-Content {
    @apply text-lg;
  }
}

.UIComboBox[data-size="sm"] {
  .UIComboBox-Content {
    @apply text-sm;
  }
}

.UIComboBox[data-halign="start"] {
  .UIComboBox-Input {
    @apply text-start;
  }

  &[data-readonly="true"] .UIComboBox-Content {
    @apply justify-start;
  }
}

.UIComboBox[data-halign="center"] {
  .UIComboBox-Input {
    @apply text-center;
  }

  &[data-readonly="true"] .UIComboBox-Content {
    @apply justify-center;
  }
}

.UIComboBox[data-halign="end"] {
  .UIComboBox-Input {
    @apply text-end;
  }

  &[data-readonly="true"] .UIComboBox-Content {
    @apply justify-end;
  }
}
</style>
