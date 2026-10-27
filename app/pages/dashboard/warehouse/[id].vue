<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { BaseParams, InboundOrder, Zone, Warehouse } from '~/models'
import type { ZoneFormPayload } from '~/components/form/zone/FormCreateEditZone.vue'
import DeleteConfirmationModal from '~/components/modal/DeleteConfirmationModal.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const warehouseStore = useWarehouseStore()
const zoneStore = useZoneStore()
const { warehouse } = storeToRefs(warehouseStore)
const { zones, pagination } = storeToRefs(zoneStore)
const toast = useToast()
const openForm = ref(false)
const openDelete = ref(false)
const selectedZone = ref<Zone>()
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const statusColor = (status: string) => (status === 'ACTIVE' ? 'success' : 'neutral')

const columns = [
    {
        accessorKey: 'code',
        header: 'Kode',
        cell: ({ row }: { row: Row<Zone> }) => h('span', { class: 'font-mono font-semibold text-highlighted' }, row.original.code),
    },
    {
        accessorKey: 'name',
        header: 'Nama zone',
        cell: ({ row }: { row: Row<Zone> }) => h('span', { class: 'font-medium text-highlighted' }, row.original.name),
    },
    {
        accessorKey: 'type',
        header: 'Tipe',
        cell: ({ row }: { row: Row<Zone> }) => h(UBadge, { color: 'primary', variant: 'subtle' }, () => row.original.type),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: { row: Row<Zone> }) =>
            h(UBadge, { color: statusColor(row.original.status), variant: 'subtle' }, () => (row.original.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif')),
    },
    {
        id: 'actions',
        meta: { class: { th: 'text-right', td: 'text-right' } },
        cell: ({ row }: { row: Row<Zone> }) =>
            h('div', { class: 'flex justify-end gap-1' }, [
                h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    variant: 'soft',
                    size: 'sm',
                    loading: zoneStore.isLoading('zone.remove'),
                    'aria-label': 'Hapus',
                    onClick: () => onDelete(row.original),
                }),
                h(UButton, {
                    icon: 'i-lucide-pencil',
                    color: 'neutral',
                    variant: 'soft',
                    size: 'sm',
                    'aria-label': 'Edit',
                    onClick: () => onEdit(row.original),
                }),
                h(UButton, {
                    icon: 'i-lucide-external-link',
                    color: 'neutral',
                    variant: 'soft',
                    size: 'sm',
                    'aria-label': 'Lihat',
                    onClick: () => onView(row.original),
                }),
            ]),
    },
]
async function load() {
    await Promise.all([
        warehouseStore.findById(id),
        zoneStore.findByWarehouseId(
            {
                page: 1,
                page_size: 100,
                search: '',
            },
            id
        ),
    ])
}
async function onEdit(zone: Zone) {
    selectedZone.value = zone
    openForm.value = true
    const detail = await zoneStore.findById(zone.id)
    if (detail) selectedZone.value = detail
}
function onDelete(zone: Zone) {
    selectedZone.value = zone
    openDelete.value = true
}
function onView(zone: Zone) {
    console.log(zone)
}

function closeForm() {
    openForm.value = false
    selectedZone.value = undefined
}
async function onSubmit({ payload }: { payload: ZoneFormPayload }) {
    try {
        const result = selectedZone.value
            ? await zoneStore.update(selectedZone.value.id, payload)
            : await zoneStore.create(payload as Extract<ZoneFormPayload, { warehouse_id: string }>)
        if (!result.ok) {
            toast.add({ title: result.error?.message ?? 'Gagal menyimpan zone', color: 'error' })
            return
        }
        toast.add({
            title: `Zone berhasil ${selectedZone.value ? 'diperbarui' : 'dibuat'}`,
            color: 'success',
        })
        closeForm()
        await load()
    } catch (error) {
        toast.add({
            title: 'Gagal menyimpan zone',
            description: error instanceof Error ? error.message : 'Silakan coba lagi.',
            color: 'error',
        })
    }
}
async function confirmDelete() {
    if (!selectedZone.value) return
    try {
        const result = await zoneStore.deleteZone(selectedZone.value.id)
        if (!result.ok) {
            toast.add({ title: result.error?.message ?? 'Gagal menghapus zone', color: 'error' })
            return
        }
        openDelete.value = false
        selectedZone.value = undefined
        toast.add({ title: 'Zone berhasil dihapus', color: 'success' })
        await load()
    } catch {
        toast.add({ title: 'Gagal menghapus zone', color: 'error' })
    }
}

function onCreateZone() {
    selectedZone.value = undefined
    openForm.value = true
}

definePageMeta({ layout: 'dashboard', ssr: false })
useHead({ title: 'Dashboard | Warehouse Detail' })
onMounted(load)
</script>
<template>
    <div class="flex h-full min-h-0 flex-col gap-5">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div class="flex items-start gap-3">
                <UButton icon="i-lucide-arrow-left" color="neutral" variant="soft" aria-label="Kembali" @click="router.push('/dashboard/warehouse')" />
                <div>
                    <h1 class="text-xl font-semibold text-highlighted">
                        {{ warehouse?.location?.name || 'Warehouse detail' }}
                    </h1>
                    <p class="mt-1 font-mono text-sm text-muted">
                        {{ warehouse?.location?.code || id }}
                    </p>
                </div>
            </div>
            <UBadge v-if="warehouse" :color="statusColor(warehouse.status)" variant="subtle">
                {{ warehouse.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif' }}
            </UBadge>
        </div>
        <div v-if="warehouse" class="grid gap-4 sm:grid-cols-3">
            <UCard
                ><p class="text-xs text-muted">Location</p>
                <p class="mt-1 font-medium text-highlighted">
                    {{ warehouse.location?.name || warehouse.location_id }}
                </p></UCard
            >
            <UCard
                ><p class="text-xs text-muted">Address</p>
                <p class="mt-1 text-sm text-highlighted">
                    {{ warehouse.location?.address || '-' }}
                </p></UCard
            >
            <UCard
                ><p class="text-xs text-muted">Zones</p>
                <p class="mt-1 text-2xl font-semibold text-highlighted">
                    {{ zones.length }}
                </p></UCard
            >
        </div>
        <UCard class="min-h-0 flex-1">
            <template #header>
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="font-semibold text-highlighted">Zones</h2>
                        <p class="text-sm text-muted">Kelola area operasional di warehouse ini.</p>
                    </div>
                    <UButton icon="i-lucide-plus" label="Tambah zone" color="primary" @click="onCreateZone" />
                </div>
            </template>
            <UTable
                :data="zones"
                :columns="columns"
                :loading="zoneStore.isLoading('zone.findAll')"
                loading-color="primary"
                loading-animation="carousel"
                class="min-w-180"
                :ui="{ root: 'border-0' }"
                :empty="'Belum ada zone.'"
            />
        </UCard>
        <FormZoneFormCreateEditZone
            v-if="warehouse"
            v-model:open="openForm"
            :data="selectedZone"
            :warehouse-id="warehouse.id"
            :loading="zoneStore.isLoading('zone.create') || zoneStore.isLoading('zone.update') || zoneStore.isLoading('zone.findById')"
            @close="closeForm"
            @submit="onSubmit"
        />
        <DeleteConfirmationModal v-model:open="openDelete" :item-name="selectedZone?.name" :loading="zoneStore.isLoading('zone.remove')" @delete="confirmDelete" />
    </div>
</template>
