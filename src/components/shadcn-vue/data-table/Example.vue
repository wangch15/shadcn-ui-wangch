<!-- DataTable 使用示範 -->
<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">Data Table 示範</h1>
      <p class="text-muted-foreground">
        展示 @tanstack/vue-table 驅動的資料表格組件功能
      </p>
    </div>

    <!-- 功能控制區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 操作按鈕 -->
      <div class="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Button @click="addRandomUser" class="gap-2">
          <Plus class="size-4" />
          新增使用者
        </Button>
        <Button @click="handleSelectedUsers" variant="outline" class="gap-2"
          :disabled="!useCheckbox || selectedCount === 0">
          <Users class="size-4" />
          處理選中項目 ({{ selectedCount }})
        </Button>
        <Button @click="exportData" variant="outline" class="gap-2">
          <Download class="size-4" />
          匯出資料
        </Button>
        <Button @click="refreshData" variant="outline" class="gap-2">
          <RefreshCw class="size-4" />
          重新整理
        </Button>
      </div>

      <!-- 功能開關 -->
      <div class="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div class="flex items-center gap-2">
          <input id="checkbox-toggle" type="checkbox" v-model="useCheckbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
          <label for="checkbox-toggle" class="text-sm font-medium">
            啟用選擇功能
          </label>
        </div>
        <div class="text-sm text-muted-foreground">
          {{ useCheckbox ? '可以選擇多個項目進行批次操作' : '純展示模式，無選擇功能' }}
        </div>
      </div>
    </div>

    <!-- 資料表格 -->
    <DataTable ref="tableRef" :data="users" :columns="columns" :page-size="10" :faceted-filters="facetedFilters"
      :use-checkbox="useCheckbox" :row-key="'id'" />

    <!-- 選中項目資訊 -->
    <div v-if="selectedUsers.length > 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">已選中 {{ selectedUsers.length }} 個使用者：</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="user in selectedUsers" :key="user.id"
          class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
          {{ user.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { DataTable, type ColumnDef } from './index'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import {
  Plus,
  Users,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'

// 定義使用者資料型別
interface User {
  id: number
  name: string
  email: string
  phone: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive' | 'pending'
  department: string
  joinDate: string
  avatar: string
  score: number
  lastLogin: string
}

// 模擬資料
const generateMockUsers = (): User[] => {
  const names = ['張三', '李四', '王五', '趙六', '陳七', '劉八', '黃九', '楊十', '周一', '吳二']
  const departments = ['技術部', '產品部', '設計部', '行銷部', '營運部', '人資部']
  const roles: User['role'][] = ['admin', 'user', 'guest']
  const statuses: User['status'][] = ['active', 'inactive', 'pending']

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: (names[Math.floor(Math.random() * names.length)] || 'User') + (i > 9 ? i : ''),
    email: `user${i + 1}@example.com`,
    phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    role: roles[Math.floor(Math.random() * roles.length)] || 'user',
    status: statuses[Math.floor(Math.random() * statuses.length)] || 'active',
    department: departments[Math.floor(Math.random() * departments.length)] || 'General',
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] || '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    score: Math.floor(Math.random() * 100),
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  }))
}

// 響應式資料
const users = ref<User[]>(generateMockUsers())
const tableRef = ref()
const useCheckbox = ref(true)

// 欄位定義
const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'avatar',
    header: '頭像',
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h('img', {
          src: user.avatar,
          alt: user.name,
          class: 'w-8 h-8 rounded-full border'
        }),
        h('div', { class: 'font-medium' }, user.name)
      ])
    },
    enableSorting: false,
    meta: { widthClass: 'w-40' }
  },
  {
    accessorKey: 'email',
    header: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Mail, { class: 'size-4' }),
      'Email'
    ]),
    cell: ({ row }) => {
      return h('a', {
        href: `mailto:${row.getValue('email')}`,
        class: 'text-blue-600 hover:text-blue-800 hover:underline'
      }, row.getValue('email'))
    },
    meta: { cellClass: 'font-mono text-sm' }
  },
  {
    accessorKey: 'phone',
    header: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Phone, { class: 'size-4' }),
      '電話'
    ]),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      return h('span', { class: 'font-mono text-sm' },
        phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3')
      )
    }
  },
  {
    accessorKey: 'role',
    header: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Shield, { class: 'size-4' }),
      '角色'
    ]),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      const roleConfig = {
        admin: { label: '管理員', class: 'bg-red-100 text-red-800' },
        user: { label: '使用者', class: 'bg-blue-100 text-blue-800' },
        guest: { label: '訪客', class: 'bg-gray-100 text-gray-800' }
      }
      const config = roleConfig[role as keyof typeof roleConfig]
      return h(Badge, {
        variant: 'secondary',
        class: config.class
      }, config.label)
    },
    filterFn: 'includesString'
  },
  {
    accessorKey: 'status',
    header: '狀態',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusConfig = {
        active: {
          label: '啟用',
          class: 'bg-green-100 text-green-800',
          icon: CheckCircle
        },
        inactive: {
          label: '停用',
          class: 'bg-red-100 text-red-800',
          icon: XCircle
        },
        pending: {
          label: '待審核',
          class: 'bg-yellow-100 text-yellow-800',
          icon: Calendar
        }
      }
      const config = statusConfig[status as keyof typeof statusConfig]
      return h('div', { class: 'flex items-center gap-1' }, [
        h(config.icon, { class: 'size-3' }),
        h(Badge, {
          variant: 'secondary',
          class: config.class
        }, config.label)
      ])
    },
    filterFn: 'includesString'
  },
  {
    accessorKey: 'department',
    header: '部門',
    filterFn: 'includesString'
  },
  {
    accessorKey: 'score',
    header: '評分',
    cell: ({ row }) => {
      const score = row.getValue('score') as number
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', {
          class: 'w-16 h-2 bg-gray-200 rounded-full overflow-hidden'
        }, [
          h('div', {
            class: `h-full transition-all ${score >= 80 ? 'bg-green-500' :
              score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`,
            style: `width: ${score}%`
          })
        ]),
        h('span', {
          class: `text-sm font-medium ${score >= 80 ? 'text-green-600' :
            score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`
        }, score)
      ])
    },
    sortingFn: 'basic',
    meta: { cellClass: 'text-center', widthClass: 'w-32' }
  },
  {
    accessorKey: 'joinDate',
    header: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Calendar, { class: 'size-4' }),
      '加入日期'
    ]),
    cell: ({ row }) => {
      const date = new Date(row.getValue('joinDate'))
      return h('span', { class: 'text-sm' },
        date.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      )
    },
    sortingFn: 'datetime'
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center gap-1' }, [
        h(Button, {
          size: 'sm',
          variant: 'ghost',
          onClick: () => editUser(user),
          class: 'h-8 w-8 p-0'
        }, h(Edit, { class: 'size-4' })),
        h(Button, {
          size: 'sm',
          variant: 'ghost',
          onClick: () => deleteUser(user.id),
          class: 'h-8 w-8 p-0 text-red-600 hover:text-red-700'
        }, h(Trash2, { class: 'size-4' }))
      ])
    },
    enableSorting: false,
    meta: { widthClass: 'w-20' }
  }
]

// 篩選器配置
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
      { label: '停用', value: 'inactive' },
      { label: '待審核', value: 'pending' }
    ]
  },
  {
    columnId: 'department',
    title: '部門',
    options: [
      { label: '技術部', value: '技術部' },
      { label: '產品部', value: '產品部' },
      { label: '設計部', value: '設計部' },
      { label: '行銷部', value: '行銷部' },
      { label: '營運部', value: '營運部' },
      { label: '人資部', value: '人資部' }
    ]
  }
]

// 選中項目的處理
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

const selectedCount = computed(() => selectedUsers.value.length)

// 方法
const addRandomUser = () => {
  const newId = Math.max(...users.value.map(u => u.id)) + 1
  const names = ['新使用者', '測試用戶', '示範帳號']
  const departments = ['技術部', '產品部', '設計部', '行銷部', '營運部', '人資部']
  const roles: User['role'][] = ['user', 'guest']

  const newUser: User = {
    id: newId,
    name: (names[Math.floor(Math.random() * names.length)] || 'User') + newId,
    email: `newuser${newId}@example.com`,
    phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    role: roles[Math.floor(Math.random() * roles.length)] || 'user',
    status: 'active',
    department: departments[Math.floor(Math.random() * departments.length)] || 'Engineering',
    joinDate: new Date().toISOString().split('T')[0] || '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
    score: Math.floor(Math.random() * 100),
    lastLogin: new Date().toISOString()
  }

  users.value.unshift(newUser)
}

const handleSelectedUsers = () => {
  if (selectedUsers.value.length === 0) {
    alert('請先選擇要處理的使用者')
    return
  }

  const userNames = selectedUsers.value.map(u => u.name).join(', ')
  alert(`已選中 ${selectedUsers.value.length} 個使用者：${userNames}`)
}

const exportData = () => {
  const csvContent = [
    ['ID', '姓名', 'Email', '電話', '角色', '狀態', '部門', '加入日期', '評分'].join(','),
    ...users.value.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.status,
      user.department,
      user.joinDate,
      user.score
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `users_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

const refreshData = () => {
  users.value = generateMockUsers()
}

const editUser = (user: User) => {
  alert(`編輯使用者：${user.name}`)
}

const deleteUser = (userId: number) => {
  if (confirm('確定要刪除這個使用者嗎？')) {
    users.value = users.value.filter(u => u.id !== userId)
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
