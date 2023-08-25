<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
  name?: string,
  value?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  modelValue?: string,
  error?: string,
}>(), {
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

  const target = event.target as HTMLInputElement
  const name = target.getAttribute("name")
  let value = ""
  if (name) {
    const checked = document.querySelector(`[name="${name}"]:checked`)
    value = (checked && checked.getAttribute("value")) || ""
  } else if (target.checked) {
    value = target.getAttribute("value") || ""
  }
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
    error = "必ず選択してください。"
  }

  if (!error) {
    if (value) {
      return value ? props.value : undefined
    }
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
    class="UIRadio"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UIRadio-Content">
      <div v-if="props.prefix && $slots.default" class="UIRadio-Prefix">{{ props.prefix }}</div>
      <div class="UIRadio-Text"><slot /></div>
      <div v-if="props.suffix && $slots.default" class="UIRadio-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UIRadio-Content">
      <div v-if="props.prefix" class="UIRadio-Prefix">{{ props.prefix }}</div>
      <label class="UIRadio-InputLabel">
        <div class="UIRadio-InputArea">
          <input
            type="radio"
            class="UIRadio-Input peer"
            :class="props.inputClass"
            :style="props.inputStyle"
            :name="props.name"
            :value="props.value"
            :disabled="props.disabled"
            :tabindex="props.tabindex"
            :checked="props.value === data.value"
            @focus="onFocus"
            @change="onChange"
            @blur="onBlur"
          />
          <UIIcon name="circle-medium" class="UIRadio-InputCheck hidden peer-checked:block" />
        </div>
        <slot />
      </label>
      <div v-if="props.suffix" class="UIRadio-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UIRadio-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UIRadio-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UIRadio-InputLabel {
  @apply flex items-center gap-1
    py-[0.125em];
}

.UIRadio-InputArea {
  @apply grid
    w-4 h-4;
}

.UIRadio-Input {
  @apply appearance-none
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-full
    w-full h-full
    bg-gray-50 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400;
  grid-area: 1/1;
}

.UIRadio-InputCheck {
  @apply w-full h-full
    text-white text-base
    pointer-events-none;
  grid-area: 1/1;
}

.UIRadio-Error {
  @apply text-sm text-red-500;
}

.UIRadio[data-disabled="true"] {
  .UIRadio-InputLabel {
    @apply text-gray-400;
  }
}

.UIRadio[data-readonly="true"] {
  .UIRadio-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UIRadio-Text {
    @apply whitespace-pre-wrap;
  }
}

.UIRadio[data-size="lg"] {
  .UIRadio-Content {
    @apply text-lg;
  }
}

.UIRadio[data-size="sm"] {
  .UIRadio-Content {
    @apply text-sm;
  }
}

.UIRadio[data-halign="start"] {
  .UIRadio-Content {
    @apply justify-start;
  }
}

.UIRadio[data-halign="center"] {
  .UIRadio-Content {
    @apply justify-center;
  }
}

.UIRadio[data-halign="end"] {
  .UIRadio-Content {
    @apply justify-end;
  }
}
</style>
