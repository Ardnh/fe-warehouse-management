<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, Customer } from "~/models";
import type { CustomerFormPayload } from "~/components/form/customer/FormCreateEditCustomer.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";

const store = useCustomerStore();
const { customers, customerPagination } = storeToRefs(store);
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const openForm = ref(false);
const openDelete = ref(false);
const selected = ref<Customer>();
const search = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
const query = reactive<BaseParams>({ page: 1, page_size: 20, search: "" });
const columns = [
    {
        accessorKey: "code",
        header: "Kode",
        cell: ({ row }: { row: Row<Customer> }) =>
            h(
                "span",
                { class: "font-mono font-semibold text-highlighted" },
                row.original.code,
            ),
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }: { row: Row<Customer> }) =>
            h("div", [
                h(
                    "p",
                    { class: "font-medium text-highlighted" },
                    row.original.name,
                ),
                h("p", { class: "text-xs text-muted" }, row.original.email),
            ]),
    },
    { accessorKey: "phone", header: "Telepon" },
    {
        accessorKey: "address",
        header: "Alamat",
        cell: ({ row }: { row: Row<Customer> }) =>
            h(
                "span",
                { class: "line-clamp-2 max-w-sm text-sm text-muted" },
                row.original.address,
            ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Customer> }) =>
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
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<Customer> }) =>
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
                    loading: store.isLoading("customer.remove"),
                    "aria-label": `Hapus ${row.original.name}`,
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];
async function load() {
    await store.findAllCustomers({ ...query });
}
async function onEdit(item: Customer) {
    selected.value = item;
    openForm.value = true;
    const detail = await store.findById(item.id);
    if (detail) selected.value = detail;
}
function onDelete(item: Customer) {
    selected.value = item;
    openDelete.value = true;
}
function closeForm() {
    openForm.value = false;
    selected.value = undefined;
}
async function onSubmit({ payload }: { payload: CustomerFormPayload }) {
    try {
        if (selected.value)
            await store.update(
                selected.value.id,
                payload as Exclude<CustomerFormPayload, { code: string }>,
            );
        else
            await store.create(
                payload as Extract<CustomerFormPayload, { code: string }>,
            );
        toast.add({
            title: `Customer berhasil ${selected.value ? "diperbarui" : "dibuat"}`,
            color: "success",
        });
        closeForm();
        await load();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan customer",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}
async function confirmDelete() {
    if (!selected.value) return;
    try {
        await store.deleteCustomer(selected.value.id);
        openDelete.value = false;
        selected.value = undefined;
        if (customers.value.length === 1 && query.page > 1) query.page--;
        toast.add({ title: "Customer berhasil dihapus", color: "success" });
        await load();
    } catch (error) {
        toast.add({
            title: "Gagal menghapus customer",
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
onMounted(load);
definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | Customer" });
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">
                    Customers
                </h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola data customer dan kontaknya.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah customer"
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
                placeholder="Cari kode, nama, email, atau telepon..."
                class="w-full sm:max-w-sm"
            />
            <p class="text-sm text-muted">
                {{ customerPagination.total_items }} customer
            </p>
        </div>
        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
        >
            <UTable
                :data="customers"
                :columns="columns"
                :loading="store.isLoading('customer.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-220"
                :ui="{ root: 'border-0' }"
                :empty="
                    search ? 'Customer tidak ditemukan.' : 'Belum ada customer.'
                "
            />
        </div>
        <div class="flex justify-end">
            <UPagination
                v-if="customerPagination.total_pages > 1"
                :page="customerPagination.current_page"
                :page-count="customerPagination.page_size"
                :total="customerPagination.total_items"
                show-edges
                @update:page="pageChange"
            />
        </div>
        <FormCustomerFormCreateEditCustomer
            v-model:open="openForm"
            :data="selected"
            :loading="
                store.isLoading('customer.create') ||
                store.isLoading('customer.update') ||
                store.isLoading('customer.findById')
            "
            @close="closeForm"
            @submit="onSubmit"
        />
        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selected?.name"
            :loading="store.isLoading('customer.remove')"
            @delete="confirmDelete"
        />
    </div>
</template>
