<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateRoleRequest, Permission, PermissionAction, Role, UpdateRoleRequest } from '~/models'

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
const permissionOptions = computed(() =>
   props.permissions.flatMap((group) => {
      const rawActions = group.action as unknown
      let actions: PermissionAction[] = []

      if (Array.isArray(rawActions)) {
         actions = rawActions as PermissionAction[]
      } else if (rawActions && typeof rawActions === 'object') {
         const value = rawActions as Record<string, unknown>
         if ('id' in value && 'resource' in value && 'action' in value) {
            actions = [value as unknown as PermissionAction]
         } else {
            actions = Object.values(value).filter(
               (item): item is PermissionAction => item !== null && typeof item === 'object' && 'id' in item && 'resource' in item && 'action' in item
            )
         }
      }

      return actions.map((permission) => ({
         label: `${permission.resource} · ${permission.action}`,
         value: permission.id,
         description: permission.description,
         group: group.group,
      }))
   })
)
const getTitle = computed(() => `${isEditing.value ? 'Edit' : 'Create'} Role`)
function resetState() {
   state.code = props.data?.code ?? ''
   state.name = props.data?.name ?? ''
   state.description = props.data?.description ?? ''
   state.status = (props.data?.status ?? 'ACTIVE') as Schema['status']
   state.permission_ids = props.data?.permission_ids ?? []
}
function onSubmit(event: FormSubmitEvent<Schema>) {
   const { code, ...editable } = event.data
   emit('submit', { action: isEditing.value ? 'update' : 'create', id: props.data?.id, payload: isEditing.value ? editable : { code, ...editable } })
}
watch(
   () => [open.value, props.data] as const,
   ([isOpen]) => {
      if (isOpen) resetState()
   },
   { immediate: true }
)
watch(open, (value) => {
   if (!value) emit('close')
})
</script>
<template>
   <UDrawer v-model:open="open" direction="right" :title="getTitle" :dismissible="!loading" :ui="{ content: 'w-full sm:max-w-xl', footer: 'justify-end' }">
      <template #body>
         <UForm :id="formId" :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
            <div class="grid gap-4 sm:grid-cols-2">
               <UFormField label="Nama" name="name" required><UInput v-model="state.name" placeholder="system-admin" class="w-full" :disabled="loading" /></UFormField
               ><UFormField label="Kode" name="code" required
                  ><UInput v-model="state.code" placeholder="SYSTEM_ADMIN" class="w-full" :disabled="loading || isEditing"
               /></UFormField>
            </div>
            <UFormField label="Deskripsi" name="description"
               ><UTextarea v-model="state.description" :rows="3" placeholder="System admin role" class="w-full" :disabled="loading"
            /></UFormField>
            <UFormField label="Status" name="status" required
               ><USelect v-model="state.status" :items="statusOptions" value-key="value" class="w-full" :disabled="loading"
            /></UFormField>
            <UFormField label="Permissions" name="permission_ids" required hint="Pilih permission yang dimiliki role ini."
               ><USelectMenu
                  v-model="state.permission_ids"
                  :items="permissionOptions"
                  value-key="value"
                  multiple
                  searchable
                  class="w-full"
                  placeholder="Pilih permissions"
                  :disabled="loading || !permissionOptions.length"
            /></UFormField>
            <div v-if="!permissionOptions.length" class="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
               Permission belum tersedia. Muat ulang halaman untuk mencoba lagi.
            </div>
            <div v-if="props.data" class="grid grid-cols-2 gap-2 border-t border-default pt-3 text-xs text-muted">
               <span>Dibuat: {{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(props.data.created_at)) }}</span
               ><span>Diubah: {{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(props.data.updated_at)) }}</span>
            </div>
         </UForm>
      </template>
      <template #footer
         ><UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="open = false" /><UButton
            :label="isEditing ? 'Simpan perubahan' : 'Buat role'"
            color="primary"
            icon="i-lucide-save"
            type="submit"
            :form="formId"
            :loading="loading"
      /></template>
   </UDrawer>
</template>
