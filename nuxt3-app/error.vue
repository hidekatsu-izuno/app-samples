<script setup lang="ts">
const error = useError()
const statusCode = ref<number | undefined>(undefined)
const message = ref("予期しないエラーが発生しました。")
if (error.value) {
  statusCode.value = "statusCode" in error.value ? error.value.statusCode : undefined
  if (statusCode.value === 401) {
    message.value = "認証に失敗しました。"
  } else if (statusCode.value === 404) {
    message.value = "ページが見つかりません。"
  } else if (statusCode.value && statusCode.value < 500) {
    message.value = "リクエストの内容に不備があります。"
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md">
      <h1 class="m-4 font-bold text-4xl text-center">
        Nuxt3 Sample App
      </h1>
      <UICard>
        <div class="flex flex-col items-center justify-center gap-4 p-4">
          <div v-if="statusCode">{{ statusCode }} エラーが発生しました。</div>
          <div>{{ message }}</div>
        </div>
      </UICard>
    </div>
  </div>
</template>
