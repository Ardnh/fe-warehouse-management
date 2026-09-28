<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, Location, Warehouse } from "~/models";
import type { WarehouseFormPayload } from "~/components/form/warehouse/FormCreateEditWarehouse.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";

const router = useRouter();
const warehouseStore = useWarehouseStore();
const locationStore = useLocationStore();
const { warehouses, warehousePagination } = storeToRefs(warehouseStore);
const { locations } = storeToRefs(locationStore);
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const openForm = ref(false);
const openDelete = ref(false);
const selected = ref<Warehouse>();
const search = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
const query = reactive<BaseParams>({ page: 1, page_size: 20, search: "" });
const columns = [
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h("div", [
                h(
                    "p",
                    { class: "font-medium text-highlighted" },
                    row.original.location?.name || row.original.location_id,
                ),
                h(
                    "p",
                    { class: "font-mono text-xs text-muted" },
                    row.original.location?.code || "-",
                ),
            ]),
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h(
                UBadge,
                { color: "neutral", variant: "subtle" },
                () => row.original.location?.type || "WAREHOUSE",
            ),
    },
    {
        accessorKey: "zones",
        header: "Zones",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            row.original.zones?.length ?? 0,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h(
                UBadge,
                {
                    color:
                        row.original.status === "ACTIVE"
                            ? "success"
                            : "neutral",
                    variant: "subtle",
                },
                () => (row.original.status === "ACTIVE" ? "Aktif" : "Nonaktif"),
            ),
    },
    {
        accessorKey: "updated_at",
        header: "Terakhir diubah",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                new Date(row.original.updated_at),
            ),
    },
    {
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h("div", { class: "flex justify-end gap-1" }, [
                h(UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    loading: warehouseStore.isLoading("warehouse.remove"),
                    "aria-label": "Hapus",
                    onClick: () => onDelete(row.original),
                }),
                h(UButton, {
                    icon: "i-lucide-pencil",
                    color: "neutral",
                    variant: "soft",
                    size: "sm",
                    "aria-label": "Edit",
                    onClick: () => onEdit(row.original),
                }),
                h(UButton, {
                    icon: "i-lucide-external-link",
                    color: "neutral",
                    variant: "soft",
                    size: "sm",
                    "aria-label": "Lihat",
                    onClick: () => onView(row.original),
                }),
            ]),
    },
];

const items = ref<BreadcrumbItem[]>([
    {
        label: "Docs",
        icon: "i-lucide-book-open",
        to: "/docs",
    },
    {
        label: "Components",
        icon: "i-lucide-box",
        to: "/docs/components",
    },
    {
        label: "Breadcrumb",
        icon: "i-lucide-link",
        to: "/docs/components/breadcrumb",
    },
]);

async function load() {
    await warehouseStore.findAllWarehouses({ ...query });
}
async function loadLocations() {
    await locationStore.findAllLocations({
        page: 1,
        page_size: 100,
        search: "",
    });
}
async function onEdit(item: Warehouse) {
    selected.value = item;
    openForm.value = true;
    const detail = await warehouseStore.findById(item.id);
    if (detail) selected.value = detail;
}
function onDelete(item: Warehouse) {
    selected.value = item;
    openDelete.value = true;
}
function onView(item: Warehouse) {
    const id = item.id;
    router.push(`/dashboard/warehouse/${id}`);
}
function closeForm() {
    openForm.value = false;
    selected.value = undefined;
}
async function onSubmit({ payload }: { payload: WarehouseFormPayload }) {
    try {
        if (selected.value)
            await warehouseStore.update(selected.value.id, payload);
        else
            await warehouseStore.create(
                payload as Extract<
                    WarehouseFormPayload,
                    { location_id: string }
                >,
            );
        toast.add({
            title: `Warehouse berhasil ${selected.value ? "diperbarui" : "dibuat"}`,
            color: "success",
        });
        closeForm();
        await load();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan warehouse",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}
async function confirmDelete() {
    if (!selected.value) return;
    try {
        await warehouseStore.deleteWarehouse(selected.value.id);
        openDelete.value = false;
        selected.value = undefined;
        if (warehouses.value.length === 1 && query.page > 1) query.page--;
        toast.add({ title: "Warehouse berhasil dihapus", color: "success" });
        await load();
    } catch {
        toast.add({ title: "Gagal menghapus warehouse", color: "error" });
    }
}
function pageChange(page: number) {
    query.page = page;
    load();
}
watch(search, (value) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        query.search = value.trim();
        query.page = 1;
        load();
    }, 300);
});
onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
});
onMounted(async () => {
    await Promise.all([load(), loadLocations()]);
});
definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | Warehouse" });
</script>
<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div class="flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
                <h1 class="text-xl font-semibold text-highlighted">
                    Warehouse
                </h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola warehouse berdasarkan location.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah warehouse"
                color="primary"
                @click="
                    selected = undefined;
                    openForm = true;
                "
            />
        </div>
        <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
            <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Cari location atau warehouse..."
                class="w-full sm:max-w-sm"
            />
            <p class="text-sm text-muted">
                {{ warehousePagination.total_items }} warehouse
            </p>
        </div>
        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-default"
        >
            <UTable
                :data="warehouses"
                :columns="columns"
                :loading="warehouseStore.isLoading('warehouse.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-220"
                :ui="{ root: 'border-0' }"
                :empty="
                    search
                        ? 'Warehouse tidak ditemukan.'
                        : 'Belum ada warehouse.'
                "
            />
        </div>
        <div class="flex justify-end">
            <UPagination
                v-if="warehousePagination.total_pages > 1"
                :page="warehousePagination.current_page"
                :page-count="warehousePagination.page_size"
                :total="warehousePagination.total_items"
                show-edges
                @update:page="pageChange"
            />
        </div>
        <FormWarehouseFormCreateEditWarehouse
            v-model:open="openForm"
            :data="selected"
            :locations="locations"
            :loading="
                warehouseStore.isLoading('warehouse.create') ||
                warehouseStore.isLoading('warehouse.update') ||
                warehouseStore.isLoading('warehouse.findById')
            "
            @close="closeForm"
            @submit="onSubmit"
        /><DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selected?.location?.name || selected?.location_id"
            :loading="warehouseStore.isLoading('warehouse.remove')"
            @delete="confirmDelete"
        />
    </div>
</template>
