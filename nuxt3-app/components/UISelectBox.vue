<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  name?: string,
  placeholder?: string,
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

const data = reactive({
  value: "",
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
  <div class="UISelectBox">
    <label
      v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200"
    >{{ items.find(item => item.value === data.value)?.text || '&#8203;' }}</div>
    <select
      v-else
      class="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md outline-none disabled:text-gray-400 disabled:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
      :value="data.value"
      :disabled="disabled"
      :tabindex="tabindex"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
    >
      <option :disabled="required" value="">{{ placeholder }}</option>
      <option v-for="(item, index) in items" :key="index" :value="item.value">{{ item.text }}</option>
    </select>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
