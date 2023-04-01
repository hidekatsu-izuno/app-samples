<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  value?: string
  text?: string
  required?: boolean
  modelValue?: boolean
}>(), {
  required: false,
  modelValue: false
})

const data = reactive({
  value: !!props.modelValue,
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
  (event: "update:modelValue", value: boolean): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  let changed = false
  if (target.checked) {
    if (!data.value) {
      data.value = true
      changed = true
    }
  } else {
    if (data.value) {
      data.value = false
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

const validate = (value: boolean) => {
  data.error = ""

  if (value) {
    // no handle
  } else if (props.required) {
    data.error = "必ず選択してください。"
  }

  if (!data.error) {
    if (props.value) {
      return value ? props.value : null
    }
    return value
  }
}
</script>

<template>
  <div class="CheckBox">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <div>
      <label class="flex items-center gap-0.5 py-1"
        :class="props.inputClass"
        :style="props.inputStyle"
      ><input type="checkbox"
          :value="value"
          :checked="data.value"
          @change="onChange"
          @blur="onBlur"
          class="appearance-none w-4 h-4 mr-1 rounded bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500"
        ><span v-if="text">{{ text }}</span></label>
    </div>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>

<style>
.CheckBox > div > label > input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
