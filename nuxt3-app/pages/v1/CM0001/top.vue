<script setup lang="ts">
import MenuList from "~/components/v1/CM0001/MenuList.vue"

const data = reactive({
  textboxRequired: false,
  textboxDisabled: false,
  textboxReadonly: false,
  textboxSize: "",
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
  checklistRequired: false,
  checklistDisabled: false,
  checklistReadonly: false,
  checklistSize: "",
  checklist1: [],
  checklist2: [],
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
  paginatorDisabled: false,
  paginator1: 1,
  paginator2: 1,
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
  messageBox1Opend: false,
  messageBox2Opend: false,
  messageBox3Opened: false,
  messageBox4Opened: false,
  messageBox1: undefined as string | undefined,
  messageBox2: undefined as string | undefined,
  messageBox3: undefined as string | undefined,
  messageBox4: undefined as string | undefined,
})

const textbox1Ref = ref()
const indicator = useLoadingIndicator()

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
          <input v-model="data.textboxRequired" type="checkbox">required
          <input v-model="data.textboxDisabled" type="checkbox">disabled
          <input v-model="data.textboxReadonly" type="checkbox">readonly
          <UISelectBox v-model="data.textboxSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
          <UIButton size="small" @click="onValidate">validate</UIButton>
        </div>
      </template>
      <div class="grid gap-2 p-6 p-6">
        <UITextBox
          ref="textbox1Ref"
          v-model="data.textbox1"
          label="デフォルト"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox1 }}</div>
          </template>
        </UITextBox>

        <UITextBox
          v-model="data.textbox2"
          label="パスワード"
          type="password"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox2 }}</div>
          </template>
        </UITextBox>

        <UITextBox
          v-model="data.textbox3"
          label="メールアドレス"
          type="email"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox3 }}</div>
          </template>
        </UITextBox>

        <UITextBox
          v-model="data.textbox4"
          label="電話番号"
          type="tel"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox4 }}</div>
          </template>
        </UITextBox>

        <UITextBox
          v-model="data.textbox5"
          label="URL"
          type="url"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox5 }}</div>
          </template>
        </UITextBox>

        <UITextBox
          v-model="data.textbox6"
          label="フィルタ"
          type="text"
          :filter="(text: string) => text.toUpperCase()"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox6 }}</div>
          </template>
        </UITextBox>

        <UITextBox
          v-model="data.textbox7"
          label="装飾"
          type="text"
          prefix="("
          suffix=")"
          halign="center"
          :required="data.textboxRequired"
          :disabled="data.textboxDisabled"
          :readonly="data.textboxReadonly"
          :size="data.textboxSize"
        >
          <template #end>
            <div class="border w-1/2 self-stretch">{{ data.textbox7 }}</div>
          </template>
        </UITextBox>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">数値ボックス (UINumberBox)</h2>
          <div class="shrink"><input v-model="data.numberboxRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.numberboxDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.numberboxReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.numberboxSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6 p-6">
        <UINumberBox
          v-model="data.numberbox1"
          label="デフォルト"
          :required="data.numberboxRequired"
          :disabled="data.numberboxDisabled"
          :readonly="data.numberboxReadonly"
          :size="data.numberboxSize"
        />
        <div class="border">{{ data.numberbox1 }}</div>

        <UINumberBox
          v-model="data.numberbox2"
          label="小数点あり"
          format="###,##0.0#"
          :required="data.numberboxRequired"
          :disabled="data.numberboxDisabled"
          :readonly="data.numberboxReadonly"
          :size="data.numberboxSize"
        />
        <div class="border">{{ data.numberbox2 }}</div>

        <UINumberBox
          v-model="data.numberbox3"
          label="装飾"
          :required="data.numberboxRequired"
          :disabled="data.numberboxDisabled"
          :readonly="data.numberboxReadonly"
          :size="data.numberboxSize"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.numberbox3 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">日付ボックス (UIDateBox)</h2>
          <div class="shrink"><input v-model="data.dateboxRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.dateboxDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.dateboxReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.dateboxSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIDateBox
          v-model="data.datebox1"
          label="デフォルト"
          :required="data.dateboxRequired"
          :disabled="data.dateboxDisabled"
          :readonly="data.dateboxReadonly"
          :size="data.dateboxSize"
        />
        <div class="border">{{ data.datebox1 }}</div>

        <UIDateBox
          v-model="data.datebox2"
          label="フォーマット"
          :required="data.dateboxRequired"
          :disabled="data.dateboxDisabled"
          :readonly="data.dateboxReadonly"
          :size="data.dateboxSize"
          format="'('u-M-d')'"
        />
        <div class="border">{{ data.datebox2 }}</div>

        <UIDateBox
          v-model="data.datebox3"
          label="装飾"
          :required="data.dateboxRequired"
          :disabled="data.dateboxDisabled"
          :readonly="data.dateboxReadonly"
          :size="data.dateboxSize"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.datebox3 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">時刻ボックス (UITimeBox)</h2>
          <div class="shrink"><input v-model="data.timeboxRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.timeboxDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.timeboxReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.timeboxSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UITimeBox
          v-model="data.timebox1"
          label="デフォルト"
          :required="data.timeboxRequired"
          :disabled="data.timeboxDisabled"
          :readonly="data.dateboxReadonly"
          :size="data.timeboxSize"
        />
        <div class="border">{{ data.timebox1 }}</div>

        <UITimeBox
          v-model="data.timebox2"
          type="HHmmss"
          label="フォーマット"
          :required="data.timeboxRequired"
          :disabled="data.timeboxDisabled"
          :readonly="data.timeboxReadonly"
          :size="data.timeboxSize"
        />
        <div class="border">{{ data.timebox2 }}</div>

        <UITimeBox
          v-model="data.timebox3"
          label="装飾"
          format="H#m#s.SSS"
          :required="data.timeboxRequired"
          :disabled="data.timeboxDisabled"
          :readonly="data.timeboxReadonly"
          :size="data.timeboxSize"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.timebox3 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">テキストエリア (UITextArea)</h2>
          <div class="shrink"><input v-model="data.textareaRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.textareaDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.textareaReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.textareaSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UITextArea
          v-model="data.textarea1"
          label="デフォルト"
          :required="data.textareaRequired"
          :disabled="data.textareaDisabled"
          :readonly="data.textareaReadonly"
          :size="data.textareaSize"
        />
        <div class="border">{{ data.textarea1 }}</div>

        <UITextArea
          v-model="data.textarea2"
          label="装飾"
          :required="data.textareaRequired"
          :disabled="data.textareaDisabled"
          :readonly="data.textareaReadonly"
          :size="data.textareaSize"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.textarea2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">セレクトボックス (UISelectBox)</h2>
          <div class="shrink"><input v-model="data.selectboxRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.selectboxDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.selectboxReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.selectboxSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UISelectBox
          v-model="data.selectbox1"
          label="デフォルト"
          :required="data.selectboxRequired"
          :disabled="data.selectboxDisabled"
          :readonly="data.selectboxReadonly"
          :size="data.selectboxSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
          placeholder="---"
        />
        <div class="border">{{ data.selectbox1 }}</div>

        <UISelectBox
          v-model="data.selectbox2"
          label="装飾"
          :required="data.selectboxRequired"
          :disabled="data.selectboxDisabled"
          :readonly="data.selectboxReadonly"
          :size="data.selectboxSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }, { value: '3' }]"
          placeholder="---"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.selectbox2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">コンボボックス (UIComboBox)</h2>
          <div class="shrink"><input v-model="data.comboboxRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.comboboxDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.comboboxReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.comboboxSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIComboBox
          v-model="data.combobox1"
          label="デフォルト"
          :required="data.comboboxRequired"
          :disabled="data.comboboxDisabled"
          :readonly="data.comboboxReadonly"
          :size="data.comboboxSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '23', text: 'BBB' }]"
          placeholder="---"
        />
        <div class="border">{{ data.combobox1 }}</div>

        <UIComboBox
          v-model="data.combobox2"
          label="装飾"
          :required="data.comboboxRequired"
          :disabled="data.comboboxDisabled"
          :readonly="data.comboboxReadonly"
          :size="data.comboboxSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }, { value: '3' }]"
          placeholder="---"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.combobox2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">チェックボックス (UICheck)</h2>
          <div class="shrink"><input v-model="data.checkRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.checkDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.checkReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.checkSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UICheck
          v-model="data.check1"
          label="デフォルト"
          :required="data.checkRequired"
          :disabled="data.checkDisabled"
          :readonly="data.checkReadonly"
          :size="data.checkSize"
        >チェックボックス</UICheck>
        <div class="border">{{ data.check1 }}</div>

        <UICheck
          v-model="data.check2"
          label="装飾"
          :required="data.checkRequired"
          :disabled="data.checkDisabled"
          :readonly="data.checkReadonly"
          :size="data.checkSize"
          prefix="("
          suffix=")"
          halign="center"
        >チェックボックス</UICheck>
        <div class="border">{{ data.check2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">チェックリスト (UICheckList)</h2>
          <div class="shrink"><input v-model="data.checklistRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.checklistDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.checklistReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.checklistSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UICheckList
          v-model="data.checklist1"
          label="デフォルト"
          :required="data.checklistRequired"
          :disabled="data.checklistDisabled"
          :readonly="data.checklistReadonly"
          :size="data.checklistSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
        />
        <div class="border">{{ data.checklist1 }}</div>

        <UICheckList
          v-model="data.checklist2"
          label="装飾"
          :required="data.checklistRequired"
          :disabled="data.checklistDisabled"
          :readonly="data.checklistReadonly"
          :size="data.checklistSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.checklist2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ラジオリスト (UIRadioList)</h2>
          <div class="shrink"><input v-model="data.radiolistRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.radiolistDisabled" type="checkbox"> disabled</div>
          <div class="shrink"><input v-model="data.radiolistReadonly" type="checkbox"> readonly</div>
          <UISelectBox v-model="data.radiolistSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIRadioList
          v-model="data.radiolist1"
          label="デフォルト"
          :required="data.radiolistRequired"
          :disabled="data.radiolistDisabled"
          :readonly="data.radiolistReadonly"
          :size="data.radiolistSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
        />
        <div class="border">{{ data.radiolist1 }}</div>

        <UIRadioList
          v-model="data.radiolist2"
          label="装飾"
          :required="data.radiolistRequired"
          :disabled="data.radiolistDisabled"
          :readonly="data.radiolistReadonly"
          :size="data.radiolistSize"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.radiolist2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ファイル選択 (UIFileUpload)</h2>
          <div class="shrink"><input v-model="data.fileuploadRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.fileuploadDisabled" type="checkbox"> disabled</div>
          <UISelectBox v-model="data.fileuploadSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIFileUpload
          v-model="data.fileupload1"
          label="デフォルト"
          :required="data.fileuploadRequired"
          :disabled="data.fileuploadDisabled"
          :size="data.fileuploadSize"
        />
        <div class="border">{{ data.fileupload1?.name }}</div>

        <UIFileUpload
          v-model="data.fileupload2"
          label="装飾"
          :required="data.fileuploadRequired"
          :disabled="data.fileuploadDisabled"
          :size="data.fileuploadSize"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.fileupload2?.name }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">複数ファイル選択 (UIMultiFileUpload)</h2>
          <div class="shrink"><input v-model="data.multifileuploadRequired" type="checkbox"> required</div>
          <div class="shrink"><input v-model="data.multifileuploadDisabled" type="checkbox"> disabled</div>
          <UISelectBox v-model="data.multifileuploadSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIMultiFileUpload
          v-model="data.multifileupload1"
          label="デフォルト"
          :required="data.multifileuploadRequired"
          :disabled="data.multifileuploadDisabled"
          :size="data.multifileuploadSize"
        />
        <div class="border">{{ data.multifileupload1.map((item: File) => item.name) }}</div>

        <UIMultiFileUpload
          v-model="data.multifileupload2"
          label="装飾"
          :required="data.multifileuploadRequired"
          :disabled="data.multifileuploadDisabled"
          :size="data.multifileuploadSize"
          prefix="("
          suffix=")"
          halign="center"
        />
        <div class="border">{{ data.multifileupload2.map((item: File) => item.name) }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ページング (UIPaginator)</h2>
          <div class="shrink"><input v-model="data.paginatorDisabled" type="checkbox"> disabled</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIPaginator v-model="data.paginator1" :disabled="data.paginatorDisabled" />
        <div class="border">{{ data.paginator1 }}</div>

        <UIPaginator
          v-model="data.paginator2"
          :disabled="data.paginatorDisabled"
          halign="center"
          :page-size="50"
          :total-count="1000"
        />
        <div class="border">{{ data.paginator2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ボタン (UIButton)</h2>
          <input v-model="data.buttonDisabled" type="checkbox"> disabled
          <UISelectBox
            size="small"
            v-model="data.buttonColor"
            :items="[
              { value: 'blue' },
              { value: 'slate' }, { value: 'gray' }, { value: 'zinc' }, { value: 'neutral' }, { value: 'stone' },
              { value: 'red' }, { value: 'orange' }, { value: 'amber' }, { value: 'lime' },
              { value: 'green' }, { value: 'emerald' }, { value: 'teal' },
              { value: 'cyan' }, { value: 'sky' }, { value: 'indigo' },
              { value: 'violet' }, { value: 'purple' }, { value: 'fuchsia' }, { value: 'pink' }, { value: 'rose' },
            ]"
          />
          <UISelectBox v-model="data.buttonSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UIButton
          label="デフォルト"
          :color="(data.buttonColor as any)"
          :disabled="data.buttonDisabled"
          :size="data.buttonSize"
          @click="data.button1++"
        >ボタン</UIButton>
        <div class="border">{{ data.button1 }}</div>

        <UIButton
          label="アウトライン"
          type="outline"
          :color="(data.buttonColor as any)"
          :disabled="data.buttonDisabled"
          :size="data.buttonSize"
          @click="data.button2++"
        >ボタン</UIButton>
        <div class="border">{{ data.button2 }}</div>

        <UIButton
          label="装飾"
          :color="(data.buttonColor as any)"
          :disabled="data.buttonDisabled"
          :size="data.buttonSize"
          prefix="("
          suffix=")"
          halign="center"
          @click="data.button3++"
        >ボタン</UIButton>
        <div class="border">{{ data.button3 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">リンク (UILink)</h2>
          <div class="shrink"><input v-model="data.linkDisabled" type="checkbox"> disabled</div>
          <UISelectBox v-model="data.linkSize" size="small" :items="[{ value: 'large' }, { value: 'small' }]" />
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2 p-6">
        <UILink
          label="デフォルト"
          :disabled="data.linkDisabled"
          :size="data.linkSize"
          @click="data.link1++"
        >リンク</UILink>
        <div class="border">{{ data.link1 }}</div>

        <UILink
          label="装飾"
          :disabled="data.linkDisabled"
          :size="data.linkSize"
          prefix="("
          suffix=")"
          halign="center"
          @click="data.link2++"
        >リンク</UILink>
        <div class="border">{{ data.link2 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">タブ (UITabBar)</h2>
        </div>
      </template>

      <UITabBar :items="[
        { value: 'tab1', text: 'タブ１' },
        { value: 'tab2', text: 'タブ２' },
        { value: 'tab3', text: 'タブ３' }
      ]" />
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">データテーブル (UIDataTable)</h2>
          <div class="shrink"><input v-model="data.dataTableWrap" type="checkbox"> wrap</div>
          <div class="shrink"><input v-model="data.dataTableEllipsis" type="checkbox"> ellipsis</div>
        </div>
      </template>

      <UIDataTable
        :wrap="data.dataTableWrap"
        :ellipsis="data.dataTableEllipsis"
        :items="[
          { key: 'string', label: '文字列', width: '400px' },
          { key: 'date', label: '日付', halign: 'center' },
          { key: 'number', label: '数値', halign: 'end', width: '300px' },
        ]"
        v-model="data.dataTable"
        :footer="onFooter"
      >
        <template v-slot:contentCell="{ item, value }">
          <template v-if="item.key === 'date'">{{
            formatDate(value, 'uuuu/MM/dd')
          }}</template>
        </template>
      </UIDataTable>
      <br />
      <UIDataTable
        style="height: 200px"
        :wrap="data.dataTableWrap"
        :ellipsis="data.dataTableEllipsis"
        :items="[
          { key: 'boolean', label: '', width: '80px' },
          { key: 'string', label: '文字列', width: '400px' },
          { key: 'date', label: '日付', halign: 'center' },
          { key: 'number', label: '数値', halign: 'end', width: '300px' },
        ]"
        v-model="data.dataTable"
        :footer="onFooter"
      >
        <template v-slot:contentCell="{ item, value, rowValues }">
          <template v-if="item.key === 'boolean'">
            <UICheck halign="center" v-model="rowValues[item.key]" />
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
          <h2 class="font-bold grow">メッセージボックス (UIMessageBox)</h2>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-2 p-6">
        <UIMessageBox v-model="data.messageBox1Opend" type="ok" @close="data.messageBox1 = $event">あ</UIMessageBox>
        <UIButton @click="data.messageBox1Opend = true">OK</UIButton>
        <div class="border">{{ data.messageBox1 }}</div>

        <UIMessageBox v-model="data.messageBox2Opend" type="ok-cancel" @close="data.messageBox2 = $event">い</UIMessageBox>
        <UIButton @click="data.messageBox2Opend = true">OK/CANCEL</UIButton>
        <div class="border">{{ data.messageBox2 }}</div>

        <UIMessageBox v-model="data.messageBox3Opened" type="yes-no" @close="data.messageBox3 = $event">う</UIMessageBox>
        <UIButton @click="data.messageBox3Opened = true">YES/NO</UIButton>
        <div class="border">{{ data.messageBox3 }}</div>

        <UIMessageBox v-model="data.messageBox4Opened" type="yes-no-cancel" @close="data.messageBox4 = $event">え</UIMessageBox>
        <UIButton @click="data.messageBox4Opened = true">YES/NO/CANCEL</UIButton>
        <div class="border">{{ data.messageBox4 }}</div>
      </div>
    </UICard>

    <UICard class="mb-4">
      <template #header>
        <div class="flex flex-row justify-items-stretch items-center gap-2 p-3">
          <h2 class="font-bold grow">ローディング表示 (UILoadingIndicator)</h2>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-2 p-6">
        <UIButton @click="indicator.open({ throttle: 1000, duration: 4000 })">Show</UIButton>
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
