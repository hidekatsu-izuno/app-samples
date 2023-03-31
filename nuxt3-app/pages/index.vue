
<script setup lang="ts">
import { useHistoryState } from 'vue-history-state'
import { Validator } from '~~/utils/validator'
import { UserIdSchema, PasswordSchema } from '@/utils/schemas'

const historyState = useHistoryState()
const validator = new Validator()

const goPasswordChangePage = () => {
  historyState.push("/change_password")
}

const onLoginButtonClick = async () => {
  const validated = validator.validate()
  if (validated) {
    const result = await $fetch("/api/login", { method: "POST", body: validated })
    location.href = result.redirect
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
            <TextBox type="email" label="メールアドレス" name="userId" :schema="UserIdSchema" />
          </div>
          <div>
            <TextBox type="password" label="パスワード" name="password" :schema="PasswordSchema" />
          </div>
          <div>
            <NumberBox required format="aaa#.##bbb" />
          </div>
          <div>
            <DateBox required />
          </div>
          <div>
            <Hyperlink halign="end" class="text-sm" @click="goPasswordChangePage">パスワードを忘れた方はこちら</Hyperlink>
          </div>
          <div>
            <Button halign="center" @click="onLoginButtonClick">ログイン</Button>
          </div>
        </Form>
      </Card>
      <div class="m-4 mb-8">Copyright &copy; Hidekatsu Izuno</div>
    </div>
  </div>
</template>
