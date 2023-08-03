<script setup lang="ts">
import { uuid } from "~/utils/functions"
const { data: id } = await useAsyncData("compId", () => Promise.resolve(uuid()))

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
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
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: string): void
  (event: "blur", value: Event): void
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
</script>

<template>
  <div class="UIRadioList">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200"
    >{{ items.find(item => item.value === data.value)?.text || '&#8203;' }}</div>
    <div
      v-else
      class="grid"
      :class="[
        `grid-columns-${columns}`,
        disabled ? 'text-gray-400' : '',
      ]"
      @change="onChange"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <div v-if="!required">
        <label
          class="flex items-center gap-1 py-1"
          :class="props.inputClass"
          :style="props.inputStyle"
        ><input
          type="radio"
          class="appearance-none w-4 h-4 rounded-full bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
          value=""
          :name="id || undefined"
          :checked="!data.value"
          :disabled="disabled"
          :tabindex="tabindex"
        ><div>{{ placeholder }}</div></label>
      </div>
      <div v-for="(item, index) in items" :key="index">
        <label
          class="inline-flex items-center gap-1 py-1"
          :class="props.inputClass"
          :style="props.inputStyle"
        ><input
          type="radio"
          class="appearance-none w-4 h-4 rounded-full bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
          :name="id || undefined"
          :value="item.value"
          :checked="item.value === data.value"
          :disabled="disabled"
          :tabindex="tabindex"
        ><div>{{ item.text }}</div></label>
      </div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >
      {{ data.error }}
    </div>
  </div>
</template>

<style>
.UIRadioList > div > div > label > input[type="radio"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}
</style>
