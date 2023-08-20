<script setup lang="ts">
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
  modelValue?: string,
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
  value: "",
  error: "",
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

function onChange(event: Event) {
  if (data.error) {
    data.error = ""
    emits("update:error", data.error)
  }

  const target = event.target as HTMLSelectElement
  data.value = target.value
  emits("update:modelValue", data.value)

  try {
    validate(target.value)
    emits("change", event)
  } catch (err) {
    // no handle
  }
}

function onBlur(event: Event) {
  try {
    validate(data.value)
  } catch (err) {
    // no handle
  }
  emits("blur", event)
}

function validate(value: string) {
  let error = ""

  if (value) {
    // no handle
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
    class="UISelectBox"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UISelectBox-Content">
      <div v-if="props.prefix && data.value" class="UISelectBox-Prefix">{{ props.prefix }}</div>
      <div class="UISelectBox-Text">{{ props.items.find(item => item.value === data.value)?.text }}</div>
      <div v-if="props.suffix && data.value" class="UISelectBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UISelectBox-Content">
      <div v-if="props.prefix" class="UISelectBox-Prefix">{{ props.prefix }}</div>
      <div class="UISelectBox-InputArea">
        <select
          class="UISelectBox-Input"
          :class="props.inputClass"
          :style="props.inputStyle"
          :disabled="props.disabled"
          :tabindex="props.tabindex"
          :value="data.value"
          :data-empty="!data.value"
          @focus="onFocus"
          @change="onChange"
          @blur="onBlur"
        >
          <option class="UISelectBox-InputOption" :disabled="props.required">{{ props.placeholder }}</option>
          <option v-for="(item, index) in items" :key="index" class="UISelectBox-InputOption" :value="item.value">{{ item.text == null ? item.value : item.text }}</option>
        </select>
        <div class="UISelectBox-InputPickerButton">
          <UIIcon name="chevron-down" />
        </div>
      </div>
      <div v-if="props.suffix" class="UISelectBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UISelectBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UISelectBox-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UISelectBox-InputArea {
  @apply flex-auto
    grid;
}

.UISelectBox-Input {
  @apply appearance-none flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    pl-[0.5em] pr-8 py-[0.25em]
    min-w-0
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
  grid-area: 1/1;

  &[data-empty="true"] {
    @apply text-gray-400;
  }
}

.UISelectBox-InputOption {
  @apply text-gray-900;
}

.UISelectBox-InputPickerButton {
  @apply flex items-center justify-end
    px-1
    pointer-events-none;
  grid-area: 1/1;

  .UIIcon {
    @apply text-2xl;
  }
}

.UISelectBox-Error {
  @apply text-sm text-red-500;
}

.UISelectBox[data-readonly="true"] {
  .UISelectBox-Content {
    @apply min-h-[calc(1.5em+(0.25em+1px)*2)]
      border border-gray-200
      px-[0.5em] py-[0.25em]
      text-gray-900;
  }

  .UISelectBox-Text {
    @apply whitespace-pre-wrap;
  }
}

.UISelectBox[data-size="lg"] {
  .UISelectBox-Content {
    @apply text-lg;
  }
}

.UISelectBox[data-size="sm"] {
  .UISelectBox-Content {
    @apply text-sm;
  }
}

.UISelectBox[data-halign="start"] {
  .UISelectBox-Input {
    @apply text-start;
  }

  &[data-readonly="true"] .UISelectBox-Content {
    @apply justify-start;
  }
}

.UISelectBox[data-halign="center"] {
  .UISelectBox-Input {
    @apply text-center;
  }

  &[data-readonly="true"] .UISelectBox-Content {
    @apply justify-center;
  }
}

.UISelectBox[data-halign="end"] {
  .UISelectBox-Input {
    @apply text-end;
  }

  &[data-readonly="true"] .UISelectBox-Content {
    @apply justify-end;
  }
}
</style>
