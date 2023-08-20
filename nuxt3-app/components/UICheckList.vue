<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
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
  id: crypto.randomUUID(),
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
  const targets = currentTarget.querySelectorAll(`[name="${name}"]:checked`) as NodeListOf<HTMLInputElement>
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
    return value.length > 0 ? value : undefined
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
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-columns="props.columns"
    :data-required="props.required || undefined"
    :data-disabled="props.disabled || undefined"
    :data-readonly="props.readonly || undefined"
  >
    <ul v-if="props.readonly" class="UICheckList-Content">
      <li
        v-for="(item, index) in props.items.filter(item => data.value.includes(item.value))"
        :key="index"
        class="UICheckList-Item"
      >
        <div v-if="props.prefix" class="UICheckList-Prefix">{{ props.prefix }}</div>
        <div class="UICheckList-Text">{{ item.text }}</div>
        <div v-if="props.suffix" class="UICheckList-Suffix">{{ props.suffix }}</div>
      </li>
    </ul>
    <div
      v-else
      class="UICheckList-Content"
      @focusin="onFocusin"
      @focusout="onFocusout"
      @change="onChange"
    >
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="UICheckList-Item"
      >
        <div v-if="props.prefix" class="UICheckList-Prefix">{{ props.prefix }}</div>
        <label
          class="UICheckList-InputLabel"
          :class="props.inputClass"
          :style="props.inputStyle"
        >
          <div class="UICheckList-InputArea">
            <input
              class="UICheckList-Input peer"
              type="checkbox"
              :name="data.id"
              :disabled="props.disabled"
              :tabindex="props.tabindex"
              :value="item.value"
              :checked="data.value.includes(item.value)"
            />
            <UIIcon name="check-bold" class="UICheckList-InputCheck hidden peer-checked:block" />
          </div>
          {{ item.text }}
        </label>
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
.UICheckList-Content {
  @apply flex flex-col;
}

.UICheckList-Item {
  @apply flex flex-row items-center gap-2;
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
    text-white text-base
    pointer-events-none;
  grid-area: 1/1;
}

.UICheckList-Error {
  @apply text-sm text-red-500;
}

.UICheckList[data-readonly="true"] {
  .UICheckList-Content {
    @apply min-h-[calc(1em+0.5em*2)]
      border border-gray-200
      px-[0.5em] py-[0.25em]
      text-gray-900;
  }

  .UICheckList-Text {
    @apply whitespace-pre-wrap;
  }
}

.UICheckList[data-size="lg"] {
  .UICheckList-Content {
    @apply text-lg;
  }
}

.UICheckList[data-size="sm"] {
  .UICheckList-Content {
    @apply text-sm;
  }
}

.UICheckList[data-halign="start"] {
  .UICheckList-Item,
  &[data-readonly="true"] .UICheckList-Content {
    @apply justify-start;
  }
}

.UICheckList[data-halign="center"] {
  .UICheckList-Item,
  &[data-readonly="true"] .UICheckList-Content {
    @apply justify-center;
  }
}

.UICheckList[data-halign="end"] {
  .UICheckList-Item,
  &[data-readonly="true"] .UICheckList-Content {
    @apply justify-end;
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
</style>
