<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const zonesStore = useZoneStore()

const { zone } = storeToRefs(zonesStore)

const id = route.params.id as string

onMounted(async () => {
   await zonesStore.findById(id)
})

definePageMeta({ layout: 'dashboard', ssr: false })
useHead({ title: 'Dashboard | Warehouse Zones' })
</script>
<template>
   <div class="">Zones</div>
   <pre class="">{{ zone }}</pre>
</template>
