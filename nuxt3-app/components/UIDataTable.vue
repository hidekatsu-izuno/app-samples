<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns?: number,
  wrap?: boolean,
  ellipsis?: boolean,
  tabindex?: number,
  items?: Array<{
    key: string,
    width?: string,
    label?: string,
    halign?: "start" | "center" | "end",
  }>,
  modelValue?: Array<Record<string, any>>,
  footer?: (modelValue:  Array<Record<string, any>>, items: Record<string, any>) => Record<string, any>,
}>(), {
  wrap: false,
  ellipsis: false,
  items: () => [],
  modelValue: () => [],
})

const data = reactive({
  focused: false,
  widths: [] as Array<string | undefined>,
  footerValues: undefined as Record<string, any> | undefined,
  colResize: false,
})

const elRef = ref()

watch(() => props.modelValue, () => {
  data.footerValues = props.footer?.(props.modelValue, props.items)
}, { immediate: true })

watch(() => props.items, () => {
  data.widths = props.items.map(item => item.width)
  data.footerValues = props.footer?.(props.modelValue, props.items)
}, { immediate: true })

function onContentCellMouseEnter(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.scrollWidth > target.offsetWidth) {
    target.setAttribute("title", target.innerText)
  }
}

function onContentCellMouseLeave(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.hasAttribute("title")) {
    target.removeAttribute("title")
  }
}

function onSeparatorMouseDown(event: MouseEvent) {
  const target = event.target as HTMLElement
  const parent = target.closest(".UIDataTable")
  const prev = target.previousElementSibling as HTMLElement | null
  if (!parent || !prev) {
    return
  }

  const col = Number.parseInt(prev?.dataset.col || "", 10)
  if (!Number.isInteger(col)) {
    return
  }

  data.colResize = true

  const width = prev.offsetWidth
  const startX = event.pageX

  const move = (event: MouseEvent) => {
    data.widths[col] = `${width + (event.pageX - startX)}px`
  }

  const finish = (event: MouseEvent) => {
    move(event)
    data.colResize = false

    elRef.value.removeEventListener("mousemove", move)
    elRef.value.removeEventListener("mouseup", finish)
    elRef.value.removeEventListener("mouseleave", finish)
  }

  elRef.value.addEventListener("mousemove", move)
  elRef.value.addEventListener("mouseup", finish)
  elRef.value.addEventListener("mouseleave", finish)
}
</script>

<template>
  <div
    ref="elRef"
    class="UIDataTable"
    :data-columns="props.items.length"
    :data-wrap="props.wrap || undefined"
    :data-ellipsis="props.ellipsis || undefined"
    :data-colresize="data.colResize || undefined"
  >
    <div class="UIDataTable-Header">
      <div class="UIDataTable-HeaderRow">
        <template v-for="(item, colIndex) in items">
          <div
            class="UIDataTable-HeaderCell"
            :data-col="colIndex"
            :data-halign="item.halign"
            :data-width="data.widths[colIndex] == null && props.wrap ? 'fill' : undefined"
            :style="{
              width: data.widths[colIndex] ?? '100px',
            }"
            @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
            @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
          ><slot
              name="footerCell"
              :item="item"
              :value="item.label || item.key"
          >{{ item.label ?? item.key }}</slot></div>
          <div
            class="UIDataTable-HeaderSeparator"
            @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
          ></div>
        </template>
      </div>
    </div>
    <div class="UIDataTable-Content">
      <div
        class="UIDataTable-ContentRow"
        v-for="(rowValues, rowIndex) in props.modelValue"
      >
        <template v-for="(item, colIndex) in items">
          <div
            class="UIDataTable-ContentCell"
            :data-col="colIndex"
            :data-row="rowIndex"
            :data-halign="item.halign"
            :data-width="data.widths[colIndex] == null && props.wrap ? 'fill' : undefined"
            :style="{
              width: data.widths[colIndex] ?? '100px',
            }"
            @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
            @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"

          ><slot
            name="contentCell"
            :rowValues="rowValues"
            :rowIndex="rowIndex"
            :colIndex="colIndex"
            :item="item"
            :value="rowValues?.[item.key]"
          >{{ rowValues?.[item.key] }}</slot></div>
          <div
            class="UIDataTable-ContentSeparator"
            @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
          ></div>
        </template>
      </div>
    </div>
    <div class="UIDataTable-Footer" v-if="data.footerValues">
      <div class="UIDataTable-FooterRow">
        <template v-for="(item, colIndex) in items">
          <div
            class="UIDataTable-FooterCell"
            :data-col="colIndex"
            :data-halign="item.halign"
            :data-width="data.widths[colIndex] == null && props.wrap ? 'fill' : undefined"
            :style="{
              width: data.widths[colIndex] ?? '100px',
            }"
            @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
            @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
          ><slot
              name="footerCell"
              :rowValues="data.footerValues"
              :item="item"
              :value="data.footerValues[item.key]"
          >{{ data.footerValues[item.key] }}</slot></div>
          <div
            class="UIDataTable-FooterSeparator"
            @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.UIDataTable {
  @apply overflow-auto;
}

.UIDataTable-Header,
.UIDataTable-Content,
.UIDataTable-Footer {
  @apply min-w-fit;
}

.UIDataTable-Header {
  @apply sticky top-0 left-0 right-0;
}

.UIDataTable-Footer {
  @apply sticky bottom-0 left-0 right-0;
}

.UIDataTable-HeaderRow,
.UIDataTable-ContentRow,
.UIDataTable-FooterRow {
  @apply flex flex-row items-stretch
    min-w-fit
    pr-4;
}

.UIDataTable-HeaderRow {
  @apply border-b border-gray-300
    bg-slate-50
    font-bold;
}

.UIDataTable-ContentRow {
  @apply border-b last:border-b-0 border-gray-300
    bg-white;
}

.UIDataTable-FooterRow {
  @apply border-t border-gray-300
    bg-slate-50;
}

.UIDataTable-HeaderCell,
.UIDataTable-ContentCell,
.UIDataTable-FooterCell {
  @apply flex-none
    align-middle
    px-2 py-1
    min-h-[calc(1rem+8px)]
    whitespace-pre-wrap;
}

.UIDataTable-HeaderSeparator,
.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply flex-[0_0_5px]
    mx-[-2px]
    px-[2px]
    bg-clip-content
    cursor-col-resize select-none
    z-[1];
}

.UIDataTable-HeaderSeparator {
  @apply bg-slate-300;
}

.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply bg-slate-100;
}

.UIDataTable[data-colresize="true"] {
  @apply cursor-col-resize;
}

.UIDataTable-HeaderCell[data-width="fill"],
.UIDataTable-ContentCell[data-width="fill"],
.UIDataTable-FooterCell[data-width="fill"] {
  @apply flex-1;
}

.UIDataTable-HeaderCell[data-halign="center"],
.UIDataTable-ContentCell[data-halign="center"],
.UIDataTable-FooterCell[data-halign="center"] {
  @apply text-center;
}

.UIDataTable-HeaderCell[data-halign="end"],
.UIDataTable-ContentCell[data-halign="end"],
.UIDataTable-FooterCell[data-halign="end"] {
  @apply text-right;
}

.UIDataTable[data-wrap="true"] {
  @apply overflow-x-hidden;

  .UIDataTable-HeaderRow,
  .UIDataTable-ContentRow,
  .UIDataTable-FooterRow {
    @apply flex-wrap pr-0;
  }

  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply flex-auto;
  }

  .UIDataTable-HeaderSeparator,
  .UIDataTable-ContentSeparator,
  .UIDataTable-FooterSeparator {
    @apply cursor-default;
  }
}

.UIDataTable[data-ellipsis="true"] {
  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply truncate;
  }
}

.UIDataTable:not([data-ellipsis="true"]) {
  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply break-words;
  }
}
</style>
