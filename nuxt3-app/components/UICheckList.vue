<script setup lang="ts">
import { uuid } from "~/utils/functions"
const { data: id } = await useAsyncData("compId", () => Promise.resolve(uuid()))

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
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
}>(), {
  items: () => [],
  columns: 1,
  required: false,
  modelValue: () => [],
})

const data = reactive({
  value: new Array<string>(),
  focused: false,
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
}, { immediate: true })

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

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string[]): void,
  (event: "blur", value: Event): void,
}>()

function onFocusin(event: Event) {
  if (!data.focused) {
    data.focused = true
    emits("focus", event)
  }
}

function onChange(event: Event) {
  const currentTarget = event.currentTarget as HTMLElement
  const targets = currentTarget.querySelectorAll(`[name="${id.value}"]:checked`) as NodeListOf<HTMLInputElement>
  const values = new Set<string>()
  for (let i = 0; i < targets.length; i++) {
    values.add(targets[i].value)
  }

  if (data.value.length !== values.size || !data.value.every(item => values.has(item))) {
    data.value = [...values].sort()
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

function validate(value: string[]) {
  data.error = ""

  if (value.length > 0) {
    // no handle
  } else if (props.required) {
    data.error = "必ず選択してください。"
  }

  if (!data.error) {
    return value
  }
}

defineExpose({
  validate() {
    return validate(data.value)
  }
})
</script>

<template>
  <div class="UICheckList">
    <label
      v-if="props.label"
      class="block"
    >{{ props.label }} <span v-if="props.required" class="text-red-500">※</span></label>
    <ul
      v-if="props.readonly"
      class="px-2 py-1 text-gray-900 border border-gray-200"
    >
      <template v-if="data.value.length > 0">
        <li v-for="(item, index) in props.items.filter(item => data.value.includes(item.value))" :key="index"
          class="flex flex-row items-center justify-start gap-2">
          <div v-if="props.prefix">{{ props.prefix }}</div>
          <div class=" whitespace-pre-wrap">{{ item.text || "&#8203;" }}</div>
          <div v-if="props.suffix">{{ props.suffix }}</div>
        </li>
      </template>
      <li v-else>&#8203;</li>
    </ul>
    <div
      v-else
      :class="[
        props.columns === 2 ? 'grid grid-columns-2' :
        props.columns === 3 ? 'grid grid-columns-3' :
        props.columns === 4 ? 'grid grid-columns-4' :
        props.columns === 5 ? 'grid grid-columns-5' :
        props.columns === 6 ? 'grid grid-columns-6' :
        props.columns === 7 ? 'grid grid-columns-7' :
        props.columns === 8 ? 'grid grid-columns-8' :
        props.columns === 9 ? 'grid grid-columns-9' :
        props.columns === 10 ? 'grid grid-columns-10' :
        props.columns === 11 ? 'grid grid-columns-11' :
        props.columns === 12 ? 'grid grid-columns-12' :
        ''
      ]"
      @change="onChange"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <div v-for="(item, index) in props.items" :key="index"
        class="flex flex-row items-center gap-2"
        :class="[
          props.halign === 'start' ? 'justify-start' :
          props.halign === 'center' ? 'justify-center' :
          props.halign === 'end' ? 'justify-start' :
          '',
        ]"
      >
        <div v-if="props.prefix">{{ props.prefix }}</div>
        <div :class="props.halign ? 'flex-none' : 'grow'">
          <label
            class="inline-flex items-center gap-1 py-1"
            :class="[
              props.disabled ? 'text-gray-400' : '',
              ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
            ]"
            :style="props.inputStyle"
          >
            <div class="grid w-4 h-4">
              <input
                type="checkbox"
                class="peer appearance-none w-full h-full rounded bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
                style="grid-area: 1/1;"
                :name="id || undefined"
                :disabled="props.disabled"
                :tabindex="props.tabindex"
                :value="item.value"
                :checked="data.value.includes(item.value)"
              />
              <UIIcon name="check-bold" class="w-full h-full text-white pointer-events-none hidden peer-checked:block" style="grid-area: 1/1;" />
            </div>
            {{ item.text }}
          </label>
        </div>
        <div v-if="props.suffix">{{ props.suffix }}</div>
      </div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
