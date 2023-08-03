<script setup lang="ts">
import { uuid } from "~/utils/functions"
const { data: id } = await useAsyncData("compId", () => Promise.resolve(uuid()))

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
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
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: string[]): void
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
</script>

<template>
  <div class="UICheckList">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <ul
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200"
    >
      <li v-for="(item, index) in items.filter(item => data.value.includes(item.value))" :key="index">{{ item.text }}</li>
      <li v-if="!data.value || data.value.length === 0">&#8203;</li>
    </ul>
    <div
      v-else
      class="grid"
      :class="[
        `grid-columns-${columns}`
      ]"
      @change="onChange"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <div v-for="(item, index) in items" :key="index">
        <label
          class="inline-flex items-center gap-0.5 py-1"
          :class="[
            disabled ? 'text-gray-400' : '',
            ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
          ]"
          :style="props.inputStyle"
        ><input
          type="checkbox"
          class="appearance-none w-4 h-4 mr-1 rounded bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
          :name="id || undefined"
          :value="item.value"
          :checked="data.value.includes(item.value)"
          :disabled="disabled"
          :tabindex="tabindex"
        ><div>{{ item.text }}</div></label>
      </div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.UICheckList > div > div > label > input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
