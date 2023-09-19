<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: "slideup",
  delay?: string,
  duration?: string,
}>(), {
  delay: "0s",
  duration: "1s",
  timing: "ease",
})
</script>

<template>
  <Transition
    :name="`UIEffect-${props.type}`"
  >
    <slot />
  </Transition>
</template>

<style>
.UIEffect-slideup-enter-active,
.UIEffect-slideup-leave-active {
  transition: clip-path v-bind("props.duration") ease v-bind("props.delay");
}

.UIEffect-slideup-enter-to,
.UIEffect-slideup-leave-from {
  clip-path: inset(0 0 0 0);
}

.UIEffect-slideup-enter-from,
.UIEffect-slideup-leave-to {
  clip-path: inset(0 0 100% 0);
}
</style>
