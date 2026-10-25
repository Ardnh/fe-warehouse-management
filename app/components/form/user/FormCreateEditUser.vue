<script setup lang="ts">
import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
import type { Role, User } from '~/models'
import { createUserSchema, updateUserSchema } from '~/utils/schemas'
import type { UserFormPayload, UserSchema } from '~/utils/schemas'

const toast = useToast()
const roleStore = useRoleStore()
const locationStore = useLocationStore()

const { roles } = storeToRefs(roleStore)
const { locations } = storeToRefs(locationStore)

const emit = defineEmits<{
    close: []
    submit: [{ payload: UserFormPayload }]
}>()

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
    defineProps<{
        data?: User
        loading?: boolean
    }>(),
    {
        loading: false,
    }
)

const formId = useId()
const isEditing = computed(() => Boolean(props.data))

const state = reactive<UserSchema>({
    username: '',
    email: '',
    password: '',
    full_name: '',
    location_id: '',
    status: 'ACTIVE',
    role_id: '',
})

const statusOptions = [
    { label: 'Aktif', value: 'ACTIVE' },
    { label: 'Nonaktif', value: 'INACTIVE' },
]

const userSchema = computed(() => (isEditing.value ? updateUserSchema : createUserSchema))
const roleOptions = computed<SelectMenuItem[]>(() => roles.value.map((role) => ({ label: role.name, value: role.id })))
const locationOptions = computed<SelectMenuItem[]>(() => locations.value.map((location) => ({ label: location.name, value: location.id })))

function resetState() {
    state.username = props.data?.username ?? ''
    state.email = props.data?.email ?? ''
    state.password = ''
    state.full_name = props.data?.full_name ?? ''
    state.status = (props.data?.status ?? 'ACTIVE') as UserSchema['status']
    state.role_id = props.data?.roles?.id ?? ''
    state.location_id = props.data?.location?.id ?? ''
}

function onSubmit(event: FormSubmitEvent<UserSchema>) {
    const { password, ...rest } = event.data
    emit('submit', { payload: password ? { ...rest, password } : rest })
}

async function loadRoles() {
    try {
        await roleStore.findAllRoles({
            page: 1,
            page_size: 20,
        })
    } catch {
        toast.add({
            title: 'Gagal memuat role',
            description: 'Role tidak dapat dimuat. Coba buka halaman ini lagi.',
            color: 'warning',
            icon: 'i-lucide-triangle-alert',
        })
    }
}

async function loadLocation() {
    try {
        await locationStore.findAllLocations({
            page: 1,
            page_size: 20,
        })
    } catch {
        toast.add({
            title: 'Gagal memuat role',
            description: 'Role tidak dapat dimuat. Coba buka halaman ini lagi.',
            color: 'warning',
            icon: 'i-lucide-triangle-alert',
        })
    }
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

onMounted(async () => {
    await Promise.all([loadRoles(), loadLocation()])
})
</script>

<template>
    <UModal
        v-model:open="open"
        :title="isEditing ? 'Edit User' : 'New User'"
        :dismissible="!loading"
        :ui="{ footer: 'justify-end' }"
        :close="{ color: 'neutral', variant: 'soft', class: 'rounded-full' }"
    >
        <template #body>
            <UForm :id="formId" :schema="userSchema" :state="state" class="grid gap-4 sm:grid-cols-2" @submit="onSubmit">
                <UFormField label="Nama lengkap" name="full_name" required>
                    <UInput v-model="state.full_name" class="w-full" placeholder="Nama lengkap" :disabled="loading" />
                </UFormField>

                <UFormField label="Username" name="username" required>
                    <UInput v-model="state.username" class="w-full" placeholder="username" :disabled="loading" />
                </UFormField>

                <UFormField label="Email" name="email" required>
                    <UInput v-model="state.email" class="w-full" type="email" placeholder="user@example.com" :disabled="loading" />
                </UFormField>

                <UFormField label="Location" name="location_id" required>
                    <USelectMenu
                        v-model="state.location_id"
                        :items="locationOptions"
                        value-key="value"
                        class="w-full"
                        placeholder="Pilih lokasi"
                        :disabled="loading || !locationOptions.length"
                    />
                </UFormField>

                <UFormField
                    :label="isEditing ? 'Password baru' : 'Password'"
                    name="password"
                    :required="!isEditing"
                    :hint="isEditing ? 'Kosongkan jika tidak ingin mengubah password' : undefined"
                    class="sm:col-span-2"
                >
                    <UInput
                        v-model="state.password"
                        class="w-full"
                        type="password"
                        :placeholder="isEditing ? 'Tidak diubah' : 'Password'"
                        autocomplete="new-password"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField label="Role" name="role_id" required>
                    <USelectMenu
                        v-model="state.role_id"
                        :items="roleOptions"
                        value-key="value"
                        class="w-full"
                        placeholder="Pilih role"
                        :disabled="loading || !roleOptions.length"
                    />
                </UFormField>

                <UFormField label="Status" name="status" required>
                    <USelect v-model="state.status" :items="statusOptions" value-key="value" class="w-full" :disabled="loading" />
                </UFormField>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="close" />
            <UButton :label="isEditing ? 'Simpan perubahan' : 'Buat user'" color="primary" icon="i-lucide-save" type="submit" :form="formId" :loading="loading" />
        </template>
    </UModal>
</template>
