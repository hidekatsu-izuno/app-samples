<script setup lang="ts">
import MenuList from "~/components/v1/common/MenuList.vue"

const data = reactive({
  textboxRequired: false,
  textboxDisabled: false,
  textboxReadonly: false,
  textboxSize: undefined,
  textbox1: "",
  textbox2: "",
  textbox3: "",
  textbox4: "",
  textbox5: "",
  textbox6: "",
  textbox7: "",
  numberboxRequired: false,
  numberboxDisabled: false,
  numberboxReadonly: false,
  numberboxSize: "",
  numberbox1: "",
  numberbox2: "",
  numberbox3: "",
  dateboxRequired: false,
  dateboxDisabled: false,
  dateboxReadonly: false,
  dateboxSize: "",
  datebox1: "",
  datebox2: "",
  datebox3: "",
  timeboxRequired: false,
  timeboxDisabled: false,
  timeboxReadonly: false,
  timeboxSize: "",
  timebox1: "",
  timebox2: "",
  timebox3: "",
  textareaRequired: false,
  textareaDisabled: false,
  textareaReadonly: false,
  textareaSize: "",
  textarea1: "",
  textarea2: "",
  selectboxRequired: false,
  selectboxDisabled: false,
  selectboxReadonly: false,
  selectboxSize: "",
  selectbox1: "",
  selectbox2: "",
  comboboxRequired: false,
  comboboxDisabled: false,
  comboboxReadonly: false,
  comboboxSize: "",
  combobox1: "",
  combobox2: "",
  checkRequired: false,
  checkDisabled: false,
  checkReadonly: false,
  checkSize: "",
  check1: false,
  check2: false,
  switchRequired: false,
  switchDisabled: false,
  switchReadonly: false,
  switchSize: "",
  switch1: false,
  switch2: false,
  checklistRequired: false,
  checklistDisabled: false,
  checklistReadonly: false,
  checklistSize: "",
  checklist1: [],
  checklist2: [],
  radioRequired: false,
  radioDisabled: false,
  radioReadonly: false,
  radioSize: "",
  radio1: "",
  radio2: "",
  radiolistRequired: false,
  radiolistDisabled: false,
  radiolistReadonly: false,
  radiolistSize: "",
  radiolist1: "",
  radiolist2: "",
  fileuploadRequired: false,
  fileuploadDisabled: false,
  fileuploadSize: "",
  fileupload1: undefined as File | undefined,
  fileupload2: undefined as File | undefined,
  multifileuploadRequired: false,
  multifileuploadDisabled: false,
  multifileuploadSize: "",
  multifileupload1: [] as File[],
  multifileupload2: [] as File[],
  pageNavigatorDisabled: false,
  pageNavigator1: 1,
  pageNavigator2: 1,
  paginatorDisabled: false,
  paginator1: 1,
  paginator2: 1,
  paginator3: 1,
  buttonDisabled: false,
  buttonSize: "",
  buttonColor: "blue",
  button1: 0,
  button2: 0,
  button3: 0,
  linkDisabled: false,
  linkSize: "",
  link1: 0,
  link2: 0,
  dataTableWrap: false,
  dataTableEllipsis: false,
  dataTable: [
    { boolean: false, number: 1, string: "aaa", date: "2020-01-01" },
    { boolean: false, number: 2, string: "bbb", date: "2020-02-01" },
    { boolean: false, number: 3, string: "ccc", date: "2020-03-01" },
    { boolean: false, number: 4, string: "ddd", date: "2020-04-01" },
    { boolean: false, number: 5, string: "eee", date: "2020-05-01" },
    { boolean: false, number: 6, string: "fff", date: "2020-06-01" },
    { boolean: false, number: 7, string: "long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-", date: "2020-06-01" },
  ],
  alert1Opend: false,
  alert2Opend: false,
  alert3Opened: false,
  alert4Opened: false,
  alert1: undefined as string | undefined,
  alert2: undefined as string | undefined,
  alert3: undefined as string | undefined,
  alert4: undefined as string | undefined,
})

const textbox1Ref = ref()
const alert1Ref = ref()
const alert2Ref = ref()
const alert3Ref = ref()
const alert4Ref = ref()
const loading = useLoadingIndicator()

async function onValidate() {
  const result = await validate({
    textbox1: textbox1Ref,
    value: 1,
  })
  alert(JSON.stringify(result))
}

function onFooter(modelValue: Record<string, any>[], items: Record<string, any>) {
  const result = { number: 0 }
  for (const rowValue of modelValue) {
    result.number += (rowValue.number ?? 0)
  }
  return result
}
</script>

<template>
  <UIFrame>
    <template #title>
      <h1 class="font-bold text-xl">コンポーネント一覧 (Title)</h1>
    </template>
    <template #actions>
      <div class="flex flex-row items-center gap-2">
        Actions:
        <UIButton @click="onValidate">Validate</UIButton>
      </div>
    </template>
    <template #top>
      Top
    </template>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">テキストボックス (UITextBox)</h2>
          <UICheck v-model="data.textboxRequired" size="sm">required</UICheck>
          <UICheck v-model="data.textboxDisabled" size="sm">disabled</UICheck>
          <UICheck v-model="data.textboxReadonly" size="sm">readonly</UICheck>
          <UISelectBox v-model="data.textboxSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UITextBox
            ref="textbox1Ref"
            v-model="data.textbox1"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
          />
          <UIText type="outline">{{ data.textbox1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
          >パスワード</UILabel>
          <UITextBox
            v-model="data.textbox2"
            type="password"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
          />
          <UIText type="outline">{{ data.textbox2 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
          >メールアドレス</UILabel>
          <UITextBox
            v-model="data.textbox3"
            type="email"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
          />
          <UIText type="outline">{{ data.textbox3 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
          >電話番号</UILabel>
          <UITextBox
            v-model="data.textbox4"
            type="tel"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
          />
          <UIText type="outline">{{ data.textbox4 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
          >URL</UILabel>
          <UITextBox
            v-model="data.textbox5"
            type="url"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
          />
          <UIText type="outline">{{ data.textbox5 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
          >フィルタ</UILabel>
          <UITextBox
            v-model="data.textbox6"
            type="text"
            :filter="(text: string) => text.toUpperCase()"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
          />
          <UIText type="outline">{{ data.textbox6 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textboxRequired"
          >装飾</UILabel>
          <UITextBox
            v-model="data.textbox7"
            type="text"
            halign="center"
            prefix="("
            suffix=")"
            :required="data.textboxRequired"
            :disabled="data.textboxDisabled"
            :readonly="data.textboxReadonly"
            :size="data.textboxSize"
            button="magnify"
          />
          <UIText type="outline">{{ data.textbox7 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">数値ボックス (UINumberBox)</h2>
          <div class="shrink"><input v-model="data.numberboxRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.numberboxDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.numberboxReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.numberboxSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.numberboxRequired"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UINumberBox
            v-model="data.numberbox1"
            :required="data.numberboxRequired"
            :disabled="data.numberboxDisabled"
            :readonly="data.numberboxReadonly"
            :size="(data.numberboxSize as any)"
          />
          <UIText type="outline">{{ data.numberbox1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.numberboxRequired"
          >小数点あり</UILabel>
          <UINumberBox
            v-model="data.numberbox2"
            format="###,##0.0#"
            :required="data.numberboxRequired"
            :disabled="data.numberboxDisabled"
            :readonly="data.numberboxReadonly"
            :size="(data.numberboxSize as any)"
          />
          <UIText type="outline">{{ data.numberbox2 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.numberboxRequired"
          >装飾</UILabel>
          <UINumberBox
            v-model="data.numberbox3"
            :required="data.numberboxRequired"
            :disabled="data.numberboxDisabled"
            :readonly="data.numberboxReadonly"
            :size="data.numberboxSize as any"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.numberbox3 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">日付ボックス (UIDateBox)</h2>
          <div class="shrink"><input v-model="data.dateboxRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.dateboxDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.dateboxReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.dateboxSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UIDateBox
            v-model="data.datebox1"
            :required="data.dateboxRequired"
            :disabled="data.dateboxDisabled"
            :readonly="data.dateboxReadonly"
            :size="(data.dateboxSize as any)"
          />
          <UIText type="outline">{{ data.datebox1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >フォーマット</UILabel>
          <UIDateBox
            v-model="data.datebox2"
            :required="data.dateboxRequired"
            :disabled="data.dateboxDisabled"
            :readonly="data.dateboxReadonly"
            :size="data.dateboxSize as any"
            format="'('u-M-d')'"
          />
          <UIText type="outline">{{ data.datebox2 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UIDateBox
            v-model="data.datebox3"
            :required="data.dateboxRequired"
            :disabled="data.dateboxDisabled"
            :readonly="data.dateboxReadonly"
            :size="(data.dateboxSize as any)"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.datebox3 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">時刻ボックス (UITimeBox)</h2>
          <div class="shrink"><input v-model="data.timeboxRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.timeboxDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.timeboxReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.timeboxSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.timeboxRequired"
          >デフォルト</UILabel>
          <UITimeBox
            v-model="data.timebox1"
            :required="data.timeboxRequired"
            :disabled="data.timeboxDisabled"
            :readonly="data.timeboxReadonly"
            :size="(data.timeboxSize as any)"
          />
          <UIText type="outline">{{ data.timebox1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.timeboxRequired"
          >フォーマット</UILabel>
          <UITimeBox
            v-model="data.timebox2"
            type="HHmmss"
            :required="data.timeboxRequired"
            :disabled="data.timeboxDisabled"
            :readonly="data.timeboxReadonly"
            :size="(data.timeboxSize as any)"
          />
          <UIText type="outline">{{ data.timebox2 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.timeboxRequired"
          >装飾</UILabel>
          <UITimeBox
            v-model="data.timebox3"
            format="H#m#s.SSS"
            :required="data.timeboxRequired"
            :disabled="data.timeboxDisabled"
            :readonly="data.timeboxReadonly"
            :size="(data.timeboxSize as any)"
            halign="center"
            prefix="("
            suffix=")"
          />
          <UIText type="outline">{{ data.timebox3 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">テキストエリア (UITextArea)</h2>
          <div class="shrink"><input v-model="data.textareaRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.textareaDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.textareaReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.textareaSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textareaRequired"
          >デフォルト</UILabel>
          <UITextArea
            v-model="data.textarea1"
            :required="data.textareaRequired"
            :disabled="data.textareaDisabled"
            :readonly="data.textareaReadonly"
            :size="(data.textareaSize as any)"
          />
          <UIText type="outline">{{ data.textarea1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.textareaRequired"
          >装飾</UILabel>
          <UITextArea
            v-model="data.textarea2"
            :required="data.textareaRequired"
            :disabled="data.textareaDisabled"
            :readonly="data.textareaReadonly"
            :size="(data.textareaSize as any)"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.textarea2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">セレクトボックス (UISelectBox)</h2>
          <div class="shrink"><input v-model="data.selectboxRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.selectboxDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.selectboxReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.selectboxSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.selectboxRequired"
          >デフォルト</UILabel>
          <UISelectBox
            v-model="data.selectbox1"
            :required="data.selectboxRequired"
            :disabled="data.selectboxDisabled"
            :readonly="data.selectboxReadonly"
            :size="(data.selectboxSize as any)"
            :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
            placeholder="---"
          />
          <UIText type="outline">{{ data.selectbox1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.selectboxRequired"
          >装飾</UILabel>
          <UISelectBox
            v-model="data.selectbox2"
            :required="data.selectboxRequired"
            :disabled="data.selectboxDisabled"
            :readonly="data.selectboxReadonly"
            :size="(data.selectboxSize as any)"
            :items="[
              { value: '1', text: 'AAA' },
              { value: '2', text: 'BBB' },
              { value: '3' },
              { value: '4' },
              { value: '5' },
              { value: '6', text: 'CCC' },
              { value: '7' },
              { value: '8' },
              { value: '9' },
              { value: '10', text: 'CCC' },
            ]"
            placeholder="---"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.selectbox2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">コンボボックス (UIComboBox)</h2>
          <div class="shrink"><input v-model="data.comboboxRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.comboboxDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.comboboxReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.comboboxSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.comboboxRequired"
          >デフォルト</UILabel>
          <UIComboBox
            v-model="data.combobox1"
            :required="data.comboboxRequired"
            :disabled="data.comboboxDisabled"
            :readonly="data.comboboxReadonly"
            :size="(data.comboboxSize as any)"
            :items="['AAA', 'BBB']"
            placeholder="---"
          />
          <UIText type="outline">{{ data.combobox1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.comboboxRequired"
          >装飾</UILabel>
          <UIComboBox
            v-model="data.combobox2"
            :required="data.comboboxRequired"
            :disabled="data.comboboxDisabled"
            :readonly="data.comboboxReadonly"
            :size="(data.comboboxSize as any)"
            :items="['AAA', 'BBB', '3', '4', '5', 'CCC']"
            placeholder="---"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.combobox2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">チェックボックス (UICheck)</h2>
          <div class="shrink"><input v-model="data.checkRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.checkDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.checkReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.checkSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.checkRequired"
          >デフォルト</UILabel>
          <UICheck
            v-model="data.check1"
            :required="data.checkRequired"
            :disabled="data.checkDisabled"
            :readonly="data.checkReadonly"
            :size="(data.checkSize as any)"
          >チェックボックス</UICheck>
          <UIText type="outline">{{ data.check1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.checkRequired"
          >装飾</UILabel>
          <UICheck
            v-model="data.check2"
            :required="data.checkRequired"
            :disabled="data.checkDisabled"
            :readonly="data.checkReadonly"
            :size="(data.checkSize as any)"
            value="X"
            prefix="("
            suffix=")"
            halign="center"
          >チェックボックス</UICheck>
          <UIText type="outline">{{ data.check2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">スイッチ (UISwitch)</h2>
          <div class="shrink"><input v-model="data.switchRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.switchDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.switchReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.switchSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.switchRequired"
          >デフォルト</UILabel>
          <UISwitch
            v-model="data.switch1"
            :required="data.switchRequired"
            :disabled="data.switchDisabled"
            :readonly="data.switchReadonly"
            :size="(data.switchSize as any)"
          >トグルボタン</UISwitch>
          <UIText type="outline">{{ data.switch1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.switchRequired"
          >装飾</UILabel>
          <UISwitch
            v-model="data.switch2"
            :required="data.switchRequired"
            :disabled="data.switchDisabled"
            :readonly="data.switchReadonly"
            :size="(data.switchSize as any)"
            value="X"
            prefix="("
            suffix=")"
            halign="center"
          >トグルボタン</UISwitch>
          <UIText type="outline">{{ data.check2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">チェックリスト (UICheckList)</h2>
          <div class="shrink"><input v-model="data.checklistRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.checklistDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.checklistReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.checklistSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UICheckList
            v-model="data.checklist1"
            :required="data.checklistRequired"
            :disabled="data.checklistDisabled"
            :readonly="data.checklistReadonly"
            :size="(data.checklistSize as any)"
            :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
          />
          <UIText type="outline">{{ data.checklist1.join(", ") }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UICheckList
            v-model="data.checklist2"
            :required="data.checklistRequired"
            :disabled="data.checklistDisabled"
            :readonly="data.checklistReadonly"
            :size="(data.checklistSize as any)"
            :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.checklist2.join(", ") }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ラジオボタン (UIRadio)</h2>
          <div class="shrink"><input v-model="data.radioRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.radioDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.radioReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.radioSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.radioRequired"
          >デフォルト</UILabel>
          <div>
            <UIRadio
              v-model="data.radio1"
              :required="data.radioRequired"
              :disabled="data.radioDisabled"
              :readonly="data.radioReadonly"
              :size="(data.radioSize as any)"
              name="radio1"
              value="1"
            >ラジオボタン</UIRadio>
            <UIRadio
              v-model="data.radio1"
              :required="data.radioRequired"
              :disabled="data.radioDisabled"
              :readonly="data.radioReadonly"
              :size="(data.radioSize as any)"
              name="radio1"
              value="2"
            >ラジオボタン</UIRadio>
          </div>

          <UIText type="outline">{{ data.radio1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            :required="data.radioRequired"
          >装飾</UILabel>
          <UIRadio
            v-model="data.radio2"
            :required="data.radioRequired"
            :disabled="data.radioDisabled"
            :readonly="data.radioReadonly"
            :size="(data.radioSize as any)"
            name="radio2"
            prefix="("
            suffix=")"
            halign="center"
          >ラジオボタン</UIRadio>
          <UIText type="outline">{{ data.radio2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ラジオリスト (UIRadioList)</h2>
          <div class="shrink"><input v-model="data.radiolistRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.radiolistDisabled" type="checkbox" /> disabled</div>
          <div class="shrink"><input v-model="data.radiolistReadonly" type="checkbox" /> readonly</div>
          <UISelectBox v-model="data.radiolistSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UIRadioList
            v-model="data.radiolist1"
            :required="data.radiolistRequired"
            :disabled="data.radiolistDisabled"
            :readonly="data.radiolistReadonly"
            :size="(data.radiolistSize as any)"
            :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
          />
          <UIText type="outline">{{ data.radiolist1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UIRadioList
            v-model="data.radiolist2"
            :required="data.radiolistRequired"
            :disabled="data.radiolistDisabled"
            :readonly="data.radiolistReadonly"
            :size="(data.radiolistSize as any)"
            :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.radiolist2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ファイル選択 (UIFileUpload)</h2>
          <div class="shrink"><input v-model="data.fileuploadRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.fileuploadDisabled" type="checkbox" /> disabled</div>
          <UISelectBox v-model="data.fileuploadSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UIFileUpload
            v-model="data.fileupload1"
            :required="data.fileuploadRequired"
            :disabled="data.fileuploadDisabled"
            :size="(data.fileuploadSize as any)"
          />
          <UIText type="outline">{{ data.fileupload1?.name }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UIFileUpload
            v-model="data.fileupload2"
            :required="data.fileuploadRequired"
            :disabled="data.fileuploadDisabled"
            :size="(data.fileuploadSize as any)"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.fileupload2?.name }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">複数ファイル選択 (UIMultiFileUpload)</h2>
          <div class="shrink"><input v-model="data.multifileuploadRequired" type="checkbox" /> required</div>
          <div class="shrink"><input v-model="data.multifileuploadDisabled" type="checkbox" /> disabled</div>
          <UISelectBox v-model="data.multifileuploadSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UIMultiFileUpload
            v-model="data.multifileupload1"
            :required="data.multifileuploadRequired"
            :disabled="data.multifileuploadDisabled"
            :size="(data.multifileuploadSize as any)"
          />
          <UIText type="outline">{{ data.multifileupload1.map((item: File) => item.name) }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UIMultiFileUpload
            v-model="data.multifileupload2"
            :required="data.multifileuploadRequired"
            :disabled="data.multifileuploadDisabled"
            :size="(data.multifileuploadSize as any)"
            prefix="("
            suffix=")"
            halign="center"
          />
          <UIText type="outline">{{ data.multifileupload2.map((item: File) => item.name) }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ページ制御 (UIPageNavigator)</h2>
          <div class="shrink"><input v-model="data.pageNavigatorDisabled" type="checkbox" /> disabled</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIPageNavigator v-model="data.pageNavigator1" :disabled="data.pageNavigatorDisabled" />
        <UIText type="outline">{{ data.pageNavigator1 }}</UIText>

        <UIPageNavigator
          v-model="data.pageNavigator2"
          :disabled="data.pageNavigatorDisabled"
          halign="center"
          :page-size="50"
          :total-count="1000"
        />
        <UIText type="outline">{{ data.pageNavigator2 }}</UIText>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ページング (UIPaginator)</h2>
          <div class="shrink"><input v-model="data.paginatorDisabled" type="checkbox" /> disabled</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIPaginator v-model="data.paginator1" :disabled="data.paginatorDisabled" />
        <UIText type="outline">{{ data.paginator1 }}</UIText>

        <UIPaginator
          v-model="data.paginator2"
          :disabled="data.paginatorDisabled"
          halign="center"
          :page-size="50"
          :total-count="350"
        />
        <UIText type="outline">{{ data.paginator2 }}</UIText>

        <UIPaginator
          v-model="data.paginator3"
          :disabled="data.paginatorDisabled"
          halign="center"
          :page-size="50"
          :total-count="1000"
        />
        <UIText type="outline">{{ data.paginator3 }}</UIText>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ボタン (UIButton)</h2>
          <input v-model="data.buttonDisabled" type="checkbox" /> disabled
          <UISelectBox
            v-model="data.buttonColor"
            size="sm"
            :items="[
              { value: 'blue' },
              { value: 'slate' }, { value: 'gray' }, { value: 'zinc' }, { value: 'neutral' }, { value: 'stone' },
              { value: 'red' }, { value: 'orange' }, { value: 'amber' }, { value: 'lime' },
              { value: 'green' }, { value: 'emerald' }, { value: 'teal' },
              { value: 'cyan' }, { value: 'sky' }, { value: 'indigo' },
              { value: 'violet' }, { value: 'purple' }, { value: 'fuchsia' }, { value: 'pink' }, { value: 'rose' },
            ]"
          />
          <UISelectBox v-model="data.buttonSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UIButton
            :color="(data.buttonColor as any)"
            :disabled="data.buttonDisabled"
            :size="(data.buttonSize as any)"
            @click="data.button1++"
          >ボタン</UIButton>
          <UIText type="outline">{{ data.button1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >アウトライン</UILabel>
          <UIButton
            type="outline"
            :color="(data.buttonColor as any)"
            :disabled="data.buttonDisabled"
            :size="(data.buttonSize as any)"
            @click="data.button2++"
          >ボタン</UIButton>
          <UIText type="outline">{{ data.button2 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UIButton
            :color="(data.buttonColor as any)"
            :disabled="data.buttonDisabled"
            :size="(data.buttonSize as any)"
            prefix="("
            suffix=")"
            halign="center"
            @click="data.button3++"
          ><UIIcon name="cog" />ボタン</UIButton>
          <UIText type="outline">{{ data.button3 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">リンク (UILink)</h2>
          <div class="shrink"><input v-model="data.linkDisabled" type="checkbox" /> disabled</div>
          <UISelectBox v-model="data.linkSize" size="sm" :items="[{ value: 'lg' }, { value: 'sm' }]" />
        </div>
      </template>

      <div class="grid gap-2 p-6">
        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
            description="デフォルトの表示設定です"
          >デフォルト</UILabel>
          <UILink
            :disabled="data.linkDisabled"
            :size="(data.linkSize as any)"
            @click="data.link1++"
          >リンク</UILink>
          <UIText type="outline">{{ data.link1 }}</UIText>
        </div>

        <div class="grid grid-cols-2 gap-x-2">
          <UILabel
            class="col-span-2"
          >装飾</UILabel>
          <UILink
            :disabled="data.linkDisabled"
            :size="(data.linkSize as any)"
            prefix="("
            suffix=")"
            halign="center"
            @click="data.link2++"
          ><UIIcon name="cog" />リンク</UILink>
          <UIText type="outline">{{ data.link2 }}</UIText>
        </div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">タブ (UITabBar)</h2>
        </div>
      </template>

      <UITabBar
        :items="[
          { value: 'tab1', text: 'タブ１' },
          { value: 'tab2', text: 'タブ２' },
          { value: 'tab3', text: 'タブ３' }
        ]"
      />
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">注記 (UINote)</h2>
        </div>
      </template>

      <div class="flex flex-col gap-2 p-3">
        <UINote type="error">エラーです。</UINote>
        <UINote type="warn">警告です。</UINote>
        <UINote type="info">情報です。</UINote>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">データテーブル (UIDataTable)</h2>
          <div class="shrink"><input v-model="data.dataTableWrap" type="checkbox" /> wrap</div>
          <div class="shrink"><input v-model="data.dataTableEllipsis" type="checkbox" /> ellipsis</div>
        </div>
      </template>

      <UIDataTable
        v-model="data.dataTable"
        :wrap="data.dataTableWrap"
        :ellipsis="data.dataTableEllipsis"
        style="height:400px"
        :items="[
          { key: 'string', label: '文字列', width: '400px' },
          { key: 'date', label: '日付', halign: 'center', format: (value: string) => formatDate(value, 'uuuu/MM/dd') },
          { key: 'number', label: '数値', halign: 'end', width: '300px' },
          { key: 'etc1', label: 'その他1', width: '300px' },
          { key: 'etc2', label: 'その他2', width: '300px' },
          { key: 'etc3', label: 'その他3', width: '300px' },
        ]"
      />
      <br />
      <UIDataTable
        v-model="data.dataTable"
        selectable
        style="height: 400px"
        :wrap="data.dataTableWrap"
        :ellipsis="data.dataTableEllipsis"
        :fix="{ top: 1, bottom: 1, left: 1, right: 1 }"
        :items="[
          { key: 'boolean', label: '', width: '80px', halign: 'center', syncSelector: true },
          { key: 'string', label: '文字列', width: '400px' },
          { key: 'date', label: '日付', halign: 'center' },
          { key: 'number', label: '数値', halign: 'end', width: '300px' },
        ]"
        :footer="onFooter"
      >
        <template #contentCell="{ item, value, record }">
          <template v-if="item.key === 'boolean'">
            <UICheck v-model="record[item.key]" halign="center" />
          </template>
          <template v-else-if="item.key === 'date'">{{
            formatDate(value, 'uuuu/MM/dd')
          }}</template>
        </template>
      </UIDataTable>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">アラートダイアログ (UIAlert)</h2>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-2 p-6">
        <UIAlert ref="alert1Ref" type="error" @close="data.alert1 = $event">あ</UIAlert>
        <UIButton @click="() => alert1Ref.open()">OK</UIButton>
        <div class="border">{{ data.alert1 }}</div>

        <UIAlert ref="alert2Ref" type="warn" :buttons="['ok', 'cancel']" @close="data.alert2 = $event">い</UIAlert>
        <UIButton @click="() => alert2Ref.open()">OK/CANCEL</UIButton>
        <div class="border">{{ data.alert2 }}</div>

        <UIAlert ref="alert3Ref" type="info" :buttons="['yes', 'no']" @close="data.alert3 = $event">う</UIAlert>
        <UIButton @click="() => alert3Ref.open()">YES/NO</UIButton>
        <div class="border">{{ data.alert3 }}</div>

        <UIAlert ref="alert4Ref" type="error" :buttons="['yes', 'no', 'cancel']" title="タイトル" @close="data.alert4 = $event">え</UIAlert>
        <UIButton @click="() => alert4Ref.open()">YES/NO/CANCEL</UIButton>
        <div class="border">{{ data.alert4 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ローディング表示 (UILoadingIndicator)</h2>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-2 p-6">
        <UIButton @click="loading.show({ throttle: 1000, duration: 4000 })">Show</UIButton>
      </div>
    </UICard>

    <template #bottom>
      Bottom
    </template>
    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
