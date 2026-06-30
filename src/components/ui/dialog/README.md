# Dialog 對話框元件

基於 [Reka UI](https://reka-ui.com/) (Radix Vue) 的 Dialog 元件封裝,提供模態對話框功能。

## 元件結構

Dialog 元件由以下子元件組成:

- `Dialog` - 根元件,控制對話框的開關狀態
- `DialogTrigger` - 觸發按鈕,點擊後開啟對話框
- `DialogContent` - 對話框內容容器
- `DialogHeader` - 對話框標題區域
- `DialogTitle` - 對話框標題
- `DialogDescription` - 對話框描述文字
- `DialogFooter` - 對話框底部區域(通常放置操作按鈕)
- `DialogClose` - 關閉按鈕
- `DialogOverlay` - 背景遮罩層
- `DialogScrollContent` - 可滾動的內容容器(用於內容較多的情況)

## 基本用法

### 簡單對話框

```vue
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">開啟對話框</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>對話框標題</DialogTitle>
        <DialogDescription>
          這是對話框的描述文字,用來說明對話框的用途。
        </DialogDescription>
      </DialogHeader>
      <div class="py-4">
        <!-- 對話框主要內容 -->
        <p>這裡是對話框的主要內容</p>
      </div>
      <DialogFooter>
        <Button type="submit">確認</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### 受控模式

使用 `v-model:open` 來控制對話框的開關狀態:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const handleSubmit = () => {
  // 處理提交邏輯
  isOpen.value = false // 關閉對話框
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button>開啟對話框</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>確認操作</DialogTitle>
      </DialogHeader>
      <p>確定要執行此操作嗎?</p>
      <DialogFooter>
        <Button variant="outline" @click="isOpen = false">取消</Button>
        <Button @click="handleSubmit">確認</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### 可滾動內容

當內容較多時,使用 `DialogScrollContent` 替代 `DialogContent`:

```vue
<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>查看詳情</Button>
    </DialogTrigger>
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>長內容對話框</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <!-- 大量內容 -->
        <p v-for="i in 20" :key="i">
          這是第 {{ i }} 段內容...
        </p>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>
```

### 防止點擊背景關閉

使用 `closeOnClickOutside` prop 來控制是否允許點擊背景關閉對話框:

```vue
<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>開啟對話框</Button>
    </DialogTrigger>
    <DialogContent :close-on-click-outside="false">
      <DialogHeader>
        <DialogTitle>重要提示</DialogTitle>
        <DialogDescription>
          此對話框無法通過點擊背景關閉,必須點擊關閉按鈕或取消按鈕。
        </DialogDescription>
      </DialogHeader>
      <div class="py-4">
        <p>請仔細閱讀以下內容...</p>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">關閉</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### 自定義樣式

可以通過 `class` prop 來自定義對話框樣式:

```vue
<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>開啟大型對話框</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>大型對話框</DialogTitle>
      </DialogHeader>
      <!-- 內容 -->
    </DialogContent>
  </Dialog>
</template>
```

### 表單對話框

結合表單使用的完整範例:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const isOpen = ref(false)
const formData = ref({
  name: '',
  email: '',
})

const handleSubmit = () => {
  console.log('提交表單:', formData.value)
  isOpen.value = false
  // 重置表單
  formData.value = { name: '', email: '' }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button>新增用戶</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>新增用戶</DialogTitle>
        <DialogDescription>
          請填寫用戶資訊
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="name">姓名</Label>
          <Input id="name" v-model="formData.name" placeholder="請輸入姓名" />
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="formData.email" type="email" placeholder="請輸入 Email" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="isOpen = false">取消</Button>
        <Button @click="handleSubmit">確認新增</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

## Props

### Dialog (根元件)

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `open` | `boolean` | - | 對話框開啟狀態(非受控) |
| `defaultOpen` | `boolean` | `false` | 預設開啟狀態 |
| `modal` | `boolean` | `true` | 是否為模態對話框 |

### DialogContent

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `class` | `string` | - | 自定義 CSS class |
| `closeOnClickOutside` | `boolean` | `true` | 是否允許點擊背景關閉對話框 |
| `forceMount` | `boolean` | `false` | 強制掛載元件 |
| `trapFocus` | `boolean` | `true` | 是否鎖定焦點在對話框內 |

### DialogScrollContent

繼承 `DialogContent` 的所有 props,並針對滾動內容進行了優化。

## Events

### Dialog

| Event | 參數 | 說明 |
|-------|------|------|
| `update:open` | `(open: boolean)` | 開啟狀態改變時觸發 |

### DialogContent

| Event | 參數 | 說明 |
|-------|------|------|
| `escapeKeyDown` | `(event: KeyboardEvent)` | 按下 ESC 鍵時觸發 |
| `pointerDownOutside` | `(event: PointerEvent)` | 在對話框外按下滑鼠時觸發 |
| `focusOutside` | `(event: FocusEvent)` | 焦點移到對話框外時觸發 |
| `interactOutside` | `(event: Event)` | 在對話框外互動時觸發 |

## 使用建議

1. **無障礙性**: 始終為 `DialogTitle` 提供有意義的標題,這對螢幕閱讀器很重要
2. **關閉方式**: 提供多種關閉方式(ESC 鍵、關閉按鈕、取消按鈕)以提升用戶體驗
3. **表單驗證**: 在表單對話框中,建議在提交前進行驗證
4. **狀態管理**: 對於複雜的對話框,使用受控模式(`v-model:open`)更容易管理狀態
5. **內容長度**: 如果內容可能很長,使用 `DialogScrollContent` 而不是 `DialogContent`
6. **重要操作**: 對於不可逆的重要操作(如刪除),建議設置 `:close-on-click-outside="false"` 防止誤操作

## 注意事項

- 對話框預設會鎖定焦點,防止用戶在對話框開啟時與背景內容互動
- 按下 ESC 鍵會關閉對話框(除非阻止了該事件)
- 對話框會自動處理焦點管理和鍵盤導航
- 使用 `as-child` prop 可以將觸發器或關閉按鈕的功能合併到自定義元件上
