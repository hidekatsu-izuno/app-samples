<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  value?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  modelValue?: boolean,
}>(), {
  required: false,
  modelValue: false,
})

const data = reactive({
  value: false,
  error: "",
})

watch(() => props.modelValue, () => {
  data.value = !!props.modelValue
}, { immediate: true })

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: boolean): void
  (event: "blur", value: Event): void
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (data.value !== target.checked) {
    data.value = target.checked
    validate(data.value)
    emits("update:modelValue", data.value)
  }
}

function onBlur(event: Event) {
  const target = event.target as HTMLInputElement
  validate(target.checked)
  emits("blur", event)
}

function validate(value: boolean) {
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
  <div class="UICheck flex flex-col">
    <label
      v-if="label"
      class="block"
    >{{ label }}</label>
    <div
      v-if="props.readonly"
      class="block px-2 py-1 text-gray-900 border border-gray-200"
    >
      <template v-if="data.value"><slot /></template>
      <template v-else>&#8203;</template>
    </div>
    <div
      v-else
      :class="[
        halign ? `flex self-${halign}` : 'w-full',
      ]"
    >
      <label
        class="inline-flex items-center gap-1 py-1"
        :class="[
          disabled ? 'text-gray-400' : '',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
      ><input
        type="checkbox"
        class="peer appearance-none w-4 h-4 rounded bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
        :class="props.inputClass"
        :style="props.inputStyle"
        :value="props.value"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        :checked="data.value"
        @focus="onFocus"
        @change="onChange"
        @blur="onBlur"
      ><UIIcon name="check-bold" class="w-4 h-4 overflow-hidden text-xs text-white -ml-[20px] hidden peer-checked:block" /><slot /></label>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
