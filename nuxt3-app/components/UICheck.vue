<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  value?: string,
  prefix?: string,
  suffix?: string,
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
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: boolean): void,
  (event: "blur", value: Event): void,
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

defineExpose({
  validate() {
    return validate(data.value)
  }
})
</script>

<template>
  <div class="UICheck">
    <label
      v-if="props.label"
      class="block"
    >{{ props.label }}</label>
    <div
      v-if="props.readonly"
      class="flex flex-row items-center justify-start gap-2 px-2 py-1 text-gray-900 border border-gray-200"
    >
      <template v-if="data.value">
        <div v-if="props.prefix">{{ props.prefix }}</div>
        <div class="whitespace-pre-wrap"><slot />&#8203;</div>
        <div v-if="props.suffix">{{ props.suffix }}</div>
      </template>
      <template v-else>&#8203;</template>
    </div>
    <div
      v-else
      class="flex flex-row items-center gap-2"
      :class="[
        props.halign === 'start' ? 'justify-start' :
        props.halign === 'center' ? 'justify-center' :
        props.halign === 'end' ? 'justify-start' :
        '',
      ]"
    >
      <div v-if="props.prefix">{{ props.prefix }}</div>
      <label
        class="flex items-center gap-1 py-1"
        :class="[
          props.disabled ? 'text-gray-400' : '',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
      >
        <div class="grid w-4 h-4">
          <input
            type="checkbox"
            class="peer appearance-none w-full h-full rounded bg-gray-50 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 checked:bg-blue-500 disabled:bg-gray-200 checked:disabled:bg-gray-400"
            style="grid-area: 1/1;"
            :class="props.inputClass"
            :style="props.inputStyle"
            :value="props.value"
            :disabled="props.disabled"
            :tabindex="props.tabindex"
            :checked="data.value"
            @focus="onFocus"
            @change="onChange"
            @blur="onBlur"
          />
          <UIIcon name="check-bold" class="w-full h-full text-white pointer-events-none hidden peer-checked:block" style="grid-area: 1/1;" />
        </div>
        <slot />
      </label>
      <div v-if="props.suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
