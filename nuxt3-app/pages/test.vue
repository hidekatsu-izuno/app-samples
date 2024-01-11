<script setup>
useHead({
  title: "Title",
})

const data = reactive({
  count: 1,
})

function onClick() {
  data.count++
}
</script>

<template>
  <div>
    <div>{{ data.count }}</div>
    <button class="btn" @click="onClick">add</button>
  </div>
</template>

<style>
.btn { font-weight: bold; }
</style>
