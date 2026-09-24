<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type {
    CreateLocationRequest,
    Location,
    LocationType,
    UpdateLocationRequest,
} from "~/models";

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
    close: [];
    submit: [{ payload: LocationFormPayload }];
}>();

const props = withDefaults(
    defineProps<{ data?: Location; loading?: boolean }>(),
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
    name: z.string().min(1, "Nama wajib diisi").max(100),
    type: z.enum(["HO", "WAREHOUSE"]),
    address: z.string().max(255, "Alamat maksimal 255 karakter"),
    city: z.string().max(100, "Kota maksimal 100 karakter"),
    province: z.string().max(100, "Provinsi maksimal 100 karakter"),
    postal_code: z.string().max(10, "Kode pos maksimal 10 karakter"),
    is_active: z.boolean(),
});

type Schema = z.output<typeof schema>;
export type LocationFormPayload = CreateLocationRequest | UpdateLocationRequest;

const state = reactive<Schema>({
    code: "",
    name: "",
    type: "WAREHOUSE",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    is_active: true,
});

const typeOptions = [
    { label: "Head Office", value: "HO" },
    { label: "Warehouse", value: "WAREHOUSE" },
];

function resetState() {
    state.code = props.data?.code ?? "";
    state.name = props.data?.name ?? "";
    state.type = (props.data?.type ?? "WAREHOUSE") as LocationType;
    state.address = props.data?.address ?? "";
    state.city = props.data?.city ?? "";
    state.province = props.data?.province ?? "";
    state.postal_code = props.data?.postal_code ?? "";
    state.is_active = props.data?.is_active ?? true;
}

function onSubmit(event: FormSubmitEvent<Schema>) {
    const { code, ...fields } = event.data;
    const payload = {
        ...fields,
        address: fields.address || undefined,
        city: fields.city || undefined,
        province: fields.province || undefined,
        postal_code: fields.postal_code || undefined,
    };

    emit("submit", {
        payload: props.data ? payload : { code, ...payload },
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
        :title="isEditing ? 'Edit Location' : 'New Location'"
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
                            placeholder="LOC-JKT-01"
                            :disabled="loading || isEditing"
                        />
                        <template v-if="isEditing" #hint>
                            Kode tidak dapat diubah setelah dibuat.
                        </template>
                    </UFormField>
                    <UFormField label="Nama" name="name" required>
                        <UInput
                            v-model="state.name"
                            class="w-full"
                            placeholder="Jakarta Warehouse"
                            :disabled="loading"
                        />
                    </UFormField>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Tipe" name="type" required>
                        <USelect
                            v-model="state.type"
                            :items="typeOptions"
                            value-key="value"
                            class="w-full"
                            :disabled="loading"
                        />
                    </UFormField>
                    <UFormField label="Kode pos" name="postal_code">
                        <UInput
                            v-model="state.postal_code"
                            class="w-full"
                            placeholder="12345"
                            :disabled="loading"
                        />
                    </UFormField>
                </div>

                <UFormField label="Alamat" name="address">
                    <UTextarea
                        v-model="state.address"
                        class="w-full"
                        :rows="2"
                        placeholder="Alamat lengkap"
                        :disabled="loading"
                    />
                </UFormField>

                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Kota" name="city">
                        <UInput v-model="state.city" placeholder="Jakarta" :disabled="loading" />
                    </UFormField>
                    <UFormField label="Provinsi" name="province">
                        <UInput v-model="state.province" placeholder="DKI Jakarta" :disabled="loading" />
                    </UFormField>
                </div>

                <UFormField name="is_active">
                    <USwitch
                        v-model="state.is_active"
                        label="Location aktif"
                        description="Location dapat dipilih untuk operasional."
                        :disabled="loading"
                    />
                </UFormField>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="close" />
            <UButton
                :label="isEditing ? 'Simpan perubahan' : 'Buat location'"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                :form="formId"
                :loading="loading"
            />
        </template>
    </UModal>
</template>
