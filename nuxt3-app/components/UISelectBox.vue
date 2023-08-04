<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
  placeholder?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  items?: Array<{ value: string, text: string }>,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  modelValue?: string,
}>(), {
  items: () => [],
  required: false,
  modelValue: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  value: "",
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
}, { immediate: true })

defineExpose({
  validate() {
    return validate(data.value)
  },
})

if (props.name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", props.name, () => {
      return validate(data.value)
    })

    validator.on("clear", props.name, () => {
      data.error = ""
    })
  }
}

function onFocus(event: Event) {
  emits("focus", event)
}

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  validate(target.value)
  data.value = target.value
  emits("update:modelValue", target.value)
}

function onBlur(event: Event) {
  const target = event.target as HTMLSelectElement
  validate(target.value)
  emits("blur", event)
}

function validate(value: string) {
  data.error = ""

  if (value) {
    // no handle
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return value
  }
}
</script>

<template>
  <div
    class="UISelectBox"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UISelectBox-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UISelectBox-Content"
    >
      <div v-if="props.prefix && data.value" class="UISelectBox-Prefix">{{ props.prefix }}</div>
      <div class="UISelectBox-Text">{{ props.items.find(item => item.value === data.value)?.text }}</div>
      <div v-if="props.suffix && data.value" class="UISelectBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UISelectBox-Content"
    >
      <div v-if="props.prefix" class="UISelectBox-Prefix">{{ props.prefix }}</div>
      <select
        class="UISelectBox-Input"
        :class="props.inputClass"
        :style="props.inputStyle"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        :value="data.value"
        @focus="onFocus"
        @change="onChange"
        @blur="onBlur"
      >
        <option :disabled="required" value="">{{ placeholder }}</option>
        <option v-for="(item, index) in items" :key="index" :value="item.value">{{ item.text }}</option>
      </select>
      <div v-if="props.suffix" class="UISelectBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="UISelectBox-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UISelectBox-Label {
  @apply block;
}

.UISelectBox-Content {
  @apply flex flex-row items-center gap-2;
}

.UISelectBox-Input {
  @apply
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded-md focus:border-blue-500
    px-2 py-1
    w-full
    bg-gray-50 disabled:bg-gray-100
    text-gray-900 disabled:text-gray-400;
}

.UISelectBox-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UISelectBox-Error {
  @apply text-sm text-red-500;
}

.UISelectBox[data-required="true"] {
  .UISelectBox-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UISelectBox[data-readonly="true"] {
  .UISelectBox-Content {
    @apply justify-start
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UISelectBox[data-readonly="true"]) {
  .UISelectBox[data-halign="start"] {
    .UISelectBox-Content {
      @apply justify-start;
    }

    .UISelectBox-Input {
      @apply w-auto;
    }
  }
  .UISelectBox[data-halign="center"] {
    .UISelectBox-Content {
      @apply justify-center;
    }

    .UISelectBox-Input {
      @apply w-auto;
    }
  }
  .UISelectBox[data-halign="end"] {
    .UISelectBox-Content {
      @apply justify-end;
    }

    .UISelectBox-Input {
      @apply w-auto;
    }
  }
}
</style>
