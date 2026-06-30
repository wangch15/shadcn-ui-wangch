<template>
  <Sidebar v-bind="sidebarProps">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <slot name="brand">
              <a href="#">
                <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                  <img v-if="brandInfo?.logo" :src="brandInfo.logo" class="w-full" :alt="brandInfo?.logoAlt || 'Logo'">
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-medium">{{ brandInfo?.appName || 'Application' }}</span>
                  <span v-if="brandInfo?.version" class="">{{ brandInfo.version }}</span>
                </div>
              </a>
            </slot>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in navigationItems" :key="item.title">
            <SidebarMenuButton as-child>
              <span class="font-medium pointer-events-none">
                {{ item.title }}
              </span>
            </SidebarMenuButton>
            <SidebarMenuSub v-if="item.items.length">
              <SidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
                <SidebarMenuSubButton as-child :is-active="isItemActive(childItem)">
                  <template v-if="childItem.name">
                    <router-link :to="childItem.path ? { path: childItem.path } : { name: childItem.name }">
                      {{ childItem.title }}
                    </router-link>
                  </template>
                  <template v-else-if="childItem.path">
                    <router-link :to="childItem.path">{{ childItem.title }}</router-link>
                  </template>
                  <template v-else>
                    <a :href="childItem.url">{{ childItem.title }}</a>
                  </template>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <slot name="footer">
        <NavUser v-if="user" :user="user" @logout="handleLogout" />
      </slot>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import type { SidebarProps } from '#/components/ui/sidebar'
import type { AppSidebarProps } from '#/layout/sidebar01/types'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from '#/components/ui/sidebar'

import NavUser from "#/layout/sidebar01/components/NavUser.vue"
import { watch, computed } from 'vue'

const props = withDefaults(defineProps<AppSidebarProps & {
  side?: SidebarProps['side']
  variant?: SidebarProps['variant']
  collapsible?: SidebarProps['collapsible']
  class?: SidebarProps['class']
}>(), {
  brandInfo: () => ({
    appName: 'Application',
  }),
})

const currentRouteName = computed(() => props.currentRouteName)
const currentRoutePath = computed(() => props.currentRoutePath)

const { state, isMobile } = useSidebar()

// 判斷項目是否為 active 狀態
const isItemActive = (item: { name?: string; path?: string }): boolean => {
  // 優先使用 name 匹配
  if (currentRouteName.value && item.name) {
    return currentRouteName.value === item.name
  }
  // 其次使用 path 匹配
  if (currentRoutePath.value && item.path) {
    return currentRoutePath.value === item.path
  }
  return false
}

// 定義 emits 來傳遞 state 給父組件
const emit = defineEmits<{
  'update:sidebarState': [state: 'expanded' | 'collapsed']
  'update:isMobile': [isMobile: boolean]
  'logout': []
}>()

watch(isMobile, (newIsMobile) => {
  emit('update:isMobile', newIsMobile)
}, { immediate: true })

// 監聽 state 變化並傳遞給父組件
watch(state, (newState) => {
  emit('update:sidebarState', newState)
}, { immediate: true })

const handleLogout = () => {
  emit('logout')
}

// 組合 SidebarProps
const sidebarProps = computed(() => ({
  side: props.side,
  variant: props.variant,
  collapsible: props.collapsible,
  class: props.class,
}))
</script>
