<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  items?: Array<{ value: string, text: string }>,
  columns?: number,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  modelValue?: string[],
  error?: string,
}>(), {
  items: () => [],
  columns: 1,
  required: false,
  modelValue: () => [],
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string[]): void,
  (event: "update:error", value: string): void,
  (event: "change", value: Event): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  value: new Array<string>(),
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
  const targets = currentTarget.querySelectorAll(`[name="${id.value}"]:checked`) as NodeListOf<HTMLInputElement>
  const values = new Set<string>()
  for (let i = 0; i < targets.length; i++) {
    values.add(targets[i].value)
  }
  data.value = [...values].sort()
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

function validate(value: string[]) {
  let error = ""

  if (value.length > 0) {
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
    class="UICheckList"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UICheckList-Label"
    >{{ props.label }}</label>
    <ul
      v-if="props.readonly"
      class="UICheckList-Content"
    >
      <template v-if="data.value.length > 0">
        <li
          v-for="(item, index) in props.items.filter(item => data.value.includes(item.value))"
          :key="index"
          class="UICheckList-ContentItem"
        >
          <div v-if="props.prefix" class="UICheckList-Prefix">{{ props.prefix }}</div>
          <div class="UICheckList-Text">{{ item.text }}</div>
          <div v-if="props.suffix" class="UICheckList-Suffix">{{ props.suffix }}</div>
        </li>
      </template>
      <li v-else>&#8203;</li>
    </ul>
    <div
      v-else
      class="UICheckList-Content"
      @change="onChange"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="UICheckList-ContentItem"
      >
        <div v-if="props.prefix" class="UICheckList-Prefix">{{ props.prefix }}</div>
        <div class="UICheckList-Item">
          <label
            class="UICheckList-InputLabel"
            :class="props.inputClass"
            :style="props.inputStyle"
          >
            <div class="UICheckList-InputArea">
              <input
                class="UICheckList-Input peer"
                type="checkbox"
                :name="id || undefined"
                :disabled="props.disabled"
                :tabindex="props.tabindex"
                :value="item.value"
                :checked="data.value.includes(item.value)"
              >
              <UIIcon name="check-bold" class="UICheckList-InputCheck hidden peer-checked:block" />
            </div>
            {{ item.text }}
          </label>
        </div>
        <div v-if="props.suffix" class="UICheckList-Suffix">{{ props.suffix }}</div>
      </div>
    </div>
    <div
      v-if="data.error"
      class="UICheckList-Error"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UICheckList-Label {
  @apply block;
}

.UICheckList-ContentItem {
  @apply flex flex-row items-center gap-2;
}

.UICheckList-Item {
  @apply flex-auto;
}

.UICheckList-InputLabel {
  @apply inline-flex items-center gap-1
    py-1;
}

.UICheckList-InputArea {
  @apply grid
    w-4 h-4;
}

.UICheckList-Input {
  @apply appearance-none
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 rounded
    w-full h-full
    bg-gray-50 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400;
  grid-area: 1/1;
}

.UICheckList-InputCheck {
  @apply w-full h-full
    text-white
    pointer-events-none;
  grid-area: 1/1;
}

.UICheckList-Text {
  @apply whitespace-pre-wrap;
  min-height: 1rem;
}

.UICheckList-Error {
  @apply text-sm text-red-500;
}

.UICheckList[data-required="true"] {
  .UICheckList-Label::after {
    @apply text-red-500;
    content: ' ※';
  }
}

.UICheckList[data-disabled="true"] {
  .UICheckList-InputLabel {
    @apply text-gray-400;
  }
}

.UICheckList[data-readonly="true"] {
  .UICheckList-Content {
    @apply border border-gray-200
      px-2 py-1
      text-gray-900;
  }

  .UICheckList-ContentItem {
    @apply justify-start;
  }
}

:not(.UICheckList[data-readonly="true"]) {
  .UICheckList[data-halign="start"] {
    .UICheckList-ContentItem {
      @apply justify-start;
    }

    .UICheckList-Item {
      @apply flex-none;
    }
  }

  .UICheckList[data-halign="center"] {
    .UICheckList-ContentItem {
      @apply justify-center;
    }

    .UICheckList-Item {
      @apply flex-none;
    }
  }

  .UICheckList[data-halign="end"] {
    .UICheckList-ContentItem {
      @apply justify-end;
    }

    .UICheckList-Item {
      @apply flex-none;
    }
  }

  .UICheckList[data-columns="2"] {
    .UICheckList-Content {
      @apply grid grid-cols-2;
    }
  }

  .UICheckList[data-columns="3"] {
    .UICheckList-Content {
      @apply grid grid-cols-3;
    }
  }

  .UICheckList[data-columns="4"] {
    .UICheckList-Content {
      @apply grid grid-cols-4;
    }
  }

  .UICheckList[data-columns="5"] {
    .UICheckList-Content {
      @apply grid grid-cols-5;
    }
  }

  .UICheckList[data-columns="6"] {
    .UICheckList-Content {
      @apply grid grid-cols-6;
    }
  }

  .UICheckList[data-columns="7"] {
    .UICheckList-Content {
      @apply grid grid-cols-7;
    }
  }

  .UICheckList[data-columns="8"] {
    .UICheckList-Content {
      @apply grid grid-cols-8;
    }
  }

  .UICheckList[data-columns="9"] {
    .UICheckList-Content {
      @apply grid grid-cols-9;
    }
  }

  .UICheckList[data-columns="10"] {
    .UICheckList-Content {
      @apply grid grid-cols-10;
    }
  }

  .UICheckList[data-columns="11"] {
    .UICheckList-Content {
      @apply grid grid-cols-11;
    }
  }

  .UICheckList[data-columns="12"] {
    .UICheckList-Content {
      @apply grid grid-cols-12;
    }
  }
}
</style>
