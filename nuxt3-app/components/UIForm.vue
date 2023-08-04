<script setup lang="ts">
import { ValidatorKey, Validator } from "~/utils/validator"

const props = withDefaults(defineProps<{
  validator?: Validator
}>(), {
})

if (props.validator) {
  provide(ValidatorKey, props.validator)
}
</script>

<template>
  <form class="UIForm">
    <slot />
  </form>
</template>
