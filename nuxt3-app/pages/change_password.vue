
<script setup lang="ts">
import { Validator } from '@/utils/validator'
import { UserIdSchema } from '@/utils/schemas'

const validator = new Validator()

const onPasswordResetButtonClick = async () => {
  const validated = validator.validate()
  if (validated) {
    const result = await $fetch("/api/send_password_reset_email", { method: "POST", data: validated })
    alert(result.message)
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md flex flex-col items-center">
      <h1 class="font-bold text-4xl m-4">パスワード再設定</h1>
      <Card>
        <Form class="grid grid-cols-1 gap-y-4" :validator="validator">
          <div>
            <TextBox label="メールアドレス" name="email" type="email" required :schema="UserIdSchema" />
          </div>
          <div>
            <Button halign="center" @click="onPasswordResetButtonClick">パスワード再設定メールを送信</Button>
          </div>
        </Form>
      </Card>
      <div class="m-4 mb-8">Copyright &copy; Hidekatsu Izuno</div>
    </div>
  </div>
</template>
