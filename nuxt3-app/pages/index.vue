
<script setup lang="ts">
import { useValidator } from '@/composables/validator';

const data = reactive({
  userId: "",
  password: "",
})

const validator = useValidator()

const onLoginButtonClick = async (event: MouseEvent) => {
  const validated = validator.validate()
  if (validated) {
    //const result = await $fetch("/api/login", { method: "POST", data: validated })
    alert("login: " + JSON.stringify(validated))
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md flex flex-col items-center">
      <h1 class="font-bold text-4xl m-4">Nuxt3 example</h1>
      <Card>
        <Form class="grid grid-cols-1 gap-y-4" :validator="validator">
          <div>
            <TextBox label="メールアドレス" name="userId" type="email" required />
          </div>
          <div>
            <TextBox label="パスワード" name="password" type="password" />
          </div>
          <div>
            <Hyperlink halign="end" class="text-sm">パスワードを忘れた方はこちら</Hyperlink>
          </div>
          <div>
            <Button halign="center" @click="onLoginButtonClick">LOGIN</Button>
          </div>
        </Form>
      </Card>
      <div class="m-4 mb-8">Copyright &copy; Hidekatsu Izuno</div>
    </div>
  </div>
</template>
