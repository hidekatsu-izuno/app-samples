<script setup lang="ts">
import { UserSchema } from '@/utils/schemas';
import { z } from 'zod';

const props = withDefaults(defineProps<{
  title?: string
  user?: z.infer<typeof UserSchema>
  menus?: Array<z.infer<typeof MenuSchema>>
}>(), {
  menus: () => []
})
</script>

<template>
  <div class="min-h-screen">
    <div class="flex">
      <div class="text-2xl font-bold">{{ title }}</div>
    </div>
    <div class="grid grid-cols-[198px_1fr]">
      <div>
        <slot name="drawer" />
      </div>
      <div class="">
        <slot />
      </div>
    </div>
  </div>
</template>
