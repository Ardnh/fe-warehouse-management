<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { SidebarSection } from '~/models'
import { useAuthStore } from '~/stores'
import { INITIAL_SIDEBAR } from '~/constants'

const route = useRoute()
const toast = useToast()
const { hasAccess } = useAccess()
const authStore = useAuthStore()
const userStore = useUserStore()

const open = ref(false)
const activePageName = ref('Dashboard')

const links = [
    {
        type: 'label',
        label: 'Analytics',
    },
    {
        label: 'Overview',
        description: 'Overview page',
        icon: 'i-lucide-house',
        to: '/dashboard',
        onSelect: () => {
            activePageName.value = 'Overview'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        type: 'label',
        label: 'Master Data',
    },
    {
        label: 'Customer',
        description: 'Customer management',
        icon: 'i-lucide-users',
        to: '/dashboard/customer',
        onSelect: () => {
            activePageName.value = 'Customer'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'Product',
        description: 'Product management',
        icon: 'i-lucide-package',
        to: '/dashboard/product',
        onSelect: () => {
            activePageName.value = 'Product'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'Warehouse',
        description: 'Warehouse management',
        icon: 'i-lucide-warehouse',
        to: '/dashboard/warehouse',
        onSelect: () => {
            activePageName.value = 'Warehouse'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'Locations',
        description: 'Location management',
        icon: 'i-lucide-map-pin',
        to: '/dashboard/location',
        onSelect: () => {
            activePageName.value = 'Locations'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'UOMS',
        description: 'UOMS management',
        icon: 'i-lucide-ruler',
        to: '/dashboard/uoms',
        onSelect: () => {
            activePageName.value = 'UOMS'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        type: 'label',
        label: 'Transactions',
    },
    {
        label: 'Inbound Orders',
        icon: 'i-lucide-package-plus',
        description: 'Inbound Orders management',
        to: '/dashboard/inbound-orders',
        onSelect: () => {
            activePageName.value = 'Inbound Orders'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'Receivings',
        icon: 'i-lucide-clipboard-check',
        description: 'Receivings management',
        to: '/dashboard/receivings',
        onSelect: () => {
            activePageName.value = 'Receivings'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'Handling Unit',
        icon: 'i-lucide-boxes',
        description: 'Handling Unit management',
        to: '/dashboard/handling-unit',
        onSelect: () => {
            activePageName.value = 'Handling Unit'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        type: 'label',
        label: 'Users Management',
    },
    {
        label: 'Users',
        description: 'Users management',
        icon: 'i-lucide-circle-user',
        to: '/dashboard/users',
        onSelect: () => {
            activePageName.value = 'Users'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
    {
        label: 'Roles',
        description: 'Roles management',
        icon: 'i-lucide-user-shield',
        to: '/dashboard/roles',
        onSelect: () => {
            activePageName.value = 'Roles'
            useHead({ title: `Dashboard | ${activePageName.value}` })
        },
    },
] satisfies NavigationMenuItem[]

const buildSidebarMenuByPermissions = computed<NavigationMenuItem[]>(() => {
    const permissions = userStore.getPermissions
    const initialSidebarMenu = { ...INITIAL_SIDEBAR }
    const modules: NavigationMenuItem[] = []

    for (const item in permissions) {
        const menuItem: NavigationMenuItem = {
            label: 'Roles',
            description: 'Roles management',
            icon: 'i-lucide-user-shield',
            to: '/dashboard/roles',
            onSelect: () => {
                activePageName.value = 'Roles'
                useHead({ title: `Dashboard | ${activePageName.value}` })
            },
        }
    }

    const { analytics, master_data, transactions, user_management } = initialSidebarMenu
    return [...analytics, ...master_data, ...transactions, ...user_management]
})

const showModal = () => {
    open.value = !open.value
}

async function onLogout() {
    await authStore.logout()
}

onBeforeMount(() => {
    useHead({ title: `Dashboard | ${activePageName.value}` })
})
</script>
<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            id="default"
            v-model:open="open"
            collapsible
            resizable
            class="bg-elevated/25"
            :ui="{
                footer: 'lg:border-t lg:border-default bg-default',
                body: 'bg-default',
                header: 'bg-default',
            }"
        >
            <template #header="{ collapsed }">
                <div class="font-extrabold text-4xl flex justify-center text-amber-500 italic w-full">WMS.GO</div>
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />
                <div class="">{{ buildSidebarMenuByPermissions }}</div>
                <UNavigationMenu :collapsed="collapsed" :items="links" orientation="vertical" tooltip popover />
            </template>

            <template #footer="{ collapsed }">
                <div class="flex w-full flex-col gap-1">
                    <UButton
                        to="/dashboard/profile"
                        icon="i-lucide-circle-user-round"
                        :label="collapsed ? undefined : 'My profile'"
                        color="neutral"
                        variant="ghost"
                        class="w-full"
                        :block="collapsed"
                    />
                    <UButton
                        icon="i-lucide-log-out"
                        :label="collapsed ? undefined : 'Sign out'"
                        color="error"
                        variant="ghost"
                        class="w-full"
                        :block="collapsed"
                        @click="onLogout"
                    />
                </div>
            </template>
        </UDashboardSidebar>

        <UDashboardPanel hboardPanel id="home" :ui="{ body: 'bg-muted' }">
            <template #header>
                <UDashboardNavbar :title="activePageName" :ui="{ right: 'gap-3' }">
                    <template #leading>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <!-- <UButton
                            v-if="activePageName !== 'Dashboard'"
                            icon="i-lucide-plus"
                            size="md"
                            color="primary"
                            variant="solid"
                            @click="showModal"
                        >
                            New {{ activePageName }}
                        </UButton> -->
                        <UColorModeButton />
                    </template>
                </UDashboardNavbar>
            </template>

            <template #body>
                <Transition name="page" mode="out-in">
                    <div :key="$route.fullPath">
                        <slot />
                    </div>
                </Transition>
            </template>
        </UDashboardPanel>
    </UDashboardGroup>

    <!-- <UModal
        v-model:open="open"
        title="Modal with footer"
        :ui="{ footer: 'justify-end' }"
    >
        <template #body>
            <div class="">{{ activePageName }}</div>
        </template>

        <template #footer="{ close }">
            <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="close"
            />
            <UButton label="Submit" color="neutral" />
        </template>
    </UModal> -->
</template>
