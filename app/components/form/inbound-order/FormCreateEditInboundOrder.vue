<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreateInboundOrderRequest, Customer, InboundOrder, Product, UpdateInboundOrderRequest } from "~/models";
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ close: []; submit: [{ payload: InboundOrderFormPayload }] }>();
const props = withDefaults(defineProps<{ data?: InboundOrder; customers?: Customer[]; products?: Product[]; loading?: boolean }>(), { customers: () => [], products: () => [], loading: false });
const formId = useId();
const isEditing = computed(() => Boolean(props.data));
const schema = z.object({ customer_id: z.string().min(1, "Customer wajib dipilih"), expected_arrival_at: z.string().optional(), notes: z.string().max(1000).optional(), items: z.array(z.object({ id: z.string().optional(), product_id: z.string().min(1, "Product wajib dipilih"), expected_qty: z.number().int().gt(0, "Qty harus lebih dari 0") })).min(1, "Tambahkan minimal satu item") });
type Schema = z.output<typeof schema>;
export type InboundOrderFormPayload = CreateInboundOrderRequest | UpdateInboundOrderRequest;
const state = reactive<Schema>({ customer_id: "", expected_arrival_at: "", notes: "", items: [] });
const customerOptions = computed(() => props.customers.map((x) => ({ label: `${x.code} · ${x.name}`, value: x.id })));
const productOptions = computed(() => props.products.map((x) => ({ label: `${x.sku} · ${x.name}`, value: x.id })));
function resetState() { state.customer_id = props.data?.customer_id ?? ""; state.expected_arrival_at = props.data?.expected_arrival_at ? props.data.expected_arrival_at.slice(0, 16) : ""; state.notes = props.data?.notes ?? ""; state.items = (props.data?.items ?? []).map((x) => ({ id: x.id, product_id: x.product_id, expected_qty: x.expected_qty })); if (!state.items.length) addItem(); }
function addItem() { state.items.push({ product_id: "", expected_qty: 1 }); }
function removeItem(index: number) { if (state.items.length > 1) state.items.splice(index, 1); }
function onSubmit(event: FormSubmitEvent<Schema>) { const items = event.data.items.map(({ id, ...item }) => ({ ...(id ? { id } : {}), ...item })); const payload = { customer_id: event.data.customer_id, expected_arrival_at: event.data.expected_arrival_at ? new Date(event.data.expected_arrival_at).toISOString() : undefined, notes: event.data.notes || undefined, items }; emit("submit", { payload }); }
watch(() => [open.value, props.data] as const, ([isOpen]) => { if (isOpen) resetState(); }, { immediate: true });
watch(open, (value) => { if (!value) emit("close"); });
</script>
<template>
    <UModal v-model:open="open" :title="isEditing ? 'Edit Inbound Order' : 'New Inbound Order'" :dismissible="!loading" :ui="{ footer: 'justify-end' }" class="sm:max-w-3xl">
        <template #body><UForm :id="formId" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <div class="grid gap-4 sm:grid-cols-2"><UFormField label="Customer" name="customer_id" required><USelectMenu v-model="state.customer_id" :items="customerOptions" value-key="value" class="w-full" placeholder="Pilih customer" :disabled="loading" /></UFormField><UFormField label="Expected arrival" name="expected_arrival_at"><UInput v-model="state.expected_arrival_at" type="datetime-local" class="w-full" :disabled="loading" /></UFormField></div>
            <UFormField label="Catatan" name="notes"><UTextarea v-model="state.notes" :rows="2" class="w-full" placeholder="Catatan tambahan" :disabled="loading" /></UFormField>
            <div class="flex items-center justify-between border-t border-default pt-4"><div><h3 class="font-semibold text-highlighted">Order items</h3><p class="text-xs text-muted">Product yang akan diterima.</p></div><UButton type="button" icon="i-lucide-plus" size="sm" variant="soft" label="Tambah item" :disabled="loading" @click="addItem" /></div>
            <div v-for="(item, index) in state.items" :key="item.id || index" class="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_auto]"><UFormField :label="`Product ${index + 1}`" :name="`items.${index}.product_id`" required><USelectMenu v-model="item.product_id" :items="productOptions" value-key="value" class="w-full" placeholder="Pilih product" :disabled="loading" /></UFormField><UFormField label="Expected qty" :name="`items.${index}.expected_qty`" required><UInput v-model.number="item.expected_qty" type="number" min="1" class="w-full" :disabled="loading" /></UFormField><UButton v-if="state.items.length > 1" type="button" icon="i-lucide-trash-2" color="error" variant="soft" size="sm" class="mt-6" :disabled="loading" :aria-label="`Hapus item ${index + 1}`" @click="removeItem(index)" /></div>
        </UForm></template>
        <template #footer="{ close }"><UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="close" /><UButton :label="isEditing ? 'Simpan perubahan' : 'Buat order'" color="primary" icon="i-lucide-save" type="submit" :form="formId" :loading="loading" /></template>
    </UModal>
</template>
