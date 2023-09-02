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
    class="UISwitch"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <div v-if="props.readonly" class="UISwitch-Content">
      <div v-if="props.prefix && $slots.default" class="UISwitch-Prefix">{{ props.prefix }}</div>
      <div class="UISwitch-Text"><slot /></div>
      <div v-if="props.suffix && $slots.default" class="UISwitch-Suffix">{{ props.suffix }}</div>
    </div>
    <div v-else class="UISwitch-Content">
      <div v-if="props.prefix" class="UISwitch-Prefix">{{ props.prefix }}</div>
      <label class="UISwitch-InputLabel">
        <div v-if="$slots.default" class="UISwitch-InputText"><slot /></div>
        <div class="UISwitch-InputArea">
          <input
            type="checkbox"
            class="UISwitch-Input"
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
          <UIIcon name="circle" class="UISwitch-InputCheck" />
        </div>
      </label>
      <div v-if="props.suffix" class="UISwitch-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UISwitch-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UISwitch-Content {
  @apply flex flex-row items-center gap-2
    text-base;
}

.UISwitch-InputLabel {
  @apply grow
    flex items-center gap-1
    py-[0.125em];
}

.UISwitch-InputText {
  @apply grow;
}

.UISwitch-InputArea {
  @apply grid items-center;
}

.UISwitch-Input {
  @apply appearance-none
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 focus:border-blue-500 rounded-full
    w-[calc((1.5em+(0.125em+1px)*2)*2)] h-[calc(1.5em+(0.125em+1px)*2)]
    bg-gray-50 disabled:bg-gray-200;
  grid-area: 1/1;
}

.UISwitch-InputCheck {
  @apply mx-1
    text-2xl text-gray-300
    pointer-events-none;
  grid-area: 1/1;
}

.UISwitch-Input:checked + .UISwitch-InputCheck {
  @apply justify-self-end
    text-blue-500;
}

.UISwitch-Error {
  @apply text-sm text-red-500;
}

.UISwitch[data-disabled="true"] {
  .UISwitch-InputLabel {
    @apply text-gray-400;
  }
}

.UISwitch[data-readonly="true"] {
  .UISwitch-Content {
    @apply min-h-[calc(1.5em+(0.125em+1px)*2)]
      border border-gray-200
      px-[0.25em] py-[0.125em]
      text-gray-900;
  }

  .UISwitch-Text {
    @apply whitespace-pre-wrap;
  }
}

.UISwitch[data-size="lg"] {
  .UISwitch-Content {
    @apply text-lg;
  }
}

.UISwitch[data-size="sm"] {
  .UISwitch-Content {
    @apply text-sm;
  }
}

.UISwitch[data-halign="start"] {
  .UISwitch-Content {
    @apply justify-start;
  }

  .UISwitch-InputLabel,
  .UISwitch-InputText {
    @apply grow-0;
  }
}

.UISwitch[data-halign="center"] {
  .UISwitch-Content {
    @apply justify-center;
  }

  .UISwitch-InputLabel,
  .UISwitch-InputText {
    @apply grow-0;
  }
}

.UISwitch[data-halign="end"] {
  .UISwitch-Content {
    @apply justify-end;
  }

  .UISwitch-InputLabel,
  .UISwitch-InputText {
    @apply grow-0;
  }
}
</style>
