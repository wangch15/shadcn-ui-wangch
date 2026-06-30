/**
 * 導航子項目的類型定義
 */
export interface NavigationItem {
    /** 項目標題 */
    title: string
    /** 路由名稱（用於 router-link） */
    name?: string
    /** 外部連結 URL（當 name 不存在時使用） */
    url?: string
    /** 路由路徑 */
    path?: string
}

/**
 * 導航主項目的類型定義（對應 NavGroup）
 */
export interface NavigationMainItem {
    /** 主項目標題 */
    title: string
    /** 子導航項目列表 */
    items: NavigationItem[]
}

/**
 * Breadcrumb 項目的類型定義
 */
export interface SidebarBreadcrumbItem {
    /** Breadcrumb 標題 */
    title: string
    /** Breadcrumb 路徑（可選） */
    path?: string
}

/**
 * 用戶信息的類型定義
 */
export interface UserInfo {
    /** 用戶名稱 */
    name: string
    /** 用戶電子郵件 */
    email: string
    /** 用戶頭像 URL */
    avatar: string
    /** 用戶 ID（可選） */
    userId?: string
    /** 用戶角色（可選） */
    role?: 'Admin' | '' | string
}

/**
 * Sidebar 品牌資訊的類型定義
 */
export interface SidebarBrandInfo {
    /** Logo 圖片路徑 */
    logo?: string
    /** Logo 替代文字 */
    logoAlt?: string
    /** 應用程式名稱 */
    appName: string
    /** 版本號 */
    version?: string
}

/**
 * Sidebar01 Layout 的 Props 類型定義
 */
export interface Sidebar01Props {
    /** 導航主項目列表 */
    navigationItems: NavigationMainItem[]
    /** 用戶信息 */
    user?: UserInfo
    /** Sidebar 品牌資訊 */
    brandInfo?: SidebarBrandInfo
    /** 是否顯示主題切換按鈕 */
    showThemeToggle?: boolean
    /** 獲取 breadcrumb 路徑的函數，返回格式為 { title: string; path?: string }[] */
    getBreadcrumbPath?: (routeName: string) => SidebarBreadcrumbItem[]
    /** 當前路由名稱（用於高亮活動狀態和生成 breadcrumb） */
    currentRouteName?: string | symbol
    /** 當前路由路徑（用於高亮活動狀態，優先級低於 currentRouteName） */
    currentRoutePath?: string
    /** Breadcrumb 項目列表（如果提供則直接使用，否則使用 getBreadcrumbPath） */
    breadcrumbItems?: SidebarBreadcrumbItem[]
}

/**
 * NavUser 組件的 Props 類型定義
 */
export interface NavUserProps {
    /** 用戶信息 */
    user: UserInfo
}

/**
 * AppSidebar 組件的 Props 類型定義
 */
export interface AppSidebarProps {
    /** 導航主項目列表 */
    navigationItems: NavigationMainItem[]
    /** 用戶信息 */
    user?: UserInfo
    /** Sidebar 品牌資訊 */
    brandInfo?: SidebarBrandInfo
    /** 當前路由名稱（用於高亮活動狀態） */
    currentRouteName?: string | symbol
    /** 當前路由路徑（用於高亮活動狀態，優先級低於 currentRouteName） */
    currentRoutePath?: string
}

/**
 * 類型別名導出，方便使用
 */
export type NavItem = NavigationItem
export type NavGroup = NavigationMainItem
