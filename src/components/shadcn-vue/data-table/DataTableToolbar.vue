<!-- components/data-table/DataTableToolbar.vue -->
<template>
  <div class="flex flex-wrap items-center gap-2">
    <Input class="w-56" :placeholder="placeholder ?? '搜尋關鍵字...'" :model-value="globalFilter"
      @update:model-value="(v) => (globalFilter = v ?? '')" />

    <!-- Faceted Filters（每個欄位一顆過濾器） -->
    <DataTableFacetedFilter v-for="f in facetedFilters" :key="f.columnId" :table="table" :column-id="f.columnId"
      :title="f.title" :options="f.options" />

    <Button v-if="isFiltered" variant="ghost" @click="resetFilters">
      清除篩選
    </Button>

    <!-- 欄位可見性 -->
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" class="gap-2 ml-auto">
          <Columns class="size-4" /> 欄位
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" class="w-auto max-h-72 overflow-auto p-1">
        <PopoverCheckboxItem
          v-for="col in table.getAllLeafColumns().filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())"
          :key="col.id" :model-value="col.getIsVisible()"
          @update:model-value="(value: any) => col.toggleVisibility(!!value)">
          {{ typeof col.columnDef.header === 'function' ? col.id : col.columnDef.header ?? col.id }}
        </PopoverCheckboxItem>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Table } from '@tanstack/vue-table'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverCheckboxItem,
} from '#/components/ui/popover'
import { Columns } from 'lucide-vue-next'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'


type Props = {
  table: Table<any>
  placeholder?: string
  /** facetedFilters: key 對應 columnId, options 為可選值陣列 */
  facetedFilters?: Array<{
    columnId: string
    title: string
    options: Array<{ label: string; value: string; icon?: any }>
  }>
}
const props = defineProps<Props>()

const globalFilter = computed({
  get: () => props.table.getState().globalFilter ?? '',
  set: (v: string) => props.table.setGlobalFilter(v),
})

const isFiltered = computed(() => {
  const s = props.table.getState()
  return (s.globalFilter && String(s.globalFilter).length > 0) || (s.columnFilters?.length ?? 0) > 0
})

const resetFilters = () => {
  props.table.resetColumnFilters()
  props.table.setGlobalFilter('')
}
</script>
