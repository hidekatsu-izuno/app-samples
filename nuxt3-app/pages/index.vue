<script setup lang="ts">
import { onBackupState, useHistoryState } from "vue-history-state"
import { EmailSchema, UserPasswordSchema } from "~/utils/schemas"

const loading = useLoadingIndicator()
const historyState = useHistoryState()

const data = reactive(historyState.data || {
  email: "",
  showMessage: false,
  message: "",
})

const emailRef = ref()
const passwordRef = ref()
const alertRef = ref()

onBackupState(() => data)

const goChangePasswordPage = () => {
  historyState.push("/change_password")
}

const onLoginButtonClick = async () => {
  try {
    const request = await validate({
      email: emailRef,
      password: passwordRef,
    })

    try {
      loading.show()
      const result = await fetchURL("/api/auth/signin", {
        method: "POST",
        body: request,
      })
      location.href = result.redirect
    } catch (err) {
      loading.hide()
      alertRef.value.open("ログインに失敗しました。")
    }
  } catch (err) {
    alertRef.value.open("入力に誤りがあります。")
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
        <div class="grid gap-y-4 p-6">
          <div>
            <UILabel required>メールアドレス</UILabel>
            <UITextBox
              ref="emailRef"
              type="email"
              required
              :schema="EmailSchema"
            />
          </div>
          <div>
            <UILabel required>パスワード</UILabel>
            <UITextBox
              ref="passwordRef"
              type="password"
              name="password"
              required
              :schema="UserPasswordSchema"
            />
          </div>
          <div>
            <UILink halign="end" class="text-sm" @click="goChangePasswordPage">
              パスワードを忘れた方はこちら
            </UILink>
          </div>
          <div>
            <UIButton @click="onLoginButtonClick">
              ログイン
            </UIButton>
          </div>
        </div>
      </UICard>
      <div class="m-4 mb-8 text-center">
        Copyright &copy; Hidekatsu Izuno
      </div>
    </div>
    <UIAlert ref="alertRef" />
  </div>
</template>
