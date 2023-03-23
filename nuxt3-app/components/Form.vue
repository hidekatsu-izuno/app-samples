<script setup type="ts">
import { ValidatorKey, Validator } from "@/composables/validator"

const props = withDefaults(defineProps<{
  validator?: Validator
}>(), {
  validator: new Validator()
})

provide(ValidatorKey, props.validator)
</script>

<template>
  <form class="Form">
    <slot />
  </form>
</template>
