<template>
  <div class="UICard flex flex-col w-full border border-slate-300 rounded-lg bg-white shadow">
    <div v-if="$slots.header" class="p-3 bg-slate-50 border-b border-slate-300 rounded-t-lg">
      <slot name="header" />
    </div>
    <div class="grow p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="p-3 bg-slate-50 border-t border-slate-300 rounded-b-lg">
      <slot name="footer" />
    </div>
  </div>
</template>
