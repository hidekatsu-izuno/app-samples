<script setup lang="ts">
import { uuid } from "~/utils/functions"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  tabindex?: number
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  items?: Array<{ value: string, text: string }>
  columns?: number
  required?: boolean
  modelValue?: string[]
}>(), {
  items: () => [],
  columns: 1,
  required: false,
  modelValue: () => [],
})

const id = uuid()

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
  (event: "update:modelValue", value: string[]): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  let changed = false
  if (target.checked) {
    if (!data.value.includes(target.value)) {
      data.value = [...data.value, target.value]
      changed = true
    }
  }
  validate(data.value)
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
  <div class="CheckList">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div class="grid" :class="[
      `grid-columns-${columns}`
    ]">
      <div v-for="item in items">
        <label
          class="inline-flex items-center gap-0.5 py-1"
          :class="props.inputClass"
          :style="props.inputStyle"
        ><input type="checkbox" :name="id" :tabindex="tabindex"
            :value="item.value"
            :checked="data.value.includes(item.value)"
            @change="onChange"
            @blur="onBlur"
            class="appearance-none w-4 h-4 mr-1 rounded bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500"
          ><span>{{ item.text }}</span></label>
      </div>
    </div>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.CheckList > div > div > label > input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
