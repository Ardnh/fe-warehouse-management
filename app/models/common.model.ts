import type { Pagination } from './pagination.model'
import type { NavigationMenuItem } from '@nuxt/ui'

export interface BaseResponse {
    success: boolean
    message: string
}

export interface BasePagination {
    pagination: Pagination
}

export interface BaseParams {
    page: number
    page_size: number
    search?: string
}

export interface Options {
    label: string
    value: string
}

export interface SidebarSection {
    analytics: NavigationMenuItem[]
    master_data: NavigationMenuItem[]
    transactions: NavigationMenuItem[]
    user_management: NavigationMenuItem[]
}

export interface SidebarSectionGroup {
    analytics: string[]
    master_data: string[]
    transactions: string[]
    user_management: string[]
}
