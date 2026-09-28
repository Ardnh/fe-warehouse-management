<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreateZoneRequest, Zone, UpdateZoneRequest } from "~/models";
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ close: []; submit: [{ payload: ZoneFormPayload }] }>();
const props = withDefaults(defineProps<{ data?: Zone; warehouseId: string; loading?: boolean }>(), { loading: false });
const formId = useId(); const isEditing = computed(() => Boolean(props.data));
const schema = z.object({ code: z.string().min(1, "Kode wajib diisi").max(50), name: z.string().min(1, "Nama wajib diisi").max(100), type: z.enum(["RECEIVING", "STORAGE", "PACKING", "OUTBOUND", "DAMAGED", "STAGING"]), status: z.enum(["ACTIVE", "INACTIVE"]) });
type Schema = z.output<typeof schema>; export type ZoneFormPayload = CreateZoneRequest | UpdateZoneRequest;
const state = reactive<Schema>({ code: "", name: "", type: "STORAGE", status: "ACTIVE" });
const typeOptions = ["RECEIVING", "STORAGE", "PACKING", "OUTBOUND", "DAMAGED", "STAGING"].map((value) => ({ label: value, value }));
const statusOptions = [{ label: "Aktif", value: "ACTIVE" }, { label: "Nonaktif", value: "INACTIVE" }];
function resetState() { state.code = props.data?.code ?? ""; state.name = props.data?.name ?? ""; state.type = props.data?.type ?? "STORAGE"; state.status = props.data?.status ?? "ACTIVE"; }
function onSubmit(event: FormSubmitEvent<Schema>) { const { code, ...fields } = event.data; emit("submit", { payload: props.data ? fields : { warehouse_id: props.warehouseId, code, ...fields } }); }
watch(() => [open.value, props.data] as const, ([isOpen]) => { if (isOpen) resetState(); }, { immediate: true }); watch(open, (value) => { if (!value) emit("close"); });
</script>
<template>
    <UModal v-model:open="open" :title="isEditing ? 'Edit Zone' : 'New Zone'" :dismissible="!loading" :ui="{ footer: 'justify-end' }">
        <template #body><UForm :id="formId" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit"><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Kode" name="code" required><UInput v-model="state.code" class="w-full" placeholder="STG-A" :disabled="loading || isEditing" /></UFormField><UFormField label="Nama" name="name" required><UInput v-model="state.name" class="w-full" placeholder="Storage A" :disabled="loading" /></UFormField></div><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Tipe" name="type" required><USelect v-model="state.type" :items="typeOptions" value-key="value" class="w-full" :disabled="loading" /></UFormField><UFormField label="Status" name="status" required><USelect v-model="state.status" :items="statusOptions" value-key="value" class="w-full" :disabled="loading" /></UFormField></div></UForm></template>
        <template #footer="{ close }"><UButton label="Batal" color="neutral" variant="soft" :disabled="loading" @click="close" /><UButton :label="isEditing ? 'Simpan perubahan' : 'Buat zone'" color="primary" icon="i-lucide-save" type="submit" :form="formId" :loading="loading" /></template>
    </UModal>
</template>
