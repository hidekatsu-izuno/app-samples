<script setup lang="ts">
import Menu from "~/components/v1/CM0001/Menu.vue"
</script>

<template>
<Frame title="トップ">
<template v-slot:headerRight>Right</template>
<template v-slot:headerBottom>Bottom</template>

<template v-slot:main>
  <div style="height:1000px">Body</div>
</template>

<template v-slot:footer>Footer</template>
<template v-slot:drawer><Menu /></template>
</Frame>
</template>
