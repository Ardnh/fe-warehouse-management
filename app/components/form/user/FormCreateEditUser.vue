<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Role, User } from "~/models";

const emit = defineEmits<{
    close: [];
    submit: [{ payload: UserFormPayload }];
}>();

const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(
    defineProps<{
        data?: User;
        roles?: Role[];
        loading?: boolean;
    }>(),
    {
        roles: () => [],
        loading: false,
    },
);

const formId = useId();
const isEditing = computed(() => Boolean(props.data));

const schema = z.object({
    username: z.string().min(1, "Username wajib diisi"),
    email: z.string().email("Email tidak valid"),
    password: z
        .string()
        .refine(
            (value) => isEditing.value || value.length > 0,
            "Password wajib diisi",
        ),
    full_name: z.string().min(1, "Nama lengkap wajib diisi"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    role_ids: z.array(z.string()).min(1, "Pilih minimal satu role"),
});

type Schema = z.output<typeof schema>;
export type UserFormPayload = Schema;

const state = reactive<Schema>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    status: "ACTIVE",
    role_ids: [],
});

const statusOptions = [
    { label: "Aktif", value: "ACTIVE" },
    { label: "Nonaktif", value: "INACTIVE" },
];

const roleOptions = computed(() =>
    props.roles.map((role) => ({ label: role.name, value: role.id })),
);

function resetState() {
    state.username = props.data?.username ?? "";
    state.email = props.data?.email ?? "";
    state.password = "";
    state.full_name = props.data?.full_name ?? "";
    state.status = (props.data?.status ?? "ACTIVE") as Schema["status"];
    state.role_ids = props.data?.role_ids ?? [];
}

function onSubmit(event: FormSubmitEvent<Schema>) {
    emit("submit", { payload: event.data });
}

watch(
    () => [open.value, props.data] as const,
    ([isOpen]) => {
        if (isOpen) resetState();
    },
    { immediate: true },
);

watch(open, (value) => {
    if (!value) emit("close");
});
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
            <UForm
                :id="formId"
                :schema="schema"
                :state="state"
                class="grid gap-4 sm:grid-cols-2"
                @submit="onSubmit"
            >
                <UFormField label="Nama lengkap" name="full_name" required>
                    <UInput
                        v-model="state.full_name"
                        class="w-full"
                        placeholder="Nama lengkap"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField label="Username" name="username" required>
                    <UInput
                        v-model="state.username"
                        class="w-full"
                        placeholder="username"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField label="Email" name="email" required>
                    <UInput
                        v-model="state.email"
                        class="w-full"
                        type="email"
                        placeholder="user@example.com"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField
                    :label="isEditing ? 'Password baru' : 'Password'"
                    name="password"
                    :required="!isEditing"
                    :hint="
                        isEditing
                            ? 'Kosongkan jika tidak ingin mengubah password'
                            : undefined
                    "
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

                <UFormField label="Role" name="role_ids" required>
                    <USelectMenu
                        v-model="state.role_ids"
                        :items="roleOptions"
                        value-key="value"
                        multiple
                        class="w-full"
                        placeholder="Pilih role"
                        :disabled="loading || !roleOptions.length"
                    />
                </UFormField>

                <UFormField label="Status" name="status" required>
                    <USelect
                        v-model="state.status"
                        :items="statusOptions"
                        value-key="value"
                        class="w-full"
                        :disabled="loading"
                    />
                </UFormField>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton
                label="Batal"
                color="neutral"
                variant="soft"
                :disabled="loading"
                @click="close"
            />
            <UButton
                :label="isEditing ? 'Simpan perubahan' : 'Buat user'"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                :form="formId"
                :loading="loading"
            />
        </template>
    </UModal>
</template>
