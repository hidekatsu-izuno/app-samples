<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  tabindex?: number
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  items?: Array<{ value: string, text: string }>
  required?: boolean
  modelValue?: string
}>(), {
  items: () => [],
  required: false,
  modelValue: "",
})

const data = reactive({
  value: props.modelValue || "",
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})

const name = props.name
if (name) {
  const validator = inject(ValidatorKey, null)
  if (validator) {
    validator.on("validate", name, () => {
      return validate(data.value)
    })

    validator.on("clear", name, () => {
      data.error = ""
    })
  }
}

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "blur", value: Event): void
  (event: "update:modelValue", value: string): void
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onBlur(event: Event) {
  emits("blur", event)
}

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  validate(target.value)
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", target.value)
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
  <div class="SelectBox">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <select :tabindex="tabindex"
      :value="data.value"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
      class="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
    >
      <option :disabled="required" value="">{{ placeholder }}</option>
      <option v-for="item in items" :value="item.value">{{ item.text }}</option>
    </select>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
