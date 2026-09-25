<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, Customer, InboundOrder, Product } from "~/models";
import type { InboundOrderFormPayload } from "~/components/form/inbound-order/FormCreateEditInboundOrder.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";
const store = useInboundOrderStore();
const customerStore = useCustomerStore();
const productStore = useProductStore();
const { orders, pagination } = storeToRefs(store);
const { customers } = storeToRefs(customerStore);
const { products } = storeToRefs(productStore);
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const USelect = resolveComponent("USelect");
const openForm = ref(false);
const openDelete = ref(false);
const selected = ref<InboundOrder>();
const search = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
const query = reactive<BaseParams>({ page: 1, page_size: 20, search: "" });
const statuses = [
    "DRAFT",
    "OPEN",
    "PARTIALLY_RECEIVED",
    "RECEIVED",
    "CANCELLED",
];
const statusOptions = statuses.map((value) => ({
    label: value.replaceAll("_", " "),
    value,
}));
const statusColor = (status: string) =>
    status === "RECEIVED"
        ? "success"
        : status === "CANCELLED"
          ? "error"
          : status === "OPEN" || status === "PARTIALLY_RECEIVED"
            ? "primary"
            : "neutral";
const columns = [
    {
        accessorKey: "order_number",
        header: "Order number",
        cell: ({ row }: { row: Row<InboundOrder> }) =>
            h(
                "span",
                { class: "font-mono font-semibold text-highlighted" },
                row.original.order_number,
            ),
    },
    {
        accessorKey: "customer_id",
        header: "Customer",
        cell: ({ row }: { row: Row<InboundOrder> }) =>
            customers.value.find((x) => x.id === row.original.customer_id)
                ?.name || row.original.customer_id,
    },
    {
        accessorKey: "expected_arrival_at",
        header: "Expected arrival",
        cell: ({ row }: { row: Row<InboundOrder> }) =>
            row.original.expected_arrival_at
                ? new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                  }).format(new Date(row.original.expected_arrival_at))
                : "-",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<InboundOrder> }) =>
            h(
                UBadge,
                { color: statusColor(row.original.status), variant: "subtle" },
                () => row.original.status.replaceAll("_", " "),
            ),
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }: { row: Row<InboundOrder> }) =>
            row.original.items?.length ?? "-",
    },
    {
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<InboundOrder> }) =>
            h("div", { class: "flex justify-end gap-1" }, [
                h(USelect, {
                    modelValue: row.original.status,
                    items: statusOptions,
                    valueKey: "value",
                    size: "sm",
                    class: "w-36",
                    "aria-label": "Update status",
                    onUpdateModelValue: (value: string) =>
                        changeStatus(row.original, value),
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
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    loading: store.isLoading("inboundOrder.remove"),
                    "aria-label": "Hapus",
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];
async function load() {
    await store.findAll({ ...query });
}
async function loadOptions() {
    await Promise.all([
        customerStore.findAllCustomers({ page: 1, page_size: 100, search: "" }),
        productStore.findAllProducts({ page: 1, page_size: 100, search: "" }),
    ]);
}
async function onEdit(item: InboundOrder) {
    selected.value = item;
    openForm.value = true;
    const detail = await store.findById(item.id);
    if (detail) {
        selected.value = detail;
        if (!detail.items) await store.findAllItems(item.id);
    }
}
function onDelete(item: InboundOrder) {
    selected.value = item;
    openDelete.value = true;
}
function closeForm() {
    openForm.value = false;
    selected.value = undefined;
}
async function onSubmit({ payload }: { payload: InboundOrderFormPayload }) {
    try {
        if (selected.value) await store.update(selected.value.id, payload);
        else
            await store.create(
                payload as Extract<
                    InboundOrderFormPayload,
                    { customer_id: string }
                >,
            );
        toast.add({
            title: `Inbound order berhasil ${selected.value ? "diperbarui" : "dibuat"}`,
            color: "success",
        });
        closeForm();
        await load();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan inbound order",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}
async function changeStatus(item: InboundOrder, status: string) {
    if (status === item.status) return;
    try {
        await store.updateStatus(item.id, { status });
        item.status = status;
        toast.add({ title: "Status berhasil diperbarui", color: "success" });
    } catch {
        toast.add({ title: "Gagal memperbarui status", color: "error" });
    }
}
async function confirmDelete() {
    if (!selected.value) return;
    try {
        await store.deleteOrder(selected.value.id);
        openDelete.value = false;
        selected.value = undefined;
        if (orders.value.length === 1 && query.page > 1) query.page--;
        toast.add({
            title: "Inbound order berhasil dihapus",
            color: "success",
        });
        await load();
    } catch {
        toast.add({ title: "Gagal menghapus inbound order", color: "error" });
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
useHead({ title: "Dashboard | Inbound Orders" });
</script>
<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">
                    Inbound Orders
                </h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola penerimaan barang dari customer.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah inbound order"
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
                placeholder="Cari order number..."
                class="w-full sm:max-w-sm"
            />
            <p class="text-sm text-muted">{{ pagination.total_items }} order</p>
        </div>
        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
        >
            <UTable
                :data="orders"
                :columns="columns"
                :loading="store.isLoading('inboundOrder.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-250"
                :ui="{ root: 'border-0' }"
                :empty="
                    search
                        ? 'Order tidak ditemukan.'
                        : 'Belum ada inbound order.'
                "
            />
        </div>
        <div class="flex justify-end">
            <UPagination
                v-if="pagination.total_pages > 1"
                :page="pagination.current_page"
                :page-count="pagination.page_size"
                :total="pagination.total_items"
                show-edges
                @update:page="pageChange"
            />
        </div>
        <FormInboundOrderFormCreateEditInboundOrder
            v-model:open="openForm"
            :data="selected"
            :customers="customers"
            :products="products"
            :loading="
                store.isLoading('inboundOrder.create') ||
                store.isLoading('inboundOrder.update') ||
                store.isLoading('inboundOrder.findById')
            "
            @close="closeForm"
            @submit="onSubmit"
        />
        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selected?.order_number"
            :loading="store.isLoading('inboundOrder.remove')"
            @delete="confirmDelete"
        />
    </div>
</template>
