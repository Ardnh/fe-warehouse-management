<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type {
    CreateWarehouseRequest,
    Location,
    UpdateWarehouseRequest,
    Warehouse,
} from "~/models";

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
    close: [];
    submit: [{ payload: WarehouseFormPayload }];
}>();
const props = withDefaults(
    defineProps<{
        data?: Warehouse;
        locations?: Location[];
        loading?: boolean;
    }>(),
    { locations: () => [], loading: false },
);
const formId = useId();
const isEditing = computed(() => Boolean(props.data));
const schema = z.object({
    location_id: z.string().min(1, "Location wajib dipilih"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});
type Schema = z.output<typeof schema>;
export type WarehouseFormPayload =
    CreateWarehouseRequest | UpdateWarehouseRequest;
const state = reactive<Schema>({ location_id: "", status: "ACTIVE" });
const locationOptions = computed(() =>
    props.locations.map((location) => ({
        label: `${location.code} · ${location.name}`,
        value: location.id,
    })),
);
const statusOptions = [
    { label: "Aktif", value: "ACTIVE" },
    { label: "Nonaktif", value: "INACTIVE" },
];
function resetState() {
    state.location_id =
        props.data?.location_id ?? props.data?.location?.id ?? "";
    state.status = (props.data?.status ?? "ACTIVE") as Schema["status"];
}
function onSubmit(event: FormSubmitEvent<Schema>) {
    emit("submit", {
        payload: props.data
            ? { status: event.data.status, location_id: event.data.location_id }
            : event.data,
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
                <UFormField label="Location" name="location_id" required
                    ><USelectMenu
                        v-model="state.location_id"
                        :items="locationOptions"
                        value-key="value"
                        class="w-full"
                        placeholder="Pilih location"
                        :disabled="loading"
                /></UFormField>
                <UFormField label="Status" name="status" required
                    ><USelect
                        v-model="state.status"
                        :items="statusOptions"
                        value-key="value"
                        class="w-full"
                        :disabled="loading"
                /></UFormField>
            </UForm>
        </template>
        <template #footer="{ close }"
            ><UButton
                label="Batal"
                color="neutral"
                variant="soft"
                :disabled="loading"
                @click="close" /><UButton
                :label="isEditing ? 'Simpan perubahan' : 'Buat warehouse'"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                :form="formId"
                :loading="loading"
        /></template>
    </UModal>
</template>
