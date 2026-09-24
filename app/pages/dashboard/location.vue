<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { BaseParams, Location } from "~/models";
import type { LocationFormPayload } from "~/components/form/location/FormCreateEditLocation.vue";
import DeleteConfirmationModal from "~/components/modal/DeleteConfirmationModal.vue";

const locationStore = useLocationStore();
const { locations, locationPagination } = storeToRefs(locationStore);
const toast = useToast();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const openForm = ref(false);
const openDelete = ref(false);
const selectedLocation = ref<Location>();
const search = ref("");
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const query = reactive<BaseParams>({ page: 1, page_size: 20, search: "" });

const columns = [
    {
        accessorKey: "code",
        header: "Kode",
        cell: ({ row }: { row: Row<Location> }) =>
            h(
                "span",
                { class: "font-mono text-sm font-semibold text-highlighted" },
                row.original.code,
            ),
    },
    {
        accessorKey: "name",
        header: "Nama location",
        cell: ({ row }: { row: Row<Location> }) =>
            h("div", { class: "min-w-48" }, [
                h(
                    "p",
                    { class: "font-medium text-highlighted" },
                    row.original.name,
                ),
                h(
                    "p",
                    { class: "text-xs text-muted" },
                    row.original.city || "Kota belum diisi",
                ),
            ]),
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }: { row: Row<Location> }) =>
            h(
                UBadge,
                {
                    color: row.original.type === "HO" ? "primary" : "neutral",
                    variant: "subtle",
                },
                () =>
                    row.original.type === "HO" ? "Head Office" : "Warehouse",
            ),
    },
    {
        accessorKey: "address",
        header: "Alamat",
        cell: ({ row }: { row: Row<Location> }) =>
            h(
                "span",
                { class: "line-clamp-2 max-w-sm text-sm text-muted" },
                row.original.address || "-",
            ),
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }: { row: Row<Location> }) =>
            h(
                UBadge,
                {
                    color: row.original.is_active ? "success" : "neutral",
                    variant: "subtle",
                },
                () => (row.original.is_active ? "Aktif" : "Nonaktif"),
            ),
    },
    {
        id: "actions",
        meta: { class: { th: "text-right", td: "text-right" } },
        cell: ({ row }: { row: Row<Location> }) =>
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
                    loading: locationStore.isLoading("location.remove"),
                    onClick: () => onDelete(row.original),
                }),
            ]),
    },
];

async function loadLocations() {
    try {
        await locationStore.findAllLocations({ ...query });
    } catch (error) {
        toast.add({
            title: "Gagal memuat location",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onEdit(location: Location) {
    selectedLocation.value = location;
    openForm.value = true;

    try {
        const detail = await locationStore.findById(location.id);
        if (detail) selectedLocation.value = detail;
    } catch {
        toast.add({
            title: "Gagal memuat detail location",
            description: "Data dari daftar tetap dapat diedit.",
            color: "warning",
        });
    }
}

function onDelete(location: Location) {
    selectedLocation.value = location;
    openDelete.value = true;
}

function closeForm() {
    openForm.value = false;
    selectedLocation.value = undefined;
}

async function onFormSubmit({ payload }: { payload: LocationFormPayload }) {
    try {
        if (selectedLocation.value) {
            await locationStore.update(selectedLocation.value.id, payload);
            toast.add({
                title: "Location berhasil diperbarui",
                color: "success",
            });
        } else {
            await locationStore.create(
                payload as Extract<LocationFormPayload, { code: string }>,
            );
            toast.add({ title: "Location berhasil dibuat", color: "success" });
        }
        closeForm();
        await loadLocations();
    } catch (error) {
        toast.add({
            title: "Gagal menyimpan location",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

async function onDeleteConfirmed() {
    if (!selectedLocation.value) return;

    try {
        await locationStore.deleteLocation(selectedLocation.value.id);
        openDelete.value = false;
        selectedLocation.value = undefined;
        if (locations.value.length === 1 && query.page > 1) query.page -= 1;
        toast.add({ title: "Location berhasil dihapus", color: "success" });
        await loadLocations();
    } catch (error) {
        toast.add({
            title: "Gagal menghapus location",
            description:
                error instanceof Error ? error.message : "Silakan coba lagi.",
            color: "error",
        });
    }
}

function onPageChange(page: number) {
    query.page = page;
    loadLocations();
}

watch(search, (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        query.search = value.trim();
        query.page = 1;
        loadLocations();
    }, 300);
});

onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer);
});

onMounted(loadLocations);
definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | Locations" });
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div>
                <h1 class="text-xl font-semibold text-highlighted">
                    Locations
                </h1>
                <p class="mt-1 text-sm text-muted">
                    Kelola head office dan lokasi warehouse.
                </p>
            </div>
            <UButton
                icon="i-lucide-plus"
                label="Tambah location"
                color="primary"
                @click="
                    selectedLocation = undefined;
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
                placeholder="Cari kode, nama, kota, atau alamat..."
                class="w-full sm:max-w-sm"
                aria-label="Cari location"
            />
            <p class="text-sm text-muted">
                {{ locationPagination.total_items }} location
            </p>
        </div>

        <div
            class="min-h-0 flex-1 overflow-auto rounded-lg border border-default bg-white dark:bg-neutral-900"
        >
            <UTable
                :data="locations"
                :columns="columns"
                :loading="locationStore.isLoading('location.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-240"
                :ui="{ root: 'border-0' }"
                :empty="
                    search ? 'Location tidak ditemukan.' : 'Belum ada location.'
                "
            />
        </div>

        <div class="flex justify-end">
            <UPagination
                v-if="locationPagination.total_pages > 1"
                :page="locationPagination.current_page"
                :page-count="locationPagination.page_size"
                :total="locationPagination.total_items"
                show-edges
                @update:page="onPageChange"
            />
        </div>

        <FormLocationFormCreateEditLocation
            v-model:open="openForm"
            :data="selectedLocation"
            :loading="
                locationStore.isLoading('location.create') ||
                locationStore.isLoading('location.update') ||
                locationStore.isLoading('location.findById')
            "
            @close="closeForm"
            @submit="onFormSubmit"
        />

        <DeleteConfirmationModal
            v-model:open="openDelete"
            :item-name="selectedLocation?.name"
            :loading="locationStore.isLoading('location.remove')"
            @delete="onDeleteConfirmed"
        />
    </div>
</template>
