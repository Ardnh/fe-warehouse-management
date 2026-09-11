<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, Uom } from "~/models";
import type { UomFormPayload } from "~/components/form/uom/FormCreateEditUom.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";

const uomStore = useUomStore();
const { uoms, uomPagination } = storeToRefs(uomStore);
const toast = useToast();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const openForm = ref(false);
const openDelete = ref(false);
const selectedUom = ref<Uom>();
const search = ref("");
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const query = reactive<BaseParams>({ page: 1, page_size: 20, search: "" });

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
        new Date(value),
    );

const columns = [
    {
        accessorKey: "code",
        header: "Kode",
        cell: ({ row }: { row: Row<Uom> }) =>
            h(
                "span",
                { class: "font-mono text-sm font-semibold text-highlighted" },
                row.original.code,
            ),
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }: { row: Row<Uom> }) =>
            h(
                "span",
                { class: "font-medium text-highlighted" },
                row.original.name,
            ),
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }: { row: Row<Uom> }) =>
            h(
                UBadge,
                { color: "primary", variant: "subtle" },
                () => row.original.type,
            ),
    },
    {
        accessorKey: "updated_at",
        header: "Terakhir diubah",
        cell: ({ row }: { row: Row<Uom> }) =>
            formatDate(row.original.updated_at),
    },
    {
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<Uom> }) =>
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
                    loading: uomStore.isLoading("uom.remove"),
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];

async function loadUoms() {
    try {
        await uomStore.findAllUoms({ ...query });
    } catch (error) {
        toast.add({
            title: "Gagal memuat UOM",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onEdit(uom: Uom) {
    selectedUom.value = uom;
    openForm.value = true;

    try {
        const detail = await uomStore.findById(uom.id);
        if (detail) selectedUom.value = detail;
    } catch {
        toast.add({
            title: "Gagal memuat detail UOM",
            description: "Data dari daftar tetap dapat diedit.",
            color: "warning",
        });
    }
}

function onDelete(uom: Uom) {
    selectedUom.value = uom;
    openDelete.value = true;
}

function closeForm() {
    openForm.value = false;
    selectedUom.value = undefined;
}

async function onFormSubmit({ payload }: { payload: UomFormPayload }) {
    try {
        if (selectedUom.value) {
            await uomStore.update(selectedUom.value.id, payload);
            toast.add({ title: "UOM berhasil diperbarui", color: "success" });
        } else {
            await uomStore.create(
                payload as Extract<UomFormPayload, { code: string }>,
            );
            toast.add({ title: "UOM berhasil dibuat", color: "success" });
        }
        closeForm();
        await loadUoms();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan UOM",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onDeleteConfirmed() {
    if (!selectedUom.value) return;

    try {
        await uomStore.deleteUom(selectedUom.value.id);
        openDelete.value = false;
        selectedUom.value = undefined;
        if (uoms.value.length === 1 && query.page > 1) query.page -= 1;
        toast.add({ title: "UOM berhasil dihapus", color: "success" });
        await loadUoms();
    } catch (error) {
        toast.add({
            title: "Gagal menghapus UOM",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}

function onPageChange(page: number) {
    query.page = page;
    loadUoms();
}

watch(search, (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        query.search = value.trim();
        query.page = 1;
        loadUoms();
    }, 300);
});

onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer);
});

onMounted(loadUoms);
definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | UOMs" });
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">UOMs</h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola satuan ukuran yang digunakan dalam operasional
                    warehouse.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah UOM"
                color="primary"
                @click="
                    selectedUom = undefined;
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
                placeholder="Cari kode, nama, atau tipe..."
                class="w-full sm:max-w-sm"
                aria-label="Cari UOM"
            />
            <p class="text-sm text-muted">
                {{ uomPagination.total_items }} UOM
            </p>
        </div>

        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
        >
            <UTable
                :data="uoms"
                :columns="columns"
                :loading="uomStore.isLoading('uom.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-180"
                :ui="{ root: 'border-0' }"
                :empty="search ? 'UOM tidak ditemukan.' : 'Belum ada UOM.'"
            />
        </div>

        <div class="flex justify-end">
            <UPagination
                v-if="uomPagination.total_pages > 1"
                :page="uomPagination.current_page"
                :page-count="uomPagination.page_size"
                :total="uomPagination.total_items"
                show-edges
                @update:page="onPageChange"
            />
        </div>

        <FormUomFormCreateEditUom
            v-model:open="openForm"
            :data="selectedUom"
            :loading="
                uomStore.isLoading('uom.create') ||
                uomStore.isLoading('uom.update') ||
                uomStore.isLoading('uom.findById')
            "
            @close="closeForm"
            @submit="onFormSubmit"
        />

        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selectedUom?.name"
            :loading="uomStore.isLoading('uom.remove')"
            @delete="onDeleteConfirmed"
        />
    </div>
</template>
