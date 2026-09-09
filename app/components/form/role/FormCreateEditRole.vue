<template>
    <UModal
        v-model:open="open"
        :title="getTitle"
        :dismissible="!loading"
        :ui="{ footer: 'justify-end' }"
        :close="{ color: 'primary', variant: 'soft', class: 'rounded-full' }"
    >
        <template #body>
            <UForm
                :id="formId"
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit"
            >
                <UFormField label="Nama" name="name" required>
                    <UInput
                        v-model="state.name"
                        placeholder="system-admin"
                        class="w-full"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField label="Kode" name="code" required>
                    <UInput
                        v-model="state.code"
                        placeholder="SYSTEM_ADMIN"
                        class="w-full"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField label="Deskripsi" name="description">
                    <UTextarea
                        v-model="state.description"
                        :rows="3"
                        placeholder="System admin role"
                        class="w-full"
                        :disabled="loading"
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

                <div
                    v-if="props.data"
                    class="border-default text-muted grid grid-cols-2 gap-2 border-t pt-3 text-xs"
                >
                    <span>Dibuat: {{ formatDate(props.data.created_at) }}</span>
                    <span>Diubah: {{ formatDate(props.data.updated_at) }}</span>
                </div>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton
                :label="cancelLabel"
                color="neutral"
                variant="soft"
                :disabled="loading"
                @click="close"
            />
            <UButton
                :label="confirmLabel"
                color="primary"
                variant="solid"
                icon="i-lucide-save"
                type="submit"
                :form="formId"
                :loading="loading"
            />
        </template>
    </UModal>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Role } from "../../../models";
import type { RoleStatus } from "../../../constants/role.constant";

const emit = defineEmits<{
    close: [];
    submit: [{ action: string; payload: RoleFormPayload }];
}>();

const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(
    defineProps<{
        title?: string;
        itemName?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        loading?: boolean;
        data?: Role | undefined;
    }>(),
    {
        title: "Create/Edit Role",
        confirmLabel: "Simpan",
        cancelLabel: "Batal",
        loading: false,
    },
);

const formId = useId();

const schema = z.object({
    code: z
        .string()
        .min(1, "Kode wajib diisi")
        .regex(/^[A-Z0-9_]+$/, "Gunakan huruf kapital, angka, dan underscore"),
    name: z.string().min(1, "Nama wajib diisi"),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

type Schema = z.output<typeof schema>;
export type RoleFormPayload = Schema & { id?: string };

const state = reactive<Partial<Schema>>({
    code: "",
    name: "",
    description: "",
    status: "ACTIVE",
});

const statusOptions = [
    { label: "Aktif", value: "ACTIVE" },
    { label: "Nonaktif", value: "INACTIVE" },
];

const getTitle = computed(() => `${!props.data ? "Create" : "Edit"} Role`);

function resetState() {
    state.code = props.data?.code ?? "";
    state.name = props.data?.name ?? "";
    state.description = props.data?.description ?? "";
    state.status = (props.data?.status ?? "ACTIVE") as RoleStatus;
}

function onSubmit(event: FormSubmitEvent<Schema>) {
    emit("submit", {
        action: props.data ? "update" : "create",
        payload: { ...event.data, id: props.data?.id },
    });
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
