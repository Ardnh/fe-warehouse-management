<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type {
    BaseParams,
    CreateProductRequest,
    Customer,
    Product,
    Uom,
    UpdateProductRequest,
} from "~/models";
import type { ProductFormPayload } from "~/components/form/product/FormCreateEditProduct.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";

const store = useProductStore();
const customerStore = useCustomerStore();
const uomStore = useUomStore();
const { products, productPagination } = storeToRefs(store);
const { customers } = storeToRefs(customerStore);
const { uoms } = storeToRefs(uomStore);
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const openForm = ref(false);
const openDelete = ref(false);
const selected = ref<Product>();
const search = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
const query = reactive<BaseParams>({ page: 1, page_size: 20, search: "" });
const columns = [
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }: { row: Row<Product> }) =>
            h(
                "span",
                { class: "font-mono font-semibold text-highlighted" },
                row.original.sku,
            ),
    },
    {
        accessorKey: "name",
        header: "Nama product",
        cell: ({ row }: { row: Row<Product> }) =>
            h("div", [
                h(
                    "p",
                    { class: "font-medium text-highlighted" },
                    row.original.name,
                ),
                h(
                    "p",
                    { class: "text-xs text-muted" },
                    row.original.customer?.name || "Customer tidak tersedia",
                ),
            ]),
    },
    {
        accessorKey: "uom",
        header: "UOM",
        cell: ({ row }: { row: Row<Product> }) =>
            h(
                UBadge,
                { color: "primary", variant: "subtle" },
                () => row.original.uom?.code || row.original.uom_id,
            ),
    },
    {
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }: { row: Row<Product> }) => row.original.barcode || "-",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Product> }) =>
            h(
                UBadge,
                {
                    color:
                        row.original.status === "active"
                            ? "success"
                            : "neutral",
                    variant: "subtle",
                },
                () => (row.original.status === "active" ? "Aktif" : "Nonaktif"),
            ),
    },
    {
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<Product> }) =>
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
                    loading: store.isLoading("product.remove"),
                    "aria-label": `Hapus ${row.original.name}`,
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];
async function load() {
    await store.findAllProducts({ ...query });
}
async function loadOptions() {
    await Promise.all([
        customerStore.findAllCustomers({ page: 1, page_size: 100, search: "" }),
        uomStore.findAllUoms({ page: 1, page_size: 100, search: "" }),
    ]);
}
async function onEdit(item: Product) {
    selected.value = item;
    openForm.value = true;
    const detail = await store.findById(item.id);
    if (detail) selected.value = detail;
}
function onDelete(item: Product) {
    selected.value = item;
    openDelete.value = true;
}
function closeForm() {
    openForm.value = false;
    selected.value = undefined;
}
async function onSubmit({ payload }: { payload: ProductFormPayload }) {
    try {
        if (selected.value)
            await store.update(
                selected.value.id,
                payload as UpdateProductRequest,
            );
        else await store.create(payload as CreateProductRequest);
        toast.add({
            title: `Product berhasil ${selected.value ? "diperbarui" : "dibuat"}`,
            color: "success",
        });
        closeForm();
        await load();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan product",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}
async function confirmDelete() {
    if (!selected.value) return;
    try {
        await store.deleteProduct(selected.value.id);
        openDelete.value = false;
        selected.value = undefined;
        if (products.value.length === 1 && query.page > 1) query.page--;
        toast.add({ title: "Product berhasil dihapus", color: "success" });
        await load();
    } catch (error) {
        toast.add({
            title: "Gagal menghapus product",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
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
    await Promise.all([load(), loadOptions()]);
});
definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | Product" });
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">Products</h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola katalog product dan satuan ukurannya.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah product"
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
                placeholder="Cari SKU, nama, barcode, atau customer..."
                class="w-full sm:max-w-sm"
            />
            <p class="text-sm text-muted">
                {{ productPagination.total_items }} product
            </p>
        </div>
        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
        >
            <UTable
                :data="products"
                :columns="columns"
                :loading="store.isLoading('product.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-220"
                :ui="{ root: 'border-0' }"
                :empty="
                    search ? 'Product tidak ditemukan.' : 'Belum ada product.'
                "
            />
        </div>
        <div class="flex justify-end">
            <UPagination
                v-if="productPagination.total_pages > 1"
                :page="productPagination.current_page"
                :page-count="productPagination.page_size"
                :total="productPagination.total_items"
                show-edges
                @update:page="pageChange"
            />
        </div>
        <FormProductFormCreateEditProduct
            v-model:open="openForm"
            :data="selected"
            :customers="customers"
            :uoms="uoms"
            :loading="
                store.isLoading('product.create') ||
                store.isLoading('product.update') ||
                store.isLoading('product.findById')
            "
            @close="closeForm"
            @submit="onSubmit"
        />
        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selected?.name"
            :loading="store.isLoading('product.remove')"
            @delete="confirmDelete"
        />
    </div>
</template>
