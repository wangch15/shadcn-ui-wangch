# Data Table 組件

基於 `@tanstack/vue-table` 的高性能資料表格組件，具備完整的排序、篩選、分頁和選取功能。

## 功能特色

- ✅ **排序**: 點擊欄位標題進行升序/降序排序
- ✅ **全域搜尋**: 支援模糊搜尋所有欄位
- ✅ **欄位篩選**: 支援多選下拉篩選器
- ✅ **分頁**: 完整的分頁控制器
- ✅ **行選取**: 支援單選/多選/全選（可選擇啟用）
- ✅ **欄位可見性**: 動態顯示/隱藏欄位
- ✅ **響應式設計**: 適配各種螢幕尺寸
- ✅ **TypeScript 支援**: 完整的型別定義

## 安裝與導入

```vue
<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/data-table'
</script>
```

## 基本使用

### 1. 定義資料型別

```typescript
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
}
```

### 2. 定義欄位配置

```typescript
const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { widthClass: 'w-20' }
  },
  {
    accessorKey: 'name',
    header: '姓名',
    cell: ({ row }) => {
      return h('div', { class: 'font-medium' }, row.getValue('name'))
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: { cellClass: 'text-muted-foreground' }
  },
  {
    accessorKey: 'role',
    header: '角色',
    filterFn: 'includesString'
  },
  {
    accessorKey: 'status',
    header: '狀態',
    cell: ({ row }) => {
      const status = row.getValue('status')
      return h('span', {
        class: status === 'active' ? 'text-green-600' : 'text-red-600'
      }, status === 'active' ? '啟用' : '停用')
    }
  },
  {
    accessorKey: 'createdAt',
    header: '建立時間',
    sortingFn: 'datetime',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString('zh-TW')
    }
  }
]
```

### 3. 準備資料

```typescript
const users = ref<User[]>([
  {
    id: 1,
    name: '張三',
    email: 'zhang@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01'
  },
  // ... 更多資料
])
```

### 4. 在模板中使用

```vue
<template>
  <DataTable
    :data="users"
    :columns="columns"
    :page-size="10"
    :faceted-filters="facetedFilters"
    :row-key="'id'"
    :use-checkbox="true"
  />
</template>

<script setup lang="ts">
const facetedFilters = [
  {
    columnId: 'role',
    title: '角色',
    options: [
      { label: '管理員', value: 'admin' },
      { label: '使用者', value: 'user' },
      { label: '訪客', value: 'guest' }
    ]
  },
  {
    columnId: 'status',
    title: '狀態',
    options: [
      { label: '啟用', value: 'active' },
      { label: '停用', value: 'inactive' }
    ]
  }
]
</script>
```

## API 參考

### DataTable Props

| 屬性 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `data` | `T[]` | `[]` | 表格資料陣列 |
| `columns` | `ColumnDef<T, any>[]` | `[]` | 欄位定義陣列 |
| `rowKey` | `keyof T \| ((row: T) => string \| number)` | `'id'` | 行的唯一識別鍵 |
| `pageSize` | `number` | `20` | 每頁顯示筆數 |
| `useCheckbox` | `boolean` | `false` | 是否啟用行選擇功能 |
| `facetedFilters` | `FacetedFilter[]` | `undefined` | 欄位篩選器配置 |

### ColumnDef 完整 API

每個欄位定義 (`ColumnDef`) 支援以下屬性：

#### 基本屬性

```typescript
interface ColumnDef<TData, TValue> {
  // === 必要屬性 ===
  id?: string                    // 欄位唯一識別符，預設使用 accessorKey
  accessorKey?: keyof TData      // 資料欄位名稱
  accessorFn?: (row: TData) => TValue  // 自訂資料存取函數

  // === 顯示相關 ===
  header?: string | ComponentType | ((context: HeaderContext) => ReactNode)
  cell?: ComponentType | ((context: CellContext) => ReactNode)
  footer?: ComponentType | ((context: FooterContext) => ReactNode)

  // === 功能控制 ===
  enableSorting?: boolean        // 是否啟用排序，預設 true
  enableColumnFilter?: boolean   // 是否啟用欄位篩選，預設 true
  enableGlobalFilter?: boolean   // 是否參與全域搜尋，預設 true
  enableHiding?: boolean         // 是否可隱藏欄位，預設 true
  enableResizing?: boolean       // 是否可調整寬度，預設 true
  enablePinning?: boolean        // 是否可固定欄位，預設 true

  // === 排序相關 ===
  sortingFn?: string | SortingFn // 自訂排序函數
  sortDescFirst?: boolean        // 是否預設降序排序
  invertSorting?: boolean        // 是否反轉排序

  // === 篩選相關 ===
  filterFn?: string | FilterFn   // 自訂篩選函數
  
  // === 尺寸相關 ===
  size?: number                  // 欄位寬度（像素）
  minSize?: number              // 最小寬度
  maxSize?: number              // 最大寬度

  // === 自訂屬性 ===
  meta?: ExtraCellMeta          // 擴充元資料
}
```

#### 擴充元資料 (meta)

```typescript
interface ExtraCellMeta {
  widthClass?: string           // 欄位寬度 CSS 類別，如 'w-24'
  cellClass?: string           // 儲存格 CSS 類別，如 'text-right'
}
```

#### 常用配置範例

```typescript
const columns: ColumnDef<User, any>[] = [
  // 1. 基本文字欄位
  {
    accessorKey: 'name',
    header: '姓名',
    enableSorting: true,
    meta: { widthClass: 'w-32' }
  },

  // 2. 自訂顯示格式
  {
    accessorKey: 'createdAt',
    header: '建立時間',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return new Date(date).toLocaleDateString('zh-TW')
    },
    sortingFn: 'datetime'
  },

  // 3. 數值欄位（右對齊）
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, '金額'),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return h('div', { 
        class: 'text-right font-mono' 
      }, `$${amount.toLocaleString()}`)
    },
    meta: { cellClass: 'text-right' }
  },

  // 4. 狀態標籤
  {
    accessorKey: 'status',
    header: '狀態',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const config = {
        active: { label: '啟用', class: 'bg-green-100 text-green-800' },
        inactive: { label: '停用', class: 'bg-red-100 text-red-800' }
      }
      return h(Badge, { 
        class: config[status]?.class 
      }, config[status]?.label)
    },
    filterFn: 'multi' // 支援多選篩選
  },

  // 5. 操作欄位
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(Button, {
          size: 'sm',
          variant: 'outline',
          onClick: () => handleEdit(row.original)
        }, '編輯'),
        h(Button, {
          size: 'sm',
          variant: 'destructive',
          onClick: () => handleDelete(row.original.id)
        }, '刪除')
      ])
    },
    enableSorting: false,
    enableHiding: false,
    meta: { widthClass: 'w-32' }
  },

  // 6. 複合顯示（頭像+名稱）
  {
    id: 'user',
    header: '使用者',
    accessorFn: row => row, // 傳遞整個 row
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h('img', {
          src: user.avatar,
          alt: user.name,
          class: 'w-8 h-8 rounded-full'
        }),
        h('div', [
          h('div', { class: 'font-medium' }, user.name),
          h('div', { class: 'text-sm text-gray-500' }, user.email)
        ])
      ])
    },
    enableSorting: false
  }
]
```

#### 內建排序函數

組件提供以下內建排序函數，可在 `sortingFn` 中使用：

```typescript
// 使用方式
{
  accessorKey: 'createdAt',
  header: '建立時間',
  sortingFn: 'datetime'  // 使用內建的日期時間排序
}
```

| 函數名稱 | 說明 | 適用資料類型 |
|---------|------|-------------|
| `'datetime'` | 日期時間排序 | Date, ISO 字串, 時間戳 |
| `'fuzzy'` | 模糊排序 | 字串 |
| `'alphanumeric'` | 字母數字排序 | 字串、數字混合 |
| `'text'` | 純文字排序 | 字串 |
| `'basic'` | 基本排序 | 數字、字串 |

#### 內建篩選函數

組件提供以下內建篩選函數，可在 `filterFn` 中使用：

```typescript
// 使用方式
{
  accessorKey: 'status',
  header: '狀態',
  filterFn: 'multi'  // 支援多選篩選
}
```

| 函數名稱 | 說明 | 使用場景 |
|---------|------|----------|
| `'fuzzy'` | 模糊搜尋 | 全域搜尋、文字欄位 |
| `'multi'` | 多選篩選 | 狀態、分類等欄位 |
| `'includesString'` | 包含字串 | 文字搜尋 |
| `'equals'` | 精確匹配 | ID、代碼等欄位 |

#### 欄位寬度設定

可以使用三種方式設定欄位寬度：

```typescript
// 1. 使用 CSS 類別（推薦）
{
  accessorKey: 'id',
  header: 'ID',
  meta: { widthClass: 'w-16' }  // Tailwind CSS 類別
}

// 2. 使用像素值
{
  accessorKey: 'description',
  header: '描述',
  size: 200,        // 固定 200px
  minSize: 100,     // 最小 100px
  maxSize: 400      // 最大 400px
}

// 3. 使用百分比（透過 CSS 類別）
{
  accessorKey: 'content',
  header: '內容',
  meta: { widthClass: 'w-1/3' }  // 佔 1/3 寬度
}
```

#### 條件式樣式

根據資料值動態設定樣式：

```typescript
{
  accessorKey: 'score',
  header: '分數',
  cell: ({ row }) => {
    const score = row.getValue('score') as number
    const getScoreClass = (score: number) => {
      if (score >= 90) return 'bg-green-100 text-green-800'
      if (score >= 70) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }
    
    return h('span', {
      class: `px-2 py-1 rounded-full text-xs ${getScoreClass(score)}`
    }, score)
  }
}
```

### FacetedFilter 配置

```typescript
interface FacetedFilter {
  columnId: string       // 對應的欄位 ID
  title: string         // 篩選器顯示標題
  options: Array<{      // 可選選項
    label: string       // 顯示文字
    value: string       // 實際值
    icon?: any         // 可選圖示
  }>
}
```

#### 快速參考

以下是最常用的欄位配置組合：

| 欄位類型 | 配置範例 | 說明 |
|---------|---------|------|
| **ID 欄位** | `{ accessorKey: 'id', header: 'ID', meta: { widthClass: 'w-16' }, enableSorting: false }` | 通常不需要排序 |
| **文字欄位** | `{ accessorKey: 'name', header: '姓名' }` | 預設可排序、可搜尋 |
| **數值欄位** | `{ accessorKey: 'amount', header: '金額', meta: { cellClass: 'text-right' } }` | 右對齊顯示 |
| **日期欄位** | `{ accessorKey: 'createdAt', header: '建立時間', sortingFn: 'datetime' }` | 使用日期排序 |
| **狀態欄位** | `{ accessorKey: 'status', header: '狀態', filterFn: 'multi' }` | 支援多選篩選 |
| **操作欄位** | `{ id: 'actions', header: '操作', enableSorting: false, enableHiding: false }` | 不可排序、不可隱藏 |
| **圖片欄位** | `{ accessorKey: 'avatar', header: '頭像', enableSorting: false, enableGlobalFilter: false }` | 不參與搜尋 |

## 進階使用

### 1. 獲取選中的行

```vue
<template>
  <DataTable
    ref="tableRef"
    :data="users"
    :columns="columns"
    :use-checkbox="true"
    :row-key="'id'"
  />
  <Button @click="handleSelectedRows">處理選中項目</Button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const tableRef = ref()
const selectedUsers = ref<User[]>([])

// 監聽表格的選中狀態變化
watch(
  () => tableRef.value?.table?.getSelectedRowModel()?.rows,
  (selectedRows) => {
    if (!selectedRows) return (selectedUsers.value = [])
    selectedUsers.value = selectedRows.map((row: any) => row.original as User)
  },
  { deep: true, immediate: true }
)

const handleSelectedRows = () => {
  console.log('選中的行：', selectedUsers.value)
}
</script>
```

### 2. 自訂欄位渲染

```typescript
{
  accessorKey: 'avatar',
  header: '頭像',
  cell: ({ row }) => {
    const avatarUrl = row.getValue('avatar')
    return h('img', {
      src: avatarUrl,
      alt: '頭像',
      class: 'w-8 h-8 rounded-full'
    })
  }
}
```

### 3. 操作欄位

```typescript
{
  id: 'actions',
  header: '操作',
  cell: ({ row }) => {
    return h('div', { class: 'flex gap-2' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        onClick: () => editUser(row.original)
      }, '編輯'),
      h(Button, {
        size: 'sm',
        variant: 'destructive',
        onClick: () => deleteUser(row.original.id)
      }, '刪除')
    ])
  }
}
```

### 4. 條件式樣式

```typescript
{
  accessorKey: 'score',
  header: '分數',
  cell: ({ row }) => {
    const score = row.getValue('score') as number
    return h('span', {
      class: cn(
        'px-2 py-1 rounded-full text-xs',
        score >= 80 ? 'bg-green-100 text-green-800' :
        score >= 60 ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      )
    }, score)
  }
}
```

## 樣式自訂

組件使用 Tailwind CSS 類別，你可以透過以下方式自訂樣式：

### 1. 欄位寬度

```typescript
{
  accessorKey: 'id',
  header: 'ID',
  meta: { widthClass: 'w-16' }  // 固定寬度
}
```

### 2. 儲存格對齊

```typescript
{
  accessorKey: 'amount',
  header: '金額',
  meta: { cellClass: 'text-right font-mono' }  // 右對齊 + 等寬字體
}
```

### 3. 表格容器樣式

```vue
<template>
  <div class="rounded-lg border shadow-sm">
    <DataTable :rows="data" :columns="columns" />
  </div>
</template>
```

## 效能最佳化

### 1. 大量資料處理

```typescript
// 使用 computed 進行資料預處理
const processedData = computed(() => {
  return rawData.value.map(item => ({
    ...item,
    displayName: `${item.firstName} ${item.lastName}`,
    formattedDate: formatDate(item.createdAt)
  }))
})
```

### 2. 欄位記憶化

```typescript
const columns = computed(() => [
  // 欄位定義
])
```

## 常見問題

### Q: 如何設定預設排序？

A: 可以在 `useDataTable` 的 `initialState` 中設定：

```typescript
const dt = useDataTable({
  data: props.rows,
  columns: props.columns,
  initialState: {
    pageSize: 10,
    sorting: [{ id: 'createdAt', desc: true }]  // 預設按建立時間降序
  }
})
```

### Q: 如何禁用某個欄位的排序？

A: 在欄位定義中設定 `enableSorting: false`：

```typescript
{
  accessorKey: 'actions',
  header: '操作',
  enableSorting: false
}
```

### Q: 如何自訂搜尋邏輯？

A: 修改 `utils.ts` 中的 `fuzzyFilter` 函數：

```typescript
export const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  // 自訂搜尋邏輯
  const cellValue = String(row.getValue(columnId) || '').toLowerCase()
  const searchValue = String(value || '').toLowerCase()
  return cellValue.includes(searchValue)
}
```

## 行選擇功能詳解

### 啟用選擇功能

透過 `useCheckbox` prop 控制是否啟用行選擇功能：

```vue
<!-- 啟用選擇功能 -->
<DataTable :use-checkbox="true" :data="users" :columns="columns" />

<!-- 禁用選擇功能（預設） -->
<DataTable :data="users" :columns="columns" />
```

### 實現原理

當 `useCheckbox` 為 `true` 時，DataTable 組件會自動：

1. 使用 `createSelectColumn()` 創建選擇欄位
2. 將其添加到 columns 的最前面：`[createSelectColumn(), ...props.columns]`
3. 內部使用 computed 來響應式地處理 columns 變化

### 選擇功能特性

- ✅ **單行選擇**：點擊任意行的 checkbox 選中該行
- ✅ **全選功能**：點擊表頭 checkbox 選中/取消選中當前頁所有行
- ✅ **半選狀態**：當部分行被選中時，表頭 checkbox 顯示 indeterminate 狀態
- ✅ **響應式更新**：選中狀態變化會即時反映到監聽器中
- ✅ **符合官方實現**：底層使用 shadcn-vue 標準的 checkbox 實現

### 動態控制選擇功能

```vue
<template>
  <div>
    <!-- 功能開關 -->
    <label>
      <input type="checkbox" v-model="useCheckbox" />
      啟用選擇功能
    </label>
    
    <!-- 資料表格 -->
    <DataTable 
      :data="users" 
      :columns="columns" 
      :use-checkbox="useCheckbox"
    />
  </div>
</template>

<script setup lang="ts">
const useCheckbox = ref(false) // 可以動態切換
</script>
```

### Q: 為什麼選中狀態沒有正確傳遞？

A: 確保：

1. 設置了 `use-checkbox="true"`
2. 提供了正確的 `row-key`
3. 使用正確的監聽方式：

```typescript
watch(
  () => tableRef.value?.table?.getSelectedRowModel()?.rows,
  (selectedRows) => {
    // 處理選中狀態變化
  },
  { deep: true, immediate: true }
)
```

## 更新日誌

- **v2.0.0**: 重大更新 - 新增 useCheckbox 功能
  - ✨ 新增 `useCheckbox` prop 控制行選擇功能
  - 🔧 重構選擇功能實現，符合 shadcn-vue 官方標準
  - 📝 更新文檔和範例代碼
  - 🐛 修復選中狀態傳遞問題
- **v1.0.0**: 初始版本，支援基本的表格功能
  - 基於 `@tanstack/vue-table` 最新版本
  - 支援 Vue 3 Composition API
  - 完整的 TypeScript 支援
