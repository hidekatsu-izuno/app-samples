<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns?: number,
  wrap?: boolean,
  ellipsis?: boolean,
  tabindex?: number,
  fix?: { top?: number, bottom?: number, left?: number, right?: number },
  items?: Array<{
    key: string,
    width?: string,
    label?: string,
    halign?: "start" | "center" | "end",
    syncSelector?: boolean,
    format?: (value: any) => string
  }>,
  modelValue?: Record<string, any>[],
  footer?: (modelValue: Record<string, any>[], items: Record<string, any>) => Record<string, any>,
}>(), {
  wrap: false,
  ellipsis: false,
  items: () => [],
  modelValue: () => [],
})

const data = reactive({
  focused: false,
  widths: [] as (string | undefined)[],
  footerRecord: undefined as Record<string, any> | undefined,
  colResize: false,
  colGroups: [] as ({ area: string, start: number, items? : typeof props.items })[],
  rowGroups: [] as ({ area: string, start: number, records?: Record<string, any>[] })[],
})

const elRef = ref()

watch(() => [props.modelValue, props.items, props.wrap, props.fix], () => {
  data.widths = props.items.map(item => item.width)
  data.footerRecord = props.footer?.(props.modelValue, props.items)

  const left = (props.fix?.left != null && props.fix.left > 0 && !props.wrap)
    ? props.fix.left
    : 0
  const right = (props.fix?.right != null && props.fix.right > 0 && !props.wrap)
    ? Math.min(props.fix.right, props.items.length - left)
    : 0
  data.colGroups = []
  if (left > 0) {
    data.colGroups.push({
      area: "left",
      start: 0,
      items: props.items.slice(0, left),
    })
  }
  data.colGroups.push({
    area: "center",
    start: left,
    items: left > 0 || right > 0 ? props.items.slice(left, props.items.length - right) : props.items,
  })
  if (right > 0) {
    data.colGroups.push({
      area: "right",
      start: props.items.length - right,
      items: props.items.slice(props.items.length - right),
    })
  }

  const top = (props.fix?.top != null && props.fix.top > 0 && !props.wrap)
    ? props.fix.top
    : 0
  const bottom = (props.fix?.bottom != null && props.fix.bottom > 0 && !props.wrap)
    ? Math.min(props.fix.bottom, props.modelValue.length - top)
    : 0
  data.rowGroups = [
    {
      area: "top",
      start: 0,
      records: top > 0 ? props.modelValue.slice(0, top) : undefined,
    },
    {
      area: "center",
      start: top,
      records: top > 0 || bottom > 0 ? props.modelValue.slice(top, props.modelValue.length - bottom) : props.modelValue,
    },
    {
      area: "bottom",
      start: props.modelValue.length - bottom,
      records: bottom > 0 ? props.modelValue.slice(props.modelValue.length - bottom) : undefined,
    },
  ]
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
    <div
      v-for="(rowGroup, rowGroupIndex) in data.rowGroups"
      :key="rowGroupIndex"
      class="UIDataTable-RowGroup"
      :data-viewarea="rowGroup.area"
    >
      <div
        v-if="rowGroup.area === 'top'"
        class="UIDataTable-Header"
      >
        <div class="UIDataTable-HeaderRow">
          <div
            v-for="(colGroup, colGroupIndex) in data.colGroups"
            :key="colGroupIndex"
            class="UIDataTable-ColGroup"
            :data-viewarea="colGroup.area"
          >
            <template v-for="(item, colIndex) in colGroup.items" :key="colIndex">
              <div
                class="UIDataTable-HeaderCell"
                :data-col="colGroup.start + colIndex"
                :data-key="item.key"
                data-halign="center"
                :data-width="data.widths[colGroup.start + colIndex] == null && props.wrap ? 'fill' : undefined"
                :style="{
                  width: data.widths[colGroup.start + colIndex] ?? '100px',
                }"
                @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
                @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
              ><slot
                name="headerCell"
                :item="item"
                :value="item.label || item.key"
              ><div class="UIDataTable-CellValue">{{
                item.label ?? item.key
              }}</div></slot></div>
              <div
                class="UIDataTable-HeaderSeparator"
                @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
              />
            </template>
          </div>
        </div>
      </div>
      <div class="UIDataTable-Content">
        <div
          v-for="(record, rowIndex) in rowGroup.records"
          :key="rowGroup.start + rowIndex"
          class="UIDataTable-ContentRow"
        >
          <div
            v-for="(colGroup, colGroupIndex) in data.colGroups"
            :key="colGroupIndex"
            class="UIDataTable-ColGroup"
            :data-viewarea="colGroup.area"
          >
            <template v-for="(item, colIndex) in colGroup.items" :key="colIndex">
              <div
                class="UIDataTable-ContentCell"
                :data-col="colGroup.start + colIndex"
                :data-row="rowGroup.start + rowIndex"
                :data-key="item.key"
                :data-syncselector="item.syncSelector || undefined"
                :data-halign="item.halign"
                :data-width="data.widths[colGroup.start + colIndex] == null && props.wrap ? 'fill' : undefined"
                :style="{
                  width: data.widths[colGroup.start + colIndex] ?? '100px',
                }"
                @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
                @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
              ><slot
                name="contentCell"
                :record="record"
                :row-index="rowGroup.start + rowIndex"
                :col-index="colGroup.start + colIndex"
                :item="item"
                :value="item.format ? item.format(record?.[item.key]) : record?.[item.key]"
              ><div class="UIDataTable-CellValue">{{
                item.format ? item.format(record?.[item.key]) : record?.[item.key]
              }}</div></slot></div>
              <div
                class="UIDataTable-ContentSeparator"
                @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
              />
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="rowGroup.area === 'bottom' && data.footerRecord"
        class="UIDataTable-Footer"
      >
        <div class="UIDataTable-FooterRow">
          <div
            v-for="(colGroup, colGroupIndex) in data.colGroups"
            :key="colGroupIndex"
            class="UIDataTable-ColGroup"
            :data-viewarea="colGroup.area"
          >
            <template v-for="(item, colIndex) in colGroup.items" :key="colIndex">
              <div
                class="UIDataTable-FooterCell"
                :data-col="colGroup.start + colIndex"
                :data-key="item.key"
                :data-halign="item.halign"
                :data-width="data.widths[colGroup.start + colIndex] == null && props.wrap ? 'fill' : undefined"
                :style="{
                  width: data.widths[colGroup.start + colIndex] ?? '100px',
                }"
                @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
                @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
              ><slot
                name="footerCell"
                :record="data.footerRecord"
                :item="item"
                :value="item.format ? item.format(data.footerRecord[item.key]) : data.footerRecord[item.key]"
              ><div class="UIDataTable-CellValue">{{
                item.format ? item.format(data.footerRecord?.[item.key]) : data.footerRecord?.[item.key]
              }}</div></slot></div>
              <div
                class="UIDataTable-FooterSeparator"
                @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.UIDataTable {
  @apply flex flex-col
    overflow-auto;
}

.UIDataTable-Header,
.UIDataTable-Content,
.UIDataTable-Footer {
  @apply min-w-fit;
}

.UIDataTable-RowGroup[data-viewarea="top"] {
  @apply sticky top-0
    z-[2];
}

.UIDataTable-RowGroup[data-viewarea="center"],
.UIDataTable-Content {
  @apply grow;
}

.UIDataTable-RowGroup[data-viewarea="bottom"] {
  @apply sticky bottom-0
    -mt-[1px]
    z-[2];

  .UIDataTable-Content {
    @apply border-t border-gray-300;
  }
}

.UIDataTable-ColGroup[data-viewarea="left"] {
  @apply sticky left-0
    z-[3];
}

.UIDataTable-ColGroup[data-viewarea="right"] {
  @apply sticky right-0
    z-[3];
}

.UIDataTable-Footer {
  @apply -mt-[1px];
}

.UIDataTable-HeaderRow,
.UIDataTable-ContentRow,
.UIDataTable-FooterRow {
  @apply flex flex-row
    pr-4;
}

.UIDataTable-HeaderRow {
  @apply border-b border-gray-300
    bg-slate-50
    font-bold;

  .UIDataTable-ColGroup[data-viewarea="left"] {
    @apply bg-slate-50;
  }

  .UIDataTable-ColGroup[data-viewarea="right"] {
    @apply border-l border-gray-300
      bg-slate-50;
  }
}

.UIDataTable-ContentRow {
  @apply border-b border-gray-300
    bg-white;

  .UIDataTable-ColGroup[data-viewarea="left"] {
    @apply bg-white;
  }

  .UIDataTable-ColGroup[data-viewarea="right"] {
    @apply border-l border-gray-300
      bg-white;
  }
}

.UIDataTable-FooterRow {
  @apply border-t border-gray-300
    bg-slate-50;

  .UIDataTable-ColGroup[data-viewarea="left"] {
    @apply bg-slate-50;
  }

  .UIDataTable-ColGroup[data-viewarea="right"] {
    @apply border-l border-gray-300
      bg-slate-50;
  }
}

.UIDataTable-ColGroup {
  @apply flex flex-row items-stretch
    min-w-fit;
}

.UIDataTable-HeaderCell,
.UIDataTable-ContentCell,
.UIDataTable-FooterCell {
  @apply flex-none
    flex flex-row items-center
    overflow-hidden;
}

.UIDataTable-CellValue {
  @apply px-[0.25em] py-[0.125em]
    min-h-[calc(1rem+0.125em*2)]
    whitespace-pre-wrap
    break-words;
}

.UIDataTable-HeaderSeparator,
.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply flex-[0_0_5px]
    mx-[-2px]
    px-[2px]
    bg-slate-300
    bg-clip-content
    cursor-col-resize select-none
    z-[1];
}

.UIDataTable[data-colresize="true"] {
  @apply cursor-col-resize;
}

.UIDataTable-ContentRow:has([data-syncselector="true"] input:checked) {
  @apply bg-blue-100;
}

.UIDataTable-HeaderCell[data-width="fill"],
.UIDataTable-ContentCell[data-width="fill"],
.UIDataTable-FooterCell[data-width="fill"] {
  @apply flex-1;
}

.UIDataTable-HeaderCell[data-halign="start"],
.UIDataTable-ContentCell[data-halign="start"],
.UIDataTable-FooterCell[data-halign="start"] {
  @apply justify-start;
}

.UIDataTable-HeaderCell[data-halign="center"],
.UIDataTable-ContentCell[data-halign="center"],
.UIDataTable-FooterCell[data-halign="center"] {
  @apply justify-center;
}

.UIDataTable-HeaderCell[data-halign="end"],
.UIDataTable-ContentCell[data-halign="end"],
.UIDataTable-FooterCell[data-halign="end"] {
  @apply justify-end;
}

.UIDataTable[data-wrap="true"] {
  @apply overflow-x-hidden;

  .UIDataTable-HeaderRow,
  .UIDataTable-ContentRow,
  .UIDataTable-FooterRow {
    @apply mr-[-2px]
      pr-0;
  }

  .UIDataTable-ColGroup {
    @apply flex-auto flex-wrap;
  }

  .UIDataTable-HeaderRow,
  .UIDataTable-ContentRow {
    @apply border-b-0
      mb-[-1px];
  }

  .UIDataTable-FooterRow {
    @apply border-t-0;
  }

  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply flex-auto;
  }

  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell {
    @apply border-b border-slate-300;
  }

  .UIDataTable-FooterCell {
    @apply border-t border-slate-300;
  }

  .UIDataTable-HeaderSeparator,
  .UIDataTable-ContentSeparator,
  .UIDataTable-FooterSeparator {
    @apply cursor-default;
  }
}

.UIDataTable[data-ellipsis="true"] {
  .UIDataTable-CellValue {
    @apply break-normal truncate;
  }
}
</style>
