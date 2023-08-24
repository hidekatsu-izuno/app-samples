<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
  prefix?: string,
  suffix?: string,
  placeholder?: string,
  name?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  items?: Array<{ value: string, text: string }>,
  columns?: number,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  modelValue?: string,
  error?: string,
}>(), {
  placeholder: "未選択",
  items: () => [],
  columns: 1,
  required: false,
  disabled: false,
  readonly: false,
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
  name: props.name || crypto.randomUUID(),
  value: "",
  focused: false,
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

function onFocusin(event: Event) {
  if (!data.focused) {
    data.focused = true
    emits("focus", event)
  }
}

function onChange(event: Event) {
  if (data.error) {
    data.error = ""
    emits("update:error", data.error)
  }

  const currentTarget = event.currentTarget as HTMLElement
  const name = (event.target as HTMLElement).getAttribute("name")
  const target = currentTarget.querySelector(`[name="${name}"]:checked`) as HTMLInputElement | null
  data.value = target ? target.value : ""
  emits("update:modelValue", data.value)

  try {
    validate(data.value)
    emits("change", event)
  } catch (err) {
    // no handle
  }
}

function onFocusout(event: Event) {
  const currentTarget = event.currentTarget as HTMLElement
  requestAnimationFrame(() => {
    if (!currentTarget.contains(document.activeElement)) {
      try {
        validate(data.value)
      } catch (err) {
        // no handle
      }
      emits("blur", event)
      data.focused = false
    }
  })
}

function validate(value: string) {
  let error = ""

  if (value) {
    // no handle
  } else if (props.required) {
    error = "必ず選択してください。"
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
    class="UIRadioList"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-size="props.size || undefined"
    :data-halign="props.halign || undefined"
    :data-columns="props.columns"
  >
    <div v-if="props.readonly" class="UIRadioList-Content">
      <div v-if="props.prefix && data.value">{{ props.prefix }}</div>
      <div class="UIRadioList-Text">{{ props.items.find(item => item.value === data.value)?.text }}</div>
      <div v-if="props.suffix && data.value">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UIRadioList-Content"
      @focusin="onFocusin"
      @focusout="onFocusout"
      @change="onChange"
    >
      <div
        v-for="(item, index) in (props.required ? props.items : [{ value: '', text: props.placeholder }, ...props.items])"
        :key="index"
        class="UIRadioList-Item"
      >
        <div v-if="props.prefix">{{ props.prefix }}</div>
        <label
          class="UIRadioList-InputLabel"
          :class="props.inputClass"
          :style="props.inputStyle"
        >
          <div class="UIRadioList-InputArea">
            <input
              class="UIRadioList-Input peer"
              type="radio"
              :name="data.name"
              :value="item.value"
              :checked="item.value === data.value"
              :disabled="props.disabled"
              :tabindex="props.tabindex"
            />
            <UIIcon name="circle-medium" class="UIRadioList-InputCheck hidden peer-checked:block" />
          </div>
          {{ item.text }}
        </label>
        <div v-if="props.suffix">{{ props.suffix }}</div>
      </div>
    </div>
    <div
      v-if="data.error"
      class="UIRadioList-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIRadioList-Content {
  @apply flex flex-col;
}

.UIRadioList-Item {
  @apply flex flex-row items-center gap-2;
}

.UIRadioList-InputLabel {
  @apply inline-flex items-center gap-1
    py-1;
}

.UIRadioList-InputArea {
  @apply grid
    w-4 h-4;
}

.UIRadioList-Input {
  @apply appearance-none
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-full
    w-full h-full
    bg-gray-50 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400;
  grid-area: 1/1;
}

.UIRadioList-InputCheck {
  @apply w-full h-full
    text-white text-base;
  grid-area: 1/1;
}

.UIRadioList-Error {
  @apply text-sm text-red-500;
}

.UIRadioList[data-readonly="true"] {
  .UIRadioList-Content {
    @apply flex-row
      min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UIRadioList-Text {
    @apply whitespace-pre-wrap;
  }
}

.UIRadioList[data-size="lg"] {
  .UIRadioList-Content {
    @apply text-lg;
  }
}

.UIRadioList[data-size="sm"] {
  .UIRadioList-Content {
    @apply text-sm;
  }
}

.UIRadioList[data-halign="start"] {
  .UIRadioList-Item,
  &[data-readonly="true"] .UIRadioList-Content {
    @apply justify-start;
  }
}

.UIRadioList[data-halign="center"] {
  .UIRadioList-Item,
  &[data-readonly="true"] .UIRadioList-Content {
    @apply justify-center;
  }
}

.UIRadioList[data-halign="end"] {
  .UIRadioList-Item,
  &[data-readonly="true"] .UIRadioList-Content {
    @apply justify-end;
  }
}

.UIRadioList[data-columns="2"] {
  .UIRadioList-Content {
    @apply grid grid-cols-2;
  }
}

.UIRadioList[data-columns="3"] {
  .UIRadioList-Content {
    @apply grid grid-cols-3;
  }
}

.UIRadioList[data-columns="4"] {
  .UIRadioList-Content {
    @apply grid grid-cols-4;
  }
}

.UIRadioList[data-columns="5"] {
  .UIRadioList-Content {
    @apply grid grid-cols-5;
  }
}

.UIRadioList[data-columns="6"] {
  .UIRadioList-Content {
    @apply grid grid-cols-6;
  }
}

.UIRadioList[data-columns="7"] {
  .UIRadioList-Content {
    @apply grid grid-cols-7;
  }
}

.UIRadioList[data-columns="8"] {
  .UIRadioList-Content {
    @apply grid grid-cols-8;
  }
}

.UIRadioList[data-columns="9"] {
  .UIRadioList-Content {
    @apply grid grid-cols-9;
  }
}

.UIRadioList[data-columns="10"] {
  .UIRadioList-Content {
    @apply grid grid-cols-10;
  }
}

.UIRadioList[data-columns="11"] {
  .UIRadioList-Content {
    @apply grid grid-cols-11;
  }
}

.UIRadioList[data-columns="12"] {
  .UIRadioList-Content {
    @apply grid grid-cols-12;
  }
}
</style>
