<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreateUomRequest, Uom, UpdateUomRequest } from "~/models";

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
    close: [];
    submit: [{ payload: UomFormPayload }];
}>();

const props = withDefaults(
    defineProps<{
        data?: Uom;
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
        .max(20, "Kode maksimal 20 karakter")
        .regex(/^[A-Z0-9_-]+$/, "Gunakan huruf kapital, angka, underscore, atau strip"),
    name: z.string().min(1, "Nama wajib diisi").max(100),
    type: z.string().min(1, "Tipe wajib diisi").max(20),
});

type Schema = z.output<typeof schema>;
export type UomFormPayload = CreateUomRequest | UpdateUomRequest;

const state = reactive<Schema>({ code: "", name: "", type: "" });

function resetState() {
    state.code = props.data?.code ?? "";
    state.name = props.data?.name ?? "";
    state.type = props.data?.type ?? "";
}

function onSubmit(event: FormSubmitEvent<Schema>) {
    const { code, ...editableFields } = event.data;
    emit("submit", {
        payload: props.data ? editableFields : { code, ...editableFields },
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

<template>
    <UModal
        v-model:open="open"
        :title="isEditing ? 'Edit UOM' : 'New UOM'"
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
                <UFormField label="Kode" name="code" required>
                    <UInput
                        v-model="state.code"
                        class="w-full"
                        placeholder="PCS"
                        :disabled="loading || isEditing"
                    />
                    <template v-if="isEditing" #hint>
                        Kode tidak dapat diubah setelah UOM dibuat.
                    </template>
                </UFormField>

                <UFormField label="Nama" name="name" required>
                    <UInput
                        v-model="state.name"
                        class="w-full"
                        placeholder="Pieces"
                        :disabled="loading"
                    />
                </UFormField>

                <UFormField label="Tipe" name="type" required>
                    <UInput
                        v-model="state.type"
                        class="w-full"
                        placeholder="QUANTITY"
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
                :label="isEditing ? 'Simpan perubahan' : 'Buat UOM'"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                :form="formId"
                :loading="loading"
            />
        </template>
    </UModal>
</template>
