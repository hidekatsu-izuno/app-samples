<script setup lang="ts">
const validator = new Validator()
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 justify-center py-10">
    <div class="w-full max-w-xl flex flex-col items-center">
      <Form :validator="validator">
        <h1 class="font-bold text-4xl m-4">Component samples</h1>
        <div class="grid grid-cols-1 gap-y-4">
          <Card>
            <h2 class="font-bold text-3xl mb-2">TextBox</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <TextBox type="text" label="TextBox (text)" name="textBoxText" />
              <TextBox type="password" label="TextBox (password)" name="textBoxPassowrd" />
              <TextBox type="email" label="TextBox (email)" name="textBoxEmail" />
              <TextBox type="tel" label="TextBox (tel)" name="textBoxTel" />
              <TextBox type="url" label="TextBox (url)" name="textBoxUrl" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">TextArea</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <TextArea label="TextArea" name="textArea" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">NumberBox</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <NumberBox label="NumberBox" name="numberBox" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">DateBox</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <DateBox label="DateBox" name="dateBox" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">SelectBox</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <SelectBox label="SelectBox" name="selectBox" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">RadioList</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <RadioList label="RadioList" name="radioList" :items="[{ value: '1', text: 'A'}, { value: '2', text: 'B'}, { value: '3', text: 'C'}]" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">CheckList</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <CheckList label="CheckList" name="checkList" :items="[{ value: '1', text: 'A'}, { value: '2', text: 'B'}, { value: '3', text: 'C'}]" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">CheckBox</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <CheckBox label="CheckBox" name="checkBox" text="TEXT" />
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">Button</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <Button label="Button" name="button">BUTTON</Button>
            </div>
          </Card>
          <Card>
            <h2 class="font-bold text-3xl mb-2">Hyperlink</h2>
            <div class="grid grid-cols-1 gap-y-4">
              <Hyperlink label="Hyperlink" name="hyperlink">HYPERLINK</Hyperlink>
            </div>
          </Card>
        </div>
      </Form>
    </div>
  </div>
</template>
