<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateRoleRequest, Permission, Role, UpdateRoleRequest, PermissionGroup } from '~/models'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: []; submit: [{ action: 'create' | 'update'; payload: CreateRoleRequest | UpdateRoleRequest; id?: string }] }>()
const props = withDefaults(defineProps<{ data?: Role; permissions?: Permission[]; loading?: boolean }>(), { permissions: () => [], loading: false })
const formId = useId()
const isEditing = computed(() => Boolean(props.data))

const schema = z.object({
    code: z
        .string()
        .min(1, 'Kode wajib diisi')
        .max(50)
        .regex(/^[A-Z0-9_]+$/, 'Gunakan huruf kapital, angka, dan underscore'),
    name: z.string().min(1, 'Nama wajib diisi').max(100),
    description: z.string().max(1000).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    permission_ids: z.array(z.string()).min(1, 'Pilih minimal satu permission'),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({ code: '', name: '', description: '', status: 'ACTIVE', permission_ids: [] })

const statusOptions = [
    { label: 'Aktif', value: 'ACTIVE' },
    { label: 'Nonaktif', value: 'INACTIVE' },
]

const permissionOptions = computed(() => {
    const permissionsList = props.permissions
    const group = new Map<string, PermissionGroup>()

    for (const permission of permissionsList) {
        const current = group.get(permission.resource) ?? []

        current.push({
            label: permission.action,
            value: String(permission.id),
        })

        group.set(permission.resource, current)
    }

    return Array.from(group, ([resource, actions]) => ({
        resource,
        actions,
    }))
})

const getTitle = computed(() => `${isEditing.value ? 'Edit' : 'Create'} Role`)

function resetState() {
    state.code = props.data?.code ?? ''
    state.name = props.data?.name ?? ''
    state.description = props.data?.description ?? ''
    state.status = (props.data?.status ?? 'ACTIVE') as Schema['status']
    state.permission_ids = (props.data?.permissions ?? []).map((permission) => String(permission.id))
}

function onSubmit(event: FormSubmitEvent<Schema>) {
    const { code, ...editable } = event.data
    emit('submit', { action: isEditing.value ? 'update' : 'create', id: props.data?.id, payload: isEditing.value ? editable : { code, ...editable } })
}

watch(
    () => props.data,
    () => {
        if (open.value) resetState()
    },
    { deep: true }
)

watch(
    open,
    (isOpen) => {
        if (isOpen) resetState()
    },
    { immediate: true }
)
watch(open, (value) => {
    if (!value) emit('close')
})
</script>
<template>
    <UDrawer v-model:open="open" :title="getTitle" :dismissible="!loading">
        <template #body>
            <UForm :id="formId" :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
                <!-- Basic Information -->
                <section class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <UFormField label="Nama" name="name" required>
                            <UInput v-model="state.name" placeholder="system-admin" class="w-full" :disabled="loading" />
                        </UFormField>

                        <UFormField label="Kode" name="code" required>
                            <UInput v-model="state.code" placeholder="SYSTEM_ADMIN" class="w-full" :disabled="loading || isEditing" />
                        </UFormField>
                    </div>

                    <UFormField label="Deskripsi" name="description">
                        <UTextarea v-model="state.description" :rows="3" placeholder="System admin role" class="w-full" :disabled="loading" />
                    </UFormField>

                    <UFormField label="Status" name="status" required>
                        <USelect v-model="state.status" :items="statusOptions" value-key="value" class="w-full" :disabled="loading" />
                    </UFormField>
                </section>

                <!-- Permissions -->
                <section class="space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-semibold text-highlighted">Permissions</h3>

                        <span class="text-xs text-muted"> {{ state.permission_ids.length }} dipilih </span>
                    </div>

                    <UAlert
                        v-if="!permissionOptions.length"
                        color="warning"
                        variant="subtle"
                        title="Permission belum tersedia"
                        description="Muat ulang halaman untuk mencoba lagi."
                        icon="i-lucide-triangle-alert"
                    />

                    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div v-for="item in permissionOptions" :key="item.resource" class="overflow-hidden rounded-lg border border-default">
                            <div class="flex items-center justify-between border-b border-default bg-elevated px-3 py-2.5">
                                <div class="flex items-center justify-start gap-3">
                                    <h4 class="text-sm font-medium text-highlighted capitalize">
                                        {{ item.resource }}
                                    </h4>
                                </div>

                                <span class="text-xs text-muted">
                                    {{ item.actions.length }}
                                </span>
                            </div>

                            <div class="p-3">
                                <UCheckboxGroup v-model="state.permission_ids" :items="item.actions" value-key="value" orientation="horizontal" :disabled="loading" />
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Metadata -->
                <section v-if="props.data" class="space-y-2 border-t border-default pt-4">
                    <h3 class="text-xs font-semibold text-muted uppercase tracking-wide">Informasi</h3>

                    <div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                        <div class="space-y-1">
                            <span class="text-muted">Dibuat</span>
                            <p class="text-toned">
                                {{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(props.data.created_at)) }}
                            </p>
                        </div>

                        <div class="space-y-1">
                            <span class="text-muted">Terakhir diubah</span>
                            <p class="text-toned">
                                {{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(props.data.updated_at)) }}
                            </p>
                        </div>
                    </div>
                </section>
            </UForm>
        </template>

        <template #footer>
            <div class="sticky bottom-0 z-10 flex w-full justify-end gap-3 border-t border-default bg-default p-4">
                <UButton label="Batal" color="neutral" variant="outline" :disabled="loading" @click="open = false" />

                <UButton :label="isEditing ? 'Simpan perubahan' : 'Buat role'" color="primary" icon="i-lucide-save" type="submit" :form="formId" :loading="loading" />
            </div>
        </template>
    </UDrawer>
</template>
