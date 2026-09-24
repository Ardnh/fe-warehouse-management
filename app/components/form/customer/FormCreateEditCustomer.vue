<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreateCustomerRequest, Customer, UpdateCustomerRequest } from "~/models";

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ close: []; submit: [{ payload: CustomerFormPayload }] }>();
const props = withDefaults(defineProps<{ data?: Customer; loading?: boolean }>(), { loading: false });
const formId = useId();
const isEditing = computed(() => Boolean(props.data));
const schema = z.object({
    code: z.string().min(1, "Kode wajib diisi").max(50),
    name: z.string().min(1, "Nama wajib diisi").max(255),
    email: z.string().email("Email tidak valid").max(50),
    address: z.string().min(1, "Alamat wajib diisi"),
    status: z.string().min(1, "Status wajib diisi"),
    phone: z.string().min(1, "Nomor telepon wajib diisi").max(20),
});
type Schema = z.output<typeof schema>;
export type CustomerFormPayload = CreateCustomerRequest | UpdateCustomerRequest;
const state = reactive<Schema>({ code: "", name: "", email: "", address: "", status: "ACTIVE", phone: "" });
const statusOptions = [{ label: "Aktif", value: "ACTIVE" }, { label: "Nonaktif", value: "INACTIVE" }];
function resetState() {
    state.code = props.data?.code ?? "";
    state.name = props.data?.name ?? "";
    state.email = props.data?.email ?? "";
    state.address = props.data?.address ?? "";
    state.status = props.data?.status ?? "ACTIVE";
    state.phone = props.data?.phone ?? "";
}
function onSubmit(event: FormSubmitEvent<Schema>) {
    const { code, ...fields } = event.data;
    emit("submit", { payload: props.data ? fields : { code, ...fields } });
}
watch(() => [open.value, props.data] as const, ([isOpen]) => { if (isOpen) resetState(); }, { immediate: true });
watch(open, (value) => { if (!value) emit("close"); });
</script>

<template>
    <UModal v-model:open="open" :title="isEditing ? 'Edit Customer' : 'New Customer'" :dismissible="!loading" :ui="{ footer: 'justify-end' }">
        <template #body>
            <UForm :id="formId" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Kode" name="code" required><UInput v-model="state.code" class="w-full" placeholder="CUST-001" :disabled="loading || isEditing" /></UFormField>
                    <UFormField label="Nama" name="name" required><UInput v-model="state.name" class="w-full" placeholder="Nama customer" :disabled="loading" /></UFormField>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Email" name="email" required><UInput v-model="state.email" type="email" class="w-full" placeholder="customer@example.com" :disabled="loading" /></UFormField>
                    <UFormField label="Telepon" name="phone" required><UInput v-model="state.phone" class="w-full" placeholder="08123456789" :disabled="loading" /></UFormField>
                </div>
                <UFormField label="Alamat" name="address" required><UTextarea v-model="state.address" class="w-full" :rows="3" placeholder="Alamat customer" :disabled="loading" /></UFormField>
                <UFormField label="Status" name="status" required><USelect v-model="state.status" :items="statusOptions" value-key="value" class="w-full" :disabled="loading" /></UFormField>
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="close" />
            <UButton :label="isEditing ? 'Simpan perubahan' : 'Buat customer'" color="primary" icon="i-lucide-save" type="submit" :form="formId" :loading="loading" />
        </template>
    </UModal>
</template>
