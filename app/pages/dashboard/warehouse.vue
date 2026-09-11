<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, Warehouse } from "~/models";
import type { WarehouseFormPayload } from "~/components/form/warehouse/FormCreateEditWarehouse.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";

const warehouseStore = useWarehouseStore();
const { warehouses, warehousePagination } = storeToRefs(warehouseStore);
const toast = useToast();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const openForm = ref(false);
const openDelete = ref(false);
const selectedWarehouse = ref<Warehouse>();
const search = ref("");
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const query = reactive<BaseParams>({
    page: 1,
    page_size: 20,
    search: "",
});

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
        new Date(value),
    );

const columns = [
    {
        accessorKey: "code",
        header: "Kode",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h(
                "span",
                { class: "font-mono text-sm font-semibold text-highlighted" },
                row.original.code,
            ),
    },
    {
        accessorKey: "name",
        header: "Nama warehouse",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h("div", { class: "min-w-48" }, [
                h(
                    "p",
                    { class: "font-medium text-highlighted" },
                    row.original.name,
                ),
                h(
                    "p",
                    { class: "line-clamp-1 text-xs text-muted" },
                    row.original.address,
                ),
            ]),
    },
    {
        accessorKey: "address",
        header: "Alamat",
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h(
                "span",
                { class: "line-clamp-2 max-w-sm text-sm text-muted" },
                row.original.address,
            ),
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
            formatDate(row.original.updated_at),
    },
    {
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<Warehouse> }) =>
            h("div", { class: "flex justify-end gap-1" }, [
                h(UButton, {
                    icon: "i-lucide-pencil",
                    color: "neutral",
                    variant: "soft",
                    size: "sm",
                    "aria-label": `Edit ${row.original.name}`,
                    onClick: () => onEdit(row.original),
                }),
                h(UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    "aria-label": `Hapus ${row.original.name}`,
                    loading: warehouseStore.isLoading("warehouse.remove"),
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];

async function loadWarehouses() {
    try {
        await warehouseStore.findAllWarehouses({ ...query });
    } catch (error) {
        toast.add({
            title: "Gagal memuat warehouse",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onEdit(warehouse: Warehouse) {
    selectedWarehouse.value = warehouse;
    openForm.value = true;

    try {
        const detail = await warehouseStore.findById(warehouse.id);
        if (detail) selectedWarehouse.value = detail;
    } catch {
        toast.add({
            title: "Gagal memuat detail warehouse",
            description: "Data dari daftar tetap dapat diedit.",
            color: "warning",
        });
    }
}

function onDelete(warehouse: Warehouse) {
    selectedWarehouse.value = warehouse;
    openDelete.value = true;
}

function closeForm() {
    openForm.value = false;
    selectedWarehouse.value = undefined;
}

async function onFormSubmit({ payload }: { payload: WarehouseFormPayload }) {
    try {
        if (selectedWarehouse.value) {
            await warehouseStore.update(selectedWarehouse.value.id, payload);
            toast.add({
                title: "Warehouse berhasil diperbarui",
                color: "success",
            });
        } else {
            await warehouseStore.create(payload);
            toast.add({ title: "Warehouse berhasil dibuat", color: "success" });
        }
        closeForm();
        await loadWarehouses();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan warehouse",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onDeleteConfirmed() {
    if (!selectedWarehouse.value) return;

    try {
        await warehouseStore.deleteWarehouse(selectedWarehouse.value.id);
        openDelete.value = false;
        selectedWarehouse.value = undefined;
        if (warehouses.value.length === 1 && query.page > 1) query.page -= 1;
        toast.add({ title: "Warehouse berhasil dihapus", color: "success" });
        await loadWarehouses();
    } catch (error) {
        toast.add({
            title: "Gagal menghapus warehouse",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}

function onPageChange(page: number) {
    query.page = page;
    loadWarehouses();
}

watch(search, (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        query.search = value.trim();
        query.page = 1;
        loadWarehouses();
    }, 300);
});

onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer);
});

onMounted(loadWarehouses);

definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | Warehouse" });
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">
                    Warehouse
                </h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola lokasi dan status operasional warehouse.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah warehouse"
                color="primary"
                @click="
                    selectedWarehouse = undefined;
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
                placeholder="Cari kode, nama, atau alamat..."
                class="w-full sm:max-w-sm"
                aria-label="Cari warehouse"
            />
            <p class="text-sm text-muted">
                {{ warehousePagination.total_items }} warehouse
            </p>
        </div>

        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
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
                @update:page="onPageChange"
            />
        </div>

        <FormWarehouseFormCreateEditWarehouse
            v-model:open="openForm"
            :data="selectedWarehouse"
            :loading="
                warehouseStore.isLoading('warehouse.create') ||
                warehouseStore.isLoading('warehouse.update') ||
                warehouseStore.isLoading('warehouse.findById')
            "
            @close="closeForm"
            @submit="onFormSubmit"
        />

        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selectedWarehouse?.name"
            :loading="warehouseStore.isLoading('warehouse.remove')"
            @delete="onDeleteConfirmed"
        />
    </div>
</template>
