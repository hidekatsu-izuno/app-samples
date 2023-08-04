<script setup lang="ts">
import { uuid } from "~/utils/functions"
const { data: id } = await useAsyncData("compId", () => Promise.resolve(uuid()))

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
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
}>(), {
  placeholder: "未選択",
  items: () => [],
  columns: 1,
  required: false,
  modelValue: "",
})

const data = reactive({
  value: "",
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
  (event: "update:modelValue", value: string): void,
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
  data.error = ""

  if (value) {
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
  <div class="UIRadioList">
    <label
      v-if="props.label"
      class="block"
    >{{ props.label }} <span v-if="props.required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="flex flex-row items-center justify-start gap-2 px-2 py-1 text-gray-900 border border-gray-200"
    >
      <template v-if="data.value">
        <div v-if="props.prefix">{{ props.prefix }}</div>
        <div class=" whitespace-pre-wrap">{{ props.items.find(item => item.value === data.value)?.text || '&#8203;' }}</div>
        <div v-if="props.suffix">{{ props.suffix }}</div>
      </template>
      <template v-else>&#8203;</template>
    </div>
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
        '',
      ]"
      @change="onChange"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <div v-for="(item, index) in (props.required ? props.items : [{ value: '', text: props.placeholder }, ...props.items])" :key="index"
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
                type="radio"
                class="peer appearance-none w-full h-full rounded-full bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
                style="grid-area: 1/1;"
                :name="id || undefined"
                :value="item.value"
                :checked="item.value === data.value"
                :disabled="props.disabled"
                :tabindex="props.tabindex"
              />
              <UIIcon name="circle-medium" class=" w-full h-full text-white pointer-events-none hidden peer-checked:block" style="grid-area: 1/1;" />
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
