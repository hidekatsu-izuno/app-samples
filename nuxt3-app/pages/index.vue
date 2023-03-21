
<template>
  <App class="flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md flex flex-col items-center">
      <h1 class="text-4xl m-4">Nuxt3 example</h1>
      <Card>
        <div class="grid grid-cols-1 gap-y-4">
          <div>
            <TextBox label="メールアドレス" />
          </div>
          <div>
            <TextBox label="パスワード" />
          </div>
          <div>
            <Anchor halign="end" class="text-sm">パスワードを忘れた方はこちら</Anchor>
          </div>
          <div>
            <Button halign="center">LOGIN</Button>
          </div>
        </div>
      </Card>
      <div class="m-4">Copyright &copy; Hidekatsu Izuno</div>
    </div>
  </App>
</template>
