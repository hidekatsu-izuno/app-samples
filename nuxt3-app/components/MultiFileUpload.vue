<script setup lang="ts">
import { ValidatorKey } from "~/utils/validator"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  label?: string
  name?: string
  placeholder?: string
  tabindex?: number
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  required?: boolean
  modelValue?: File[]
}>(), {
  required: false,
  modelValue: undefined,
})

const data = reactive({
  value: props.modelValue,
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
  (event: "update:modelValue", value?: File[]): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  data.value = target.files ? Array.from(target.files) : undefined
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", data.value)
}

function onBlur(event: Event) {
  const target = event.target as HTMLInputElement
  const validated = validate(target.files ? Array.from(target.files) : undefined)
  if (validated) {
    data.value = validated
    emits("update:modelValue", data.value)
  }
}

function validate(value?: File[]) {
  data.error = ""

  if (value && value.length > 0) {
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
  <div class="MultiFileUpload">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <input type="file" multiple="true" :placeholder="placeholder" :tabindex="tabindex"
      :value="data.value"
      @change="onChange"
      @blur="onBlur"
      class="px-2 py-1 text-gray-900 bg-gray-50 resize-none border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        {
          'block': !halign,
          'w-full': !halign,
          'self-start': halign === 'start',
          'self-center': halign === 'center',
          'self-end': halign === 'end',
        },
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
    />
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
