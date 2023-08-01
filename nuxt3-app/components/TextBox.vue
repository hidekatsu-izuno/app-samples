<script setup lang="ts">
import { ValidatorKey } from "~/utils/validator"
import { JapaneseErrorMap } from "~/utils/zod/JapaneseErrorMap"
import { z, ZodString } from "zod"

const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end"
  type?: "text" | "password" | "email" | "tel" | "url"
  label?: string
  name?: string
  placeholder?: string
  tabindex?: number
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[]
  required?: boolean
  schema?: ZodString
  modelValue?: string
}>(), {
  type: "text",
  required: false,
  modelValue: "",
})

const data = reactive({
  maxLength: props.schema?.maxLength ?? undefined,
  value: props.modelValue || "",
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
})

watch(() => props.schema, () => {
  data.maxLength = props.schema?.maxLength ?? undefined
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
  (event: "update:modelValue", value: string): void
  (event: "blur", value: Event): void
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  data.value = target.value
  if (data.error) {
    data.error = ""
  }
  emits("update:modelValue", target.value)
}

function onBlur(event: Event) {
  const target = event.target as HTMLInputElement
  const validated = validate(target.value)
  if (validated) {
    data.value = validated
    emits("update:modelValue", data.value)
  }

  emits("blur", event)
}

function validate(value: string) {
  data.error = ""

  if (value) {
    let schema = props.schema
    if (props.type === "email") {
      if (!schema) {
        schema = z.string()
      }
      schema = schema.email()
    } else if (props.type === "tel") {
      if (!schema) {
        schema = z.string()
      }
      schema = schema.regex(/^0[0-9-]{8,9}[0-9]$/, "電話番号の書式に誤りがあります。")
    } else if (props.type === "url") {
      if (!schema) {
        schema = z.string()
      }
      schema = schema.url("URLの書式に誤りがあります。")
    }

    if (schema) {
      const result = schema.safeParse(value, {
        errorMap: JapaneseErrorMap
      })
      if (result.success) {
        value = result.data
      } else {
        data.error = result.error.issues[0].message
      }
    }
  } else if (props.required) {
    data.error = "必須入力です。"
  }

  if (!data.error) {
    return value
  }
}
</script>

<template>
  <div class="TextBox">
    <label v-if="label"
      class="block"
    >{{ label }} <span v-if="required" class="text-red-500">※</span></label>
    <input :type="type" :placeholder="placeholder" :tabindex="tabindex" :maxlength="data.maxLength"
      :value="data.value"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
      class="block px-2 py-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      :class="[
        halign ? `self-${halign}` : 'block w-full',
        ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
      ]"
      :style="props.inputStyle"
    />
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
