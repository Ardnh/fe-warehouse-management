<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, User } from "~/models";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";
import type { UserFormPayload } from "~/components/form/user/FormCreateEditUser.vue";

const userStore = useUserStore();
const roleStore = useRoleStore();
const { users, userPagination } = storeToRefs(userStore);
const { roles } = storeToRefs(roleStore);
const toast = useToast();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const openForm = ref(false);
const openDelete = ref(false);
const selectedUser = ref<User>();
const search = ref("");
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const query = reactive<BaseParams>({
    page: 1,
    page_size: 20,
    search: "",
});

const statusColor = (status: string) =>
    status === "ACTIVE" ? "success" : "neutral";

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
    }).format(new Date(value));

const columns = [
    {
        accessorKey: "full_name",
        header: "Nama",
        cell: ({ row }: { row: Row<User> }) =>
            h("div", { class: "min-w-40" }, [
                h(
                    "p",
                    { class: "font-medium text-highlighted" },
                    row.original.full_name,
                ),
                h(
                    "p",
                    { class: "text-xs text-muted" },
                    `@${row.original.username}`,
                ),
            ]),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<User> }) =>
            h(
                UBadge,
                {
                    color: statusColor(row.original.status),
                    variant: "subtle",
                    class: "capitalize",
                },
                () => (row.original.status === "ACTIVE" ? "Aktif" : "Nonaktif"),
            ),
    },
    {
        accessorKey: "updated_at",
        header: "Terakhir diubah",
        cell: ({ row }: { row: Row<User> }) =>
            formatDate(row.original.updated_at),
    },
    {
        id: "actions",
        meta: {
            class: {
                th: "text-right",
                td: "text-right",
            },
        },
        cell: ({ row }: { row: Row<User> }) =>
            h("div", { class: "flex justify-end gap-1" }, [
                h(UButton, {
                    icon: "i-lucide-pencil",
                    color: "neutral",
                    variant: "soft",
                    size: "sm",
                    "aria-label": `Edit ${row.original.username}`,
                    onClick: () => onEdit(row.original),
                }),
                h(UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    "aria-label": `Hapus ${row.original.username}`,
                    loading: userStore.isLoading("deleteUser"),
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];

async function loadUsers() {
    try {
        await userStore.findAllUsers({ ...query });
    } catch (error) {
        toast.add({
            title: "Gagal memuat user",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function loadRoles() {
    try {
        await roleStore.findAllRoles({
            page: 1,
            page_size: 100,
            search: "",
        });
    } catch {
        toast.add({
            title: "Gagal memuat role",
            description: "Role tidak dapat dimuat. Coba buka halaman ini lagi.",
            color: "warning",
            icon: "i-lucide-triangle-alert",
        });
    }
}

async function onEdit(user: User) {
    selectedUser.value = user;
    openForm.value = true;

    try {
        const detail = await userStore.findById(user.id);
        if (detail) selectedUser.value = detail;
    } catch {
        toast.add({
            title: "Gagal memuat detail user",
            description: "Data yang tersedia dari daftar tetap dapat diedit.",
            color: "warning",
        });
    }
}

function onDelete(user: User) {
    selectedUser.value = user;
    openDelete.value = true;
}

function closeForm() {
    openForm.value = false;
    selectedUser.value = undefined;
}

async function onFormSubmit({ payload }: { payload: UserFormPayload }) {
    try {
        if (selectedUser.value) {
            await userStore.update(selectedUser.value.id, payload);
            toast.add({ title: "User berhasil diperbarui", color: "success" });
        } else {
            await userStore.create(payload);
            toast.add({ title: "User berhasil dibuat", color: "success" });
        }
        closeForm();
        await loadUsers();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan user",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onDeleteConfirmed() {
    if (!selectedUser.value) return;

    try {
        await userStore.deleteUser(selectedUser.value.id);
        openDelete.value = false;
        toast.add({ title: "User berhasil dihapus", color: "success" });
        selectedUser.value = undefined;
        if (users.value.length === 1 && query.page > 1) query.page -= 1;
        await loadUsers();
    } catch (error) {
        toast.add({
            title: "Gagal menghapus user",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}

function onPageChange(page: number) {
    query.page = page;
    loadUsers();
}

watch(search, (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        query.search = value.trim();
        query.page = 1;
        loadUsers();
    }, 300);
});

onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer);
});

onMounted(async () => {
    await Promise.all([loadUsers(), loadRoles()]);
});

definePageMeta({
    layout: "dashboard",
    ssr: false,
});

useHead({ title: "Dashboard | Users" });
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-5 p-4 sm:p-6">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">Users</h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola akses dan akun pengguna warehouse.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah user"
                color="primary"
                @click="
                    selectedUser = undefined;
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
                placeholder="Cari nama, username, atau email..."
                class="w-full sm:max-w-sm"
                aria-label="Cari user"
            />
            <p class="text-sm text-muted">
                {{ userPagination.total_items }} user
            </p>
        </div>

        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
        >
            <UTable
                :data="users"
                :columns="columns"
                :loading="userStore.isLoading('findAllUsers')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-190"
                :ui="{ root: 'border-0' }"
                :empty="search ? 'User tidak ditemukan.' : 'Belum ada user.'"
            />
        </div>

        <div class="flex justify-end">
            <UPagination
                v-if="userPagination.total_pages > 1"
                :page="userPagination.current_page"
                :page-count="userPagination.page_size"
                :total="userPagination.total_items"
                show-edges
                @update:page="onPageChange"
            />
        </div>

        <FormUserFormCreateEditUser
            v-model:open="openForm"
            :data="selectedUser"
            :roles="roles"
            :loading="
                userStore.isLoading('createUser') ||
                userStore.isLoading('updateUser') ||
                userStore.isLoading('findById')
            "
            @close="closeForm"
            @submit="onFormSubmit"
        />

        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selectedUser?.full_name"
            :loading="userStore.isLoading('deleteUser')"
            @delete="onDeleteConfirmed"
        />
    </div>
</template>
