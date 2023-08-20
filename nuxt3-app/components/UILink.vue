<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
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

function onFocus(event: Event) {
  emits("focus", event)
}

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emits("click", event)
}

function onBlur(event: Event) {
  emits("blur", event)
}
</script>

<template>
  <div
    class="UILink"
    :data-halign="props.halign || undefined"
    :data-size="props.size || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <div class="UILink-Content">
      <div v-if="props.prefix" class="UILink-Prefix">{{ props.prefix }}</div>
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
      <div v-if="props.suffix" class="UILink-Suffix">{{ props.suffix }}</div>
    </div>
  </div>
</template>

<style>
.UILink-Content {
  @apply flex flex-row items-center gap-2
    px-[0.25em] py-[0.125em]
    text-base;
}

.UILink-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    rounded-md
    text-blue-600
    hover:underline
    cursor-pointer;
}

.UILink[data-disabled="true"] {
  .UILink-Input {
    @apply text-gray-400 hover:no-underline
      cursor-default;
  }
}

.UILink[data-size="lg"] {
  .UILink-Content {
    @apply text-lg;
  }
}

.UILink[data-size="sm"] {
  .UILink-Content {
    @apply text-sm;
  }
}

.UILink[data-halign="start"] {
  .UILink-Content {
    @apply justify-start;
  }
}

.UILink[data-halign="center"] {
  .UILink-Content {
    @apply justify-center;
  }
}

.UILink[data-halign="end"] {
  .UILink-Content {
    @apply justify-end;
  }
}
</style>
