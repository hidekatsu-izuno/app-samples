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
  <div
    class="UILink"
    :data-disabled="props.disabled || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UILink-Label"
    >{{ props.label }}</label>
    <div class="UILink-Content">
      <div v-if="props.prefix" class="UILink-Prefix">{{ props.prefix }}</div>
      <div class="UILink-InputArea">
        <NuxtLink
          class="UILink-Input"
          :class="props.inputClass"
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
      <div v-if="props.suffix" class="UILink-Suffix">{{ props.suffix }}</div>
    </div>
  </div>
</template>

<style>
.UILink-Label {
  @apply block;
}

.UILink-Content {
  @apply flex flex-row items-center gap-2;
}

.UILink-InputArea {
  @apply w-full;
}

.UILink-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    rounded-md
    text-blue-600
    hover:underline
    cursor-pointer;
}

.UILink-Error {
  @apply text-sm text-red-500;
}

.UILink[data-disabled="true"] {
  .UILink-Input {
    @apply text-gray-400 hover:no-underline
      cursor-default;
  }
}

.UILink[data-halign="start"] {
  .UILink-Content {
    @apply justify-start;
  }

  .UILink-InputArea {
    @apply w-auto;
  }
}

.UILink[data-halign="center"] {
  .UILink-Content {
    @apply justify-center;
  }

  .UILink-InputArea {
    @apply w-auto;
  }
}

.UILink[data-halign="end"] {
  .UILink-Content {
    @apply justify-end;
  }

  .UILink-InputArea {
    @apply w-auto;
  }
}
</style>
