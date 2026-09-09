<script setup lang="ts">
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal.vue";
import type { FindAllPermissionParams, Role } from "~/models";
import type { Row } from "@tanstack/vue-table";

const roleStore = useRoleStore();
const { roles, rolesPagination } = storeToRefs(roleStore);

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const openModal = ref(false);
const openModalDelete = ref(false);
const tempRoleData = ref<Role>();
const query = ref<FindAllPermissionParams>({
    page: 1,
    page_size: 50,
    search: "",
    sort_by: "",
    sort_dir: "",
});

const columns = ref([
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }: { row: Row<Role> }) => {
            return h("div", { class: "flex items-center justify-end gap-1" }, [
                h(UButton, {
                    icon: "i-lucide-pencil",
                    color: "neutral",
                    variant: "soft",
                    size: "sm",
                    "aria-label": "Edit",
                    onClick: () => {
                        openModal.value = true;
                        tempRoleData.value = row.original;
                    },
                }),
                h(UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    loading: roleStore.isLoading("deleteRole"),
                    "aria-label": "Delete",
                    onClick: () => {
                        onDeleteRole(row.original);
                    },
                }),
            ]);
        },
    },
]);

const onCloseModal = () => {
    openModal.value = false;
    tempRoleData.value = undefined;
};

const onDeleteRole = (row: Role) => {
    openModalDelete.value = true;
    tempRoleData.value = row;
};

const onDeleteRoleConfirmed = async () => {
    if (!tempRoleData.value) return;
    await roleStore.deleteRole(tempRoleData.value.id);
    openModalDelete.value = false;
    tempRoleData.value = undefined;
    await roleStore.findAllRoles(query.value);
};

const onSubmit = async (data: any) => {
    if (data.action === "create") {
        await roleStore.createRole(data.payload);
    } else {
        await roleStore.updateRole(data.id, data.payload);
    }

    onCloseModal();
    await roleStore.findAllRoles(query.value);
};

onMounted(async () => {
    await roleStore.findAllRoles(query.value);
});
</script>

<template>
    <div class="w-full flex justify-end items-center">
        <UButton icon="i-lucide-plus" @click="openModal = true">Roles</UButton>
    </div>

    <UTable
        :data="roles"
        :columns="columns"
        :loading="roleStore.isLoading('findAllRoles') ?? false"
        loading-color="primary"
        loading-animation="carousel"
        class="flex-1"
        :pagination="{
            pageIndex: rolesPagination.current_page,
            pageSize: rolesPagination.page_size,
        }"
        :ui="{
            root: 'bg-white mt-3 border border-gray-200 rounded-lg',
        }"
    />

    <FormRoleFormCreateEditRole
        v-model:open="openModal"
        :data="tempRoleData"
        :loading="roleStore.isLoading('findAllRoles') ?? false"
        @close="onCloseModal"
        @submit="onSubmit"
    />
    <DeleteConfirmationModal
        v-model:open="openModalDelete"
        :item-name="tempRoleData?.name"
        @delete="onDeleteRoleConfirmed"
    />
</template>
