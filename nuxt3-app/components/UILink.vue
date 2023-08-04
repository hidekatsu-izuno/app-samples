<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  href?: string,
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  disabled?: boolean,
}>(), {
})

const data = reactive({
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "click", value: MouseEvent): void,
  (event: "blur", value: Event): void,
}>()

function onFocus(event: MouseEvent) {
  emits("focus", event)
}

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emits("click", event)
}

function onBlur(event: MouseEvent) {
  emits("blur", event)
}
</script>

<template>
  <div class="UILink">
    <label
      v-if="props.label"
      class="block"
    >{{ props.label }}</label>
    <div
      class="flex flex-row items-center gap-2"
      :class="[
        props.halign === 'start' ? 'justify-start' :
        props.halign === 'center' ? 'justify-center' :
        props.halign === 'end' ? 'justify-start' :
        '',
      ]"
    >
      <div v-if="props.prefix">{{ props.prefix }}</div>
      <div :class="props.halign ? 'flex-none' : 'grow'">
        <NuxtLink
          class="rounded-md outline-none focus:ring-2 focus:ring-blue-200"
          :class="[
            props.disabled ? 'text-gray-400 cursor-default' : 'text-blue-600 hover:underline cursor-pointer',
            ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
          ]"
          :style="props.inputStyle"
          :href="!props.disabled && props.href"
          :tabindex="props.tabindex"
          @focus="onFocus"
          @click="onClick"
          @blur="onBlur"
        >
          <slot />
        </NuxtLink>
      </div>
      <div v-if="props.suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
