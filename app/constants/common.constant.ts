import type { Pagination, BaseParams, SidebarSection, SidebarSectionGroup } from '~/models'

export const INITIAL_PAGINATION: Pagination = {
    current_page: 1,
    page_size: 30,
    total_items: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
}

export const INITIAL_PARAMS: Pick<BaseParams, 'page' | 'page_size'> = {
    page: 1,
    page_size: 30,
}

export type RequestOptions = { signal?: AbortSignal }

export const MODULE_NAMES = {
    USER: 'user',
    USER_ROLE: 'user-role',
    PERMISSIONS: 'permission',
    CUSTOMER: 'customer',
    WAREHOUSE: 'warehouse',
    LOCATION: 'location',
    UOMS: 'uoms',
    ZONE: 'zone',
    RACK: 'rack',
    STORAGE_LOCATION: 'storage-location',
    INBOUND_ORDER: 'inbound-order',
    INBOUND_ORDER_ITEM: 'inbound-order-item',
    HANDLING_UNIT: 'handling-unit',
    HANDLING_UNIT_ITEM: 'handling-unit-item',
    PRODUCT: 'product',
    ROLE: 'role',
    RECEIVING: 'receiving',
    RECEIVING_ITEM: 'receiving-item',
} as const

export const SIDEBAR_SECTION: SidebarSectionGroup = {
    analytics: ['overview'],
    master_data: ['customer', 'product', 'warehouse', 'location', 'uoms'],
    transactions: ['inbound_orders', 'receivings', 'handling_unit'],
    user_management: ['user', 'roles'],
}

export const INITIAL_SIDEBAR: SidebarSection = {
    analytics: [
        {
            type: 'label',
            label: 'Analytics',
        },
    ],
    master_data: [
        {
            type: 'label',
            label: 'Master Data',
        },
    ],
    transactions: [
        {
            type: 'label',
            label: 'Transactions',
        },
    ],
    user_management: [
        {
            type: 'label',
            label: 'Users Management',
        },
    ],
}
