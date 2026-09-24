<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreateProductRequest, Customer, Product, Uom, UpdateProductRequest } from "~/models";

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ close: []; submit: [{ payload: ProductFormPayload }] }>();
const props = withDefaults(defineProps<{ data?: Product; customers?: Customer[]; uoms?: Uom[]; loading?: boolean }>(), { customers: () => [], uoms: () => [], loading: false });
const formId = useId();
const isEditing = computed(() => Boolean(props.data));
const schema = z.object({
    customer_id: z.string().min(1, "Customer wajib dipilih"),
    sku: z.string().min(1, "SKU wajib diisi").max(100),
    name: z.string().min(1, "Nama wajib diisi").max(255),
    uom_id: z.string().min(1, "UOM wajib dipilih"),
    barcode: z.string().max(100).optional(),
    status: z.enum(["active", "inactive"]),
});
type Schema = z.output<typeof schema>;
export type ProductFormPayload = CreateProductRequest | UpdateProductRequest;
const state = reactive<Schema>({ customer_id: "", sku: "", name: "", uom_id: "", barcode: "", status: "active" });
const customerOptions = computed(() => props.customers.map((item) => ({ label: `${item.code} · ${item.name}`, value: item.id })));
const uomOptions = computed(() => props.uoms.map((item) => ({ label: `${item.code} · ${item.name}`, value: item.id })));
function resetState() {
    state.customer_id = props.data?.customer_id ?? "";
    state.sku = props.data?.sku ?? "";
    state.name = props.data?.name ?? "";
    state.uom_id = props.data?.uom_id ?? "";
    state.barcode = props.data?.barcode ?? "";
    state.status = (props.data?.status ?? "active") as Schema["status"];
}
function onSubmit(event: FormSubmitEvent<Schema>) {
    const { customer_id, sku, uom_id, ...editableFields } = event.data;
    emit("submit", { payload: props.data ? editableFields : { customer_id, sku, uom_id, ...editableFields } });
}
watch(() => [open.value, props.data] as const, ([isOpen]) => { if (isOpen) resetState(); }, { immediate: true });
watch(open, (value) => { if (!value) emit("close"); });
</script>

<template>
    <UModal v-model:open="open" :title="isEditing ? 'Edit Product' : 'New Product'" :dismissible="!loading" :ui="{ footer: 'justify-end' }">
        <template #body>
            <UForm :id="formId" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Customer" name="customer_id" required><USelectMenu v-model="state.customer_id" :items="customerOptions" value-key="value" class="w-full" placeholder="Pilih customer" :disabled="loading || isEditing" /></UFormField>
                    <UFormField label="SKU" name="sku" required><UInput v-model="state.sku" class="w-full" placeholder="SKU-001" :disabled="loading || isEditing" /></UFormField>
                </div>
                <UFormField label="Nama product" name="name" required><UInput v-model="state.name" class="w-full" placeholder="Nama product" :disabled="loading" /></UFormField>
                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="UOM" name="uom_id" required><USelectMenu v-model="state.uom_id" :items="uomOptions" value-key="value" class="w-full" placeholder="Pilih UOM" :disabled="loading || isEditing" /></UFormField>
                    <UFormField label="Status" name="status" required><USelect v-model="state.status" :items="[{ label: 'Aktif', value: 'active' }, { label: 'Nonaktif', value: 'inactive' }]" value-key="value" class="w-full" :disabled="loading" /></UFormField>
                </div>
                <UFormField label="Barcode" name="barcode"><UInput v-model="state.barcode" class="w-full" placeholder="Barcode (opsional)" :disabled="loading" /></UFormField>
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="close" />
            <UButton :label="isEditing ? 'Simpan perubahan' : 'Buat product'" color="primary" icon="i-lucide-save" type="submit" :form="formId" :loading="loading" />
        </template>
    </UModal>
</template>
