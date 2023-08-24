<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: "error" | "warn" | "info",
  title?: string,
  buttons?: ("ok" | "yes" | "no" | "cancel")[],
  modaless?: boolean,
}>(), {
  type: "error",
  title: undefined,
  buttons: () => ["ok"],
  modaless: false,
})

const data = reactive({
  message: undefined as string | undefined,
  opened: false,
})

const emits = defineEmits<{
  (event: "close", value?: "ok" | "yes" | "no" | "cancel"): void,
}>()

defineExpose({
  open,
  close,
})

function open(message?: string) {
  data.message = message
  data.opened = true
}

function close(result?: "ok" | "yes" | "no" | "cancel") {
  data.opened = false
  data.message = undefined
  emits("close", result)
}
</script>

<template>
  <UIDialog
    v-model="data.opened"
    class="UIAlert"
    role="alertdialog"
    :modaless="props.modaless"
    :data-type="props.type"
  >
    <div class="UIAlert-Header">
      <UIIcon
        :name="(
          props.type === 'info' ? 'information-outline' :
          props.type === 'warn' ? 'alert-outline' :
          'alert-circle-outline'
        )"
        class="UIAlert-Icon"
      />
      <div class="UIAlert-Title">{{
        props.title ? props.title :
        props.type === 'info' ? '情報' :
        props.type === 'warn' ? '警告' :
        'エラー'
      }}</div>
      <button
        type="button"
        class="UIAlert-CloseButton"
        @click="close()"
      >
        <UIIcon name="close-circle" />
      </button>
    </div>
    <div class="UIAlert-Content">
      <div class="UIAlert-Text">
        {{ data.message }}
        <slot />
      </div>
    </div>
    <div class="UIAlert-Footer">
      <UIButton
        v-for="(button, index) in props.buttons"
        :key="index"
        class="UIAlert-Button"
        :data-button="button"
        :autofocus="index === 0"
        :color="index === 0 ? (
          props.type === 'info' ? 'blue' :
          props.type === 'warn' ? 'yellow' :
          'red'
        ) : 'neutral'"
        @click="close(button)"
      />
    </div>
  </UIDialog>
</template>

<style>
.UIAlert {
  @apply max-w-[640px] w-screen;
}

.UIAlert-Header {
  @apply flex flex-row items-center gap-2
    px-2 py-2;
}

.UIAlert-Title {
  @apply grow
    text-xl font-bold;
}

.UIAlert-CloseButton {
  @apply self-start
    flex items-center justify-center
    rounded-lg
    w-8 h-8
    bg-transparent hover:bg-gray-200
    text-gray-400 hover:text-gray-900;

  .UIIcon {
    @apply text-3xl;
  }
}

.UIAlert-Content {
  @apply flex flex-row items-center justify-center gap-2
    px-12 py-2;
}

.UIAlert-Text {
  @apply text-lg font-normal text-gray-900;
}

.UIAlert-Footer {
  @apply flex justify-center gap-2
    px-4 py-4;
}

.UIAlert[data-type="error"] {
  .UIAlert-Icon {
    @apply text-red-500 text-5xl;
  }
}

.UIAlert[data-type="warn"] {
  .UIAlert-Icon {
    @apply text-yellow-400 text-5xl;
  }
}

.UIAlert[data-type="info"] {
  .UIAlert-Icon {
    @apply text-blue-500 text-5xl;
  }
}

.UIAlert-Button[data-button="ok"] {
  .UIButton-Input::before {
    content: "OK";
  }
}

.UIAlert-Button[data-button="yes"] {
  .UIButton-Input::before {
    content: "Yes";
  }
}

.UIAlert-Button[data-button="no"] {
  .UIButton-Input::before {
    content: "No";
  }
}

.UIAlert-Button[data-button="cancel"] {
  .UIButton-Input::before {
    content: "キャンセル";
  }
}
</style>
