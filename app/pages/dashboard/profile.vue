<script setup lang="ts">
import { USER_KEYS } from "~/constants/user.constant";

const userStore = useUserStore();
const { userProfile } = storeToRefs(userStore);
const toast = useToast();

const initials = computed(() =>
    (userProfile.value?.full_name || userProfile.value?.username || "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(""),
);

const formattedDate = (value?: string) => {
    if (!value) return "-";
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(value));
};

const profileError = computed(() => userStore.getError(USER_KEYS.findProfile));

async function loadProfile() {
    await userStore.findProfile();

    if (!userProfile.value && profileError.value) {
        toast.add({
            title: "Gagal memuat profil",
            description: profileError.value,
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    }
}

onMounted(loadProfile);
definePageMeta({ layout: "dashboard", ssr: false });
useHead({ title: "Dashboard | Profile" });
</script>

<template>
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div>
            <h1 class="text-xl font-semibold text-highlighted">My profile</h1>
            <p class="mt-1 text-sm text-muted">
                Informasi akun dan akses Anda di WMS.GO.
            </p>
        </div>

        <div
            v-if="userStore.isLoading(USER_KEYS.findProfile)"
            class="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        >
            <USkeleton class="h-72 rounded-xl" />
            <USkeleton class="h-72 rounded-xl" />
        </div>

        <UAlert
            v-else-if="profileError && !userProfile"
            title="Profil tidak dapat dimuat"
            :description="profileError"
            color="error"
            icon="i-lucide-circle-alert"
            variant="subtle"
        >
            <template #actions>
                <UButton
                    label="Coba lagi"
                    color="error"
                    variant="soft"
                    @click="loadProfile"
                />
            </template>
        </UAlert>

        <template v-else-if="userProfile">
            <div
                class="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
                <UCard>
                    <div class="flex flex-col items-center text-center">
                        <UAvatar
                            :text="initials"
                            size="3xl"
                            class="mb-4 bg-amber-400 text-2xl font-bold text-neutral-950"
                        />
                        <h2 class="text-xl font-semibold text-highlighted">
                            {{ userProfile.full_name }}
                        </h2>
                        <p class="mt-1 text-sm text-muted">
                            @{{ userProfile.username }}
                        </p>
                        <UBadge
                            :color="
                                userProfile.status === 'ACTIVE'
                                    ? 'success'
                                    : 'neutral'
                            "
                            variant="subtle"
                            class="mt-4"
                        >
                            {{
                                userProfile.status === "ACTIVE"
                                    ? "Aktif"
                                    : "Nonaktif"
                            }}
                        </UBadge>
                    </div>

                    <USeparator class="my-6" />

                    <dl class="space-y-4 text-sm">
                        <div class="flex items-start justify-between gap-4">
                            <dt class="text-muted">Email</dt>
                            <dd class="text-right font-medium text-highlighted">
                                {{ userProfile.email }}
                            </dd>
                        </div>
                        <div class="flex items-start justify-between gap-4">
                            <dt class="text-muted">Role</dt>
                            <dd class="text-right font-medium text-highlighted">
                                {{
                                    userProfile.roles?.name || "Belum ada role"
                                }}
                            </dd>
                        </div>
                        <div class="flex items-start justify-between gap-4">
                            <dt class="text-muted">Bergabung</dt>
                            <dd class="text-right font-medium text-highlighted">
                                {{ formattedDate(userProfile.created_at) }}
                            </dd>
                        </div>
                    </dl>
                </UCard>

                <div class="flex flex-col gap-6">
                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                                >
                                    <UIcon
                                        name="i-lucide-warehouse"
                                        class="size-5"
                                    />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-highlighted">
                                        Assigned location
                                    </h3>
                                    <p class="text-xs text-muted">
                                        Warehouse yang terhubung ke akun Anda
                                    </p>
                                </div>
                            </div>
                        </template>

                        <div
                            v-if="userProfile.location"
                            class="grid gap-4 sm:grid-cols-2"
                        >
                            <div>
                                <p class="text-xs text-muted">Warehouse</p>
                                <p class="mt-1 font-medium text-highlighted">
                                    {{ userProfile.location.name }}
                                </p>
                            </div>
                            <div>
                                <p class="text-xs text-muted">Kode</p>
                                <p
                                    class="mt-1 font-mono font-medium text-highlighted"
                                >
                                    {{ userProfile.location.code }}
                                </p>
                            </div>
                            <div class="sm:col-span-2">
                                <p class="text-xs text-muted">Alamat</p>
                                <p class="mt-1 text-sm text-highlighted">
                                    {{ userProfile.location.address || "-" }}
                                </p>
                            </div>
                        </div>
                        <div
                            v-else
                            class="flex items-center gap-3 text-sm text-muted"
                        >
                            <UIcon name="i-lucide-map-pin-off" class="size-5" />
                            Belum ada warehouse yang ditugaskan.
                        </div>
                    </UCard>

                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                                >
                                    <UIcon
                                        name="i-lucide-shield-check"
                                        class="size-5"
                                    />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-highlighted">
                                        Permissions
                                    </h3>
                                    <p class="text-xs text-muted">
                                        Akses yang tersedia untuk akun Anda
                                    </p>
                                </div>
                            </div>
                        </template>

                        <div
                            v-if="userProfile.permissions?.length"
                            class="flex flex-wrap gap-2"
                        >
                            <UBadge
                                v-for="permission in userProfile.permissions"
                                :key="permission"
                                color="neutral"
                                variant="subtle"
                            >
                                {{ permission }}
                            </UBadge>
                        </div>
                        <p v-else class="text-sm text-muted">
                            Belum ada permission.
                        </p>
                    </UCard>
                </div>
            </div>

            <UCard>
                <div class="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                        <p class="text-xs text-muted">User ID</p>
                        <p
                            class="mt-1 break-all font-mono text-xs text-highlighted"
                        >
                            {{ userProfile.id }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-muted">Terakhir diperbarui</p>
                        <p class="mt-1 text-highlighted">
                            {{ formattedDate(userProfile.updated_at) }}
                        </p>
                    </div>
                </div>
            </UCard>
        </template>
    </div>
</template>
