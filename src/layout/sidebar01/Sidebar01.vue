<template>
  <SidebarProvider>
    <AppSidebar :navigation-items="navigationItems" :user="user && user.name ? user : undefined" :brand-info="brandInfo"
      :current-route-name="currentRouteName" :current-route-path="currentRoutePath"
      @update:sidebar-state="handleSidebarStateChange" @update:is-mobile="handleIsMobileChange" @logout="handleLogout">
      <template #brand>
        <slot name="brand" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </AppSidebar>

    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b">
        <div class="flex items-center justify-between gap-2 px-3 w-full">
          <div class="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" class="mr-2 h-4! w-0.5!" />
            <Breadcrumb v-if="breadcrumbItems.length > 0">
              <BreadcrumbList>
                <template v-for="(item, index) in breadcrumbItems" :key="`${item.title}-${index}`">
                  <BreadcrumbItem>
                    <BreadcrumbPage v-if="index === breadcrumbItems.length - 1">
                      {{ item.title }}
                    </BreadcrumbPage>
                    <span v-else class="text-muted-foreground">
                      {{ item.title }}
                    </span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
                </template>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div class="flex items-center gap-2">
            <ThemeButton v-if="showThemeToggle" />
          </div>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4" :class="[maxWidthClass]">
        <slot>
          <RouterView />
        </slot>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSidebar from "./components/AppSidebar.vue"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { Separator } from "../../components/ui/separator"
import ThemeButton from "./components/ThemeButton.vue"
import type {
  SidebarBreadcrumbItem,
  NavigationMainItem,
  UserInfo,
  SidebarBrandInfo,
  SidebarBreadcrumbItem as BreadcrumbItemType,
} from './types'

interface Props {
  navigationItems: NavigationMainItem[]
  user: UserInfo
  brandInfo?: SidebarBrandInfo
  showThemeToggle?: boolean
  getBreadcrumbPath?: (routeName: string) => BreadcrumbItemType[]
  currentRouteName?: string | symbol
  currentRoutePath?: string
  breadcrumbItems?: BreadcrumbItemType[]
}

const props = withDefaults(defineProps<Props>(), {
  showThemeToggle: true,
  brandInfo: () => ({
    appName: 'Application',
  }),
  user: () => ({
    name: '',
    email: '',
    avatar: '',
  }),
})

// 使用傳入的 currentRouteName 和 currentRoutePath props
// 如果使用者需要從 vue-router 獲取，應該在使用此組件的地方處理
const currentRouteName = computed(() => props.currentRouteName)
const currentRoutePath = computed(() => props.currentRoutePath)

const isMobile = ref(false)
const sidebarState = ref<'expanded' | 'collapsed'>('expanded')

// 動態生成 breadcrumb 項目
const breadcrumbItems = computed(() => {
  // 如果直接提供了 breadcrumbItems，優先使用
  if (props.breadcrumbItems) {
    return props.breadcrumbItems
  }

  // 否則嘗試使用 getBreadcrumbPath 函數
  const routeName = currentRouteName.value
  if (routeName && typeof routeName === 'string' && routeName !== 'Home' && props.getBreadcrumbPath) {
    return props.getBreadcrumbPath(routeName)
  }

  return [] as SidebarBreadcrumbItem[]
})

const handleSidebarStateChange = (state: 'expanded' | 'collapsed') => {
  sidebarState.value = state
}

const handleIsMobileChange = (_isMobile: boolean) => {
  isMobile.value = _isMobile
}

const maxWidthClass = computed(() => {
  if (isMobile.value || sidebarState.value === 'collapsed') return 'max-w-full';
  return 'max-w-[calc(100dvw-var(--sidebar-width))]';
})

const emit = defineEmits<{
  'logout': []
}>()

const handleLogout = () => {
  emit('logout')
}
</script>
