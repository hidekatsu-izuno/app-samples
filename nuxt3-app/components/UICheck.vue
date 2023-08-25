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
  modelValue?: boolean,
  error?: string,
}>(), {
  required: false,
  disabled: false,
  readonly: false,
  modelValue: false,
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: boolean): void,
  (event: "update:error", value: string): void,
  (event: "change", value: Event): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  value: false,
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = !!props.modelValue
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
  data.value = target.checked
  emits("update:modelValue", data.value)

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

function validate(value: boolean) {
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
    class="UICheck"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UICheck-Content">
      <div v-if="props.prefix && $slots.default" class="UICheck-Prefix">{{ props.prefix }}</div>
      <div class="UICheck-Text"><slot /></div>
      <div v-if="props.suffix && $slots.default" class="UICheck-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UICheck-Content">
      <div v-if="props.prefix" class="UICheck-Prefix">{{ props.prefix }}</div>
      <label class="UICheck-InputLabel">
        <div class="UICheck-InputArea">
          <input
            type="checkbox"
            class="UICheck-Input peer"
            :class="props.inputClass"
            :style="props.inputStyle"
            :name="props.name"
            :value="props.value"
            :disabled="props.disabled"
            :tabindex="props.tabindex"
            :checked="data.value"
            @focus="onFocus"
            @change="onChange"
            @blur="onBlur"
          />
          <UIIcon name="check-bold" class="UICheck-InputCheck hidden peer-checked:block" />
        </div>
        <slot />
      </label>
      <div v-if="props.suffix" class="UICheck-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UICheck-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UICheck-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UICheck-InputLabel {
  @apply flex items-center gap-1
    py-[0.125em];
}

.UICheck-InputArea {
  @apply grid
    w-4 h-4;
}

.UICheck-Input {
  @apply appearance-none
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded
    w-full h-full
    bg-gray-50 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400;
  grid-area: 1/1;
}

.UICheck-InputCheck {
  @apply w-full h-full
    text-white text-base
    pointer-events-none;
  grid-area: 1/1;
}

.UICheck-Error {
  @apply text-sm text-red-500;
}

.UICheck[data-disabled="true"] {
  .UICheck-InputLabel {
    @apply text-gray-400;
  }
}

.UICheck[data-readonly="true"] {
  .UICheck-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UICheck-Text {
    @apply whitespace-pre-wrap;
  }
}

.UICheck[data-size="lg"] {
  .UICheck-Content {
    @apply text-lg;
  }
}

.UICheck[data-size="sm"] {
  .UICheck-Content {
    @apply text-sm;
  }
}

.UICheck[data-halign="start"] {
  .UICheck-Content {
    @apply justify-start;
  }
}

.UICheck[data-halign="center"] {
  .UICheck-Content {
    @apply justify-center;
  }
}

.UICheck[data-halign="end"] {
  .UICheck-Content {
    @apply justify-end;
  }
}
</style>
