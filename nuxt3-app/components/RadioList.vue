<script setup lang="ts">
import { uuidv4 } from "@/utils/functions"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  items?: Array<{ value: string, text: string }>
  required?: boolean
  modelValue?: string
}>(), {
  placeholder: "未選択",
  items: () => [],
  required: false,
  modelValue: "",
})

const id = uuidv4()

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
  (event: "update:modelValue", value: string): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  let changed = false
  if (target.checked) {
    validate(target.value)
    data.value = target.value
    changed = true
  }
  if (data.error) {
    data.error = ""
  }
  if (changed) {
    emits("update:modelValue", data.value)
  }
}

function onBlur() {
  validate(data.value)
}

const validate = (value: string) => {
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
  <div class="RadioList">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))">
      <label v-if="!required" class="flex items-center gap-0.5 py-1"
        :class="props.inputClass"
        :style="props.inputStyle"
      ><input type="radio"
        :name="id" value=""
        :checked="!data.value"
        @change="onChange"
        @blur="onBlur"
        class="appearance-none w-4 h-4 rounded-full bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500"
      >{{ placeholder }}</label>
      <label v-for="item in items" class="flex items-center py-1"
        :class="props.inputClass"
        :style="props.inputStyle"
      ><input type="radio" :name="id"
          :value="item.value"
          :checked="item.value === data.value"
          @change="onChange"
          @blur="onBlur"
          class="appearance-none w-4 h-4 rounded-full bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500"
        >{{ item.text }}</label>
    </div>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.RadioList > div > label > input[type="radio"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}
</style>
