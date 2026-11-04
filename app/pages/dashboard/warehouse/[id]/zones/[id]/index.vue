<template>
   <div class="">Zones</div>
   <div class="">{{ id }}</div>
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

definePageMeta({ layout: 'dashboard', ssr: false })
useHead({ title: 'Dashboard | Warehouse Zones' })
</script>
