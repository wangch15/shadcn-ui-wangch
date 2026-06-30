// components/data-table/useDataTable.ts
import { ref, computed } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type ColumnOrderState,
  type Table,
} from '@tanstack/vue-table'
import type { DataTableHookOptions, RowKey } from './types'
import { fuzzyFilter, fuzzySort, multiSelectFilter, dateTimeSort } from './utils'

export function useDataTable<TData>(opts: DataTableHookOptions<TData>) {
  const dataRef = ref<TData[]>(opts.data ?? [])
  const columnsRef = ref(opts.columns ?? [])

  // ----- 狀態 -----
  const sorting = ref<SortingState>([])
  const columnFilters = ref<ColumnFiltersState>([])
  const globalFilter = ref<string>('')
  // 初始化所有欄位為可見
  const columnVisibility = ref<VisibilityState>({})
  const rowSelection = ref<RowSelectionState>({})
  const columnOrder = ref<ColumnOrderState>([])

  const pageIndex = ref(0)
  const pageSize = ref(opts.initialState?.pageSize ?? 20)

  const getRowKey = (row: TData): RowKey => {
    const rk = opts.rowKey ?? ('id' as keyof TData)
    return typeof rk === 'function' ? rk(row) : (row as any)[rk]
  }

  const table = useVueTable<TData>({
    get data() {
      return dataRef.value as TData[]
    },
    get columns() {
      return columnsRef.value as any
    },

    // ----- 過濾/排序/分頁 -----
    filterFns: {
      // id 對應到欄位的 columnDef.filterFn
      fuzzy: fuzzyFilter,
      multi: multiSelectFilter,
    },
    globalFilterFn: fuzzyFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // ✅ Faceted Filters 必須加的兩個 row model
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // Row Selection
    enableRowSelection: true,
    getRowId: (original) => String(getRowKey(original)),

    // ----- 受控狀態 -----
    state: {
      get sorting() { return sorting.value },
      get columnFilters() { return columnFilters.value },
      get globalFilter() { return globalFilter.value },
      get columnVisibility() { return columnVisibility.value },
      get rowSelection() { return rowSelection.value },
      get columnOrder() { return columnOrder.value },
      get pagination() { return { pageIndex: pageIndex.value, pageSize: pageSize.value } },
    },

    // ----- 更新器 -----
    onSortingChange: (updater) => {
      sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    },
    onColumnFiltersChange: (updater) => {
      columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
    },
    onGlobalFilterChange: (updater) => {
      globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
    onColumnOrderChange: (updater) => {
      columnOrder.value = typeof updater === 'function' ? updater(columnOrder.value) : updater
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: pageIndex.value, pageSize: pageSize.value }
      const next = typeof updater === 'function' ? updater(current) : updater
      pageIndex.value = next.pageIndex
      pageSize.value = next.pageSize
    },

    // 自訂排序函數（欄位可用 sortingFn: 'fuzzy' | 'datetime'）
    sortingFns: { fuzzy: fuzzySort, datetime: dateTimeSort },
  })

  // 當前頁 rows（分頁後的）
  const pageRows = computed(() => table.getRowModel().rows)

  // ✅ 表頭「本頁全選 / 半選」—— v-model 綁到下方的 checkbox 用
  const isAllPageSelected = computed(() => table.getIsAllPageRowsSelected())
  const isSomePageSelected = computed(() => table.getIsSomePageRowsSelected())
  const toggleAllPage = (v?: boolean) => table.toggleAllPageRowsSelected(v)

  // 導出
  return {
    table: table as Table<TData>,
    // 狀態
    sorting,
    columnFilters,
    globalFilter,
    columnVisibility,
    rowSelection,   // ✅ v8 正確的 selection 狀態名稱
    columnOrder,
    pageIndex,
    pageSize,
    // 資料
    setData: (rows: TData[]) => (dataRef.value = rows),
    setColumns: (cols: typeof columnsRef.value) => (columnsRef.value = cols as any),
    // 介面
    pageRows,
    isAllPageSelected,
    isSomePageSelected,
    toggleAllPage,
  }
}
