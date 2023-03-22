
<script setup lang="ts">
const data = reactive({
  userId: "",
  password: "",
})

const onLoginButtonClick = async (event: MouseEvent) => {
  const result = await $fetch("/api/login", { method: "POST" })
  alert("login!")
}
</script>

<template>
  <App class="flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md flex flex-col items-center">
      <h1 class="font-bold text-4xl m-4">Nuxt3 example</h1>
      <Card>
        <div class="grid grid-cols-1 gap-y-4">
          <div>
            <TextBox label="メールアドレス" type="email" v-model:value="data.userId" />
          </div>
          <div>
            <TextBox label="パスワード" type="password" v-model:value="data.password" />
          </div>
          <div>
            <Hyperlink halign="end" class="text-sm">パスワードを忘れた方はこちら</Hyperlink>
          </div>
          <div>
            <Button halign="center" @click="onLoginButtonClick">LOGIN</Button>
          </div>
        </div>
      </Card>
      <div class="m-4 mb-8">Copyright &copy; Hidekatsu Izuno</div>
    </div>
  </App>
</template>
