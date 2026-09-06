<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";

const route = useRoute();
const toast = useToast();

const open = ref(false);
const activePageName = ref("Dashboard");

const links = [
    {
        type: "label",
        label: "Analytics",
    },
    {
        label: "Overview",
        description: "Fully styled and customizable components for Nuxt.",
        icon: "i-lucide-house",
        to: "/dashboard",
    },
    {
        type: "label",
        label: "Master Data",
    },
    {
        label: "Customer",
        description: "Fully styled and customizable components for Nuxt.",
        icon: "i-lucide-users",
        to: "/dashboard/customer",
    },
    {
        label: "Product",
        description: "Learn how to install and configure Nuxt UI in your application.",
        icon: "i-lucide-package",
        to: "/dashboard/product",
    },
    {
        label: "Warehouse",
        description: "Fully styled and customizable components for Nuxt.",
        icon: "i-lucide-warehouse",
        to: "/dashboard/warehouse",
    },
    {
        label: "UOMS",
        description: "Learn how to install and configure Nuxt UI in your application.",
        icon: "i-lucide-ruler",
        to: "/dashboard/uoms",
    },
    {
        type: "label",
        label: "Transactions",
    },
    {
        label: "Inbound Orders",
        icon: "i-lucide-package-plus",
        description: "You have nothing to do, @nuxt/icon will handle it automatically.",
        to: "/dashboard/inbound-orders",
    },
    {
        label: "Receivings",
        icon: "i-lucide-clipboard-check",
        description: "Choose a primary and a neutral color from your Tailwind CSS theme.",
        to: "/dashboard/receivings",
    },
    {
        label: "Handling Unit",
        icon: "i-lucide-boxes",
        description: "You can customize components by using the `class` / `ui` props or in your app.config.ts.",
        to: "/dashboard/handling-unit",
    },
    {
        type: "label",
        label: "Users Management",
    },
    {
        label: "Users",
        description: "Fully styled and customizable components for Nuxt.",
        icon: "i-lucide-circle-user",
        to: "/dashboard/users",
    },
] satisfies NavigationMenuItem[];

const showModal = () => {
    open.value = !open.value;
};
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
                footer: 'lg:border-t lg:border-default',
            }"
        >
            <template #header="{ collapsed }">
                <!-- <TeamsMenu :collapsed="collapsed" /> -->
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

                <UNavigationMenu :collapsed="collapsed" :items="links" orientation="vertical" tooltip popover />
            </template>

            <template #footer="{ collapsed }">
                <UButton
                    :avatar="{
                        src: 'https://github.com/benjamincanac.png',
                        loading: 'lazy' as const,
                    }"
                    :label="collapsed ? undefined : 'Benjamin'"
                    color="neutral"
                    variant="ghost"
                    class="w-full"
                    :block="collapsed"
                />
            </template>
        </UDashboardSidebar>

        <UDashboardPanel hboardPanel id="home">
            <template #header>
                <UDashboardNavbar :title="activePageName" :ui="{ right: 'gap-3' }">
                    <template #leading>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <UButton v-if="activePageName !== 'Dashboard'" icon="i-lucide-plus" size="md" color="primary" variant="solid" @click="showModal">
                            New {{ activePageName }}
                        </UButton>
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

    <UModal v-model:open="open" title="Modal with footer" :ui="{ footer: 'justify-end' }">
        <template #body>
            <div class="">{{ activePageName }}</div>
        </template>

        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UButton label="Submit" color="neutral" />
        </template>
    </UModal>
</template>
