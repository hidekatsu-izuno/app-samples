<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  prefix?: string,
  suffix?: string,
  placeholder?: string,
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

const { data: id } = await useAsyncData("compId", () => Promise.resolve(crypto.randomUUID()))

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
  const target = currentTarget.querySelector(`[name="${id.value}"]:checked`) as HTMLInputElement | null
  const newValue = target ? target.value : ""
  if (data.value !== newValue) {
    data.value = newValue
    validate(data.value)
    emits("update:modelValue", data.value)
  }
}

function onFocusout(event: Event) {
  const currentTarget = event.currentTarget as HTMLElement
  requestAnimationFrame(() => {
    if (!currentTarget.contains(document.activeElement)) {
      validate(data.value)
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
    class="UIRadioList"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
    :data-columns="props.columns"
  >
    <label
      v-if="props.label"
      class="UIRadioList-Label"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="UIRadioList-Content"
    >
      <div v-if="props.prefix && data.value">{{ props.prefix }}</div>
      <div class="UIRadioList-Text">{{ props.items.find(item => item.value === data.value)?.text }}</div>
      <div v-if="props.suffix && data.value">{{ props.suffix }}</div>
    </div>
    <div
      v-else
      class="UIRadioList-Content"
      @change="onChange"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <div
        v-for="(item, index) in (props.required ? props.items : [{ value: '', text: props.placeholder }, ...props.items])"
        :key="index"
        class="UIRadioList-ContentItem"
      >
        <div v-if="props.prefix">{{ props.prefix }}</div>
        <div class="UIRadioList-Item">
          <label
            class="UIRadioList-InputLabel"
            :class="props.inputClass"
            :style="props.inputStyle"
          >
            <div class="UIRadioList-InputArea">
              <input
                class="UIRadioList-Input peer"
                type="radio"
                :name="id || undefined"
                :value="item.value"
                :checked="item.value === data.value"
                :disabled="props.disabled"
                :tabindex="props.tabindex"
              >
              <UIIcon name="circle-medium" class="UIRadioList-InputCheck hidden peer-checked:block" />
            </div>
            {{ item.text }}
          </label>
        </div>
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
.UIRadioList-Label {
  @apply block;
}

.UIRadioList-ContentItem {
  @apply flex flex-row items-center gap-2;
}

.UIRadioList-Item {
  @apply w-full;
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
    text-white
    pointer-events-none;
  grid-area: 1/1;
}

.UIRadioList-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UIRadioList-Error {
  @apply text-sm text-red-500;
}

.UIRadioList[data-required="true"] {
  .UIRadioList-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UIRadioList[data-disabled="true"] {
  .UIRadioList-InputLabel {
    @apply text-gray-400;
  }
}

.UIRadioList[data-readonly="true"] {
  .UIRadioList-Content {
    @apply flex flex-row items-center justify-start gap-2
      border border-gray-200
      px-2 py-1
      text-gray-900;
  }
}

:not(.UIRadioList[data-readonly="true"]) {
  .UIRadioList[data-halign="start"] {
    .UIRadioList-ContentItem {
      @apply justify-start;
    }

    .UIRadioList-Item {
      @apply w-auto;
    }
  }

  .UIRadioList[data-halign="center"] {
    .UIRadioList-ContentItem {
      @apply justify-center;
    }

    .UIRadioList-Item {
      @apply w-auto;
    }
  }

  .UITextBox[data-halign="end"] {
    .UIRadioList-ContentItem {
      @apply justify-end;
    }

    .UIRadioList-Item {
      @apply w-auto;
    }
  }

  .UIRadioList-columns-2 {
    .UIRadioList-Content {
      @apply grid grid-cols-2;
    }
  }

  .UIRadioList-columns-3 {
    .UIRadioList-Content {
      @apply grid grid-cols-3;
    }
  }

  .UIRadioList-columns-4 {
    .UIRadioList-Content {
      @apply grid grid-cols-4;
    }
  }

  .UIRadioList-columns-5 {
    .UIRadioList-Content {
      @apply grid grid-cols-5;
    }
  }

  .UIRadioList-columns-6 {
    .UIRadioList-Content {
      @apply grid grid-cols-6;
    }
  }

  .UIRadioList-columns-7 {
    .UIRadioList-Content {
      @apply grid grid-cols-7;
    }
  }

  .UIRadioList-columns-8 {
    .UIRadioList-Content {
      @apply grid grid-cols-8;
    }
  }

  .UIRadioList-columns-9 {
    .UIRadioList-Content {
      @apply grid grid-cols-9;
    }
  }

  .UIRadioList-columns-10 {
    .UIRadioList-Content {
      @apply grid grid-cols-10;
    }
  }

  .UIRadioList-columns-11 {
    .UIRadioList-Content {
      @apply grid grid-cols-11;
    }
  }

  .UIRadioList-columns-12 {
    .UIRadioList-Content {
      @apply grid grid-cols-12;
    }
  }
}
</style>
