<template>
  <div class="UICard">
    <div v-if="$slots.header" class="UICard-Header">
      <slot name="header" />
    </div>
    <div class="UICard-Content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="UICard-Footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.UICard {
  @apply flex flex-col
    shadow
    border border-slate-300 rounded-lg
    bg-white
    overflow-hidden;
}

.UICard-Header {
  @apply border-b border-slate-300
    bg-slate-50;
}

.UICard-Content {
  @apply grow;
}

.UICard-Footer {
  @apply border-t border-slate-300
    bg-slate-50;
}
</style>
