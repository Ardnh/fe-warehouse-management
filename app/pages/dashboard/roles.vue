<script setup lang="ts">
import { usePermissionStore } from "~/stores";
import type { FindAllPermissionParams } from "~/models";

definePageMeta({
    layout: "dashboard",
    ssr: false,
});

const permissionStore = usePermissionStore();

const query = ref<FindAllPermissionParams>({
    page: 1,
    page_size: 50,
    search: "",
    sort_by: "",
    sort_dir: "",
});

onMounted(async () => {
    await permissionStore.findAllPermissions(query.value);
});
</script>

<template>
    <div class="w-full flex justify-end items-center">
        <UButton icon="i-lucide-plus">Roles</UButton>
    </div>
    <pre>{{ permissionStore.permissions }}</pre>
</template>
