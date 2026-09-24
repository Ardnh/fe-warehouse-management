<script setup lang="ts">
import { useUserStore } from "#imports";
import { onMounted } from "vue";

const userStore = useUserStore();
const { userProfile } = storeToRefs(userStore);

definePageMeta({
    layout: "dashboard",
    ssr: false,
});
// useHead({
//     title: "Dashboard | Overview",
// });

onMounted(async () => {
    await userStore.findProfile();
});
</script>

<template>
    <div>{{ userProfile }}</div>
</template>

<style lang="scss" scoped></style>
