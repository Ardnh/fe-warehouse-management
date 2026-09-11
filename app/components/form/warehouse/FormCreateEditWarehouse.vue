<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Warehouse } from "~/models";

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
    close: [];
    submit: [{ payload: WarehouseFormPayload }];
}>();

const props = withDefaults(
    defineProps<{
        data?: Warehouse;
        loading?: boolean;
    }>(),
    { loading: false },
);

const formId = useId();
const isEditing = computed(() => Boolean(props.data));

const schema = z.object({
    code: z
        .string()
        .min(1, "Kode wajib diisi")
        .max(30, "Kode maksimal 30 karakter")
        .regex(/^[A-Z0-9_-]+$/, "Gunakan huruf kapital, angka, underscore, atau strip"),
    name: z.string().min(1, "Nama warehouse wajib diisi").max(100),
    address: z.string().min(1, "Alamat wajib diisi").max(255),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

type Schema = z.output<typeof schema>;
export type WarehouseFormPayload = Schema;

const state = reactive<Schema>({
    code: "",
    name: "",
    address: "",
    status: "ACTIVE",
});

const statusOptions = [
    { label: "Aktif", value: "ACTIVE" },
    { label: "Nonaktif", value: "INACTIVE" },
];

function resetState() {
    state.code = props.data?.code ?? "";
    state.name = props.data?.name ?? "";
    state.address = props.data?.address ?? "";
    state.status = (props.data?.status ?? "ACTIVE") as Schema["status"];
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
        :title="isEditing ? 'Edit Warehouse' : 'New Warehouse'"
        :dismissible="!loading"
        :ui="{ footer: 'justify-end' }"
    >
        <template #body>
            <UForm
                :id="formId"
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit"
            >
                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Kode" name="code" required>
                        <UInput
                            v-model="state.code"
                            class="w-full"
                            placeholder="WH-JKT-01"
                            :disabled="loading"
                        />
                    </UFormField>
                    <UFormField label="Nama" name="name" required>
                        <UInput
                            v-model="state.name"
                            class="w-full"
                            placeholder="Warehouse Jakarta"
                            :disabled="loading"
                        />
                    </UFormField>
                </div>

                <UFormField label="Alamat" name="address" required>
                    <UTextarea
                        v-model="state.address"
                        class="w-full"
                        :rows="3"
                        placeholder="Alamat lengkap warehouse"
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
                :label="isEditing ? 'Simpan perubahan' : 'Buat warehouse'"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                :form="formId"
                :loading="loading"
            />
        </template>
    </UModal>
</template>
