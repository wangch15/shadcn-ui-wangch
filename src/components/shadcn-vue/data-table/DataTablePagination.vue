<!-- components/data-table/DataTablePagination.vue -->
<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { Button } from '../../ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '../../ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

defineProps<{ table: Table<any> }>()
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div class="text-sm text-muted-foreground">
      第 {{ table.getState().pagination.pageIndex + 1 }} / {{ Math.max(1, table.getPageCount()) }} 頁
      （共 {{ table.getRowCount() }} 筆）
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm">每頁</span>
      <Select :model-value="String(table.getState().pagination.pageSize)"
        @update:model-value="(v) => table.setPageSize(Number(v))">
        <SelectTrigger class="w-22">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>

      <div class="flex items-center gap-1">
        <Button variant="outline" size="icon" :disabled="!table.getCanPreviousPage()"
          @click="() => table.setPageIndex(0)">
          <ChevronsLeft class="size-4" />
        </Button>
        <Button variant="outline" size="icon" :disabled="!table.getCanPreviousPage()"
          @click="() => table.previousPage()">
          <ChevronLeft class="size-4" />
        </Button>
        <Button variant="outline" size="icon" :disabled="!table.getCanNextPage()" @click="() => table.nextPage()">
          <ChevronRight class="size-4" />
        </Button>
        <Button variant="outline" size="icon" :disabled="!table.getCanNextPage()"
          @click="() => table.setPageIndex(table.getPageCount() - 1)">
          <ChevronsRight class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
