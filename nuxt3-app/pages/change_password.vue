
<script setup lang="ts">
import { useValidator } from '@/composables/validator'

const validator = useValidator()

const onPasswordChangeButtonClick = async (event: MouseEvent) => {
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
      <h1 class="font-bold text-4xl m-4">パスワード再設定</h1>
      <Card>
        <Form class="grid grid-cols-1 gap-y-4" :validator="validator">
          <div>
            <TextBox label="メールアドレス" name="userId" type="email"
              required :maxLength="256"
            />
          </div>
          <div>
            <Button halign="center" @click="onPasswordChangeButtonClick">パスワード再設定メールを送信</Button>
          </div>
        </Form>
      </Card>
      <div class="m-4 mb-8">Copyright &copy; Hidekatsu Izuno</div>
    </div>
  </div>
</template>
