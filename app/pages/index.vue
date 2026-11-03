<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

import type { AuthSchema } from '~/utils/schemas/auth.schema'

const store = useAuthStore()
const toast = useToast()
const { t, locale, setLocale, locales } = useI18n()

const authSchema = computed(() =>
   z.object({
      username: z.string().min(1, t('auth.usernameInputError')),
      password: z.string().min(1, t('auth.passwordInputError')),
   })
)

// const localeOptions = [
//    { label: 'Bahasa Indonesia', value: 'id' },
//    { label: 'English', value: 'en' },
// ]

useHead({
   title: () => t('auth.pageTitle'),
})

const state = reactive<AuthSchema>({
   username: '',
   password: '',
})

const loading = ref(false)
const showPassword = ref(false)

async function onSubmit(event: FormSubmitEvent<AuthSchema>) {
   const result = await store.login(event.data)
   if (!result.ok)
      return toast.add({
         title: t('auth.loginError'),
         description: t('auth.loginErrorDescription'),
         color: 'error',
      })
   await navigateTo('/dashboard')
}
</script>

<template>
   <UMain class="min-h-screen overflow-hidden bg-neutral-950">
      <div class="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
         <section class="relative hidden overflow-hidden bg-amber-400 p-10 text-neutral-950 lg:flex lg:flex-col lg:justify-between xl:p-16">
            <div class="absolute -right-36 -top-36 h-96 w-96 rounded-full border-[3rem] border-neutral-950/10" />
            <div class="absolute -bottom-40 -left-40 h-120 w-120 rounded-full border-[4rem] border-neutral-950/10" />

            <div class="relative">
               <div class="mb-20 flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-xl bg-neutral-950 text-lg font-black text-amber-400">W</div>
                  <span class="text-xl font-black tracking-tight">WMS.GO</span>
               </div>
               <p class="mb-5 max-w-md text-sm font-bold uppercase tracking-[0.25em] text-neutral-950/60">{{ t('auth.systemLabel') }}</p>
               <h1 class="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.04em] xl:text-7xl">{{ t('auth.heroTitle') }}</h1>
            </div>

            <div class="relative flex items-end justify-between gap-8">
               <p class="max-w-xs text-sm font-medium leading-relaxed text-neutral-950/70">
                  {{ t('auth.heroDescription') }}
               </p>
               <UIcon name="i-lucide-arrow-up-right" class="size-12 shrink-0" />
            </div>
         </section>

         <section class="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
            <USelect
               :model-value="locale"
               :items="locales"
               label-key="name"
               value-key="code"
               size="sm"
               class="absolute right-6 top-6 w-36"
               aria-label="Language"
               @update:model-value="(value) => setLocale(value)"
            />
            <div class="w-full max-w-md">
               <div class="mb-10 lg:hidden">
                  <div class="flex items-center gap-3 text-white">
                     <div class="flex size-10 items-center justify-center rounded-xl bg-amber-400 text-lg font-black text-neutral-950">W</div>
                     <span class="text-xl font-black tracking-tight">WMS.GO</span>
                  </div>
               </div>

               <div class="mb-10">
                  <div class="mb-6 flex size-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                     <UIcon name="i-lucide-boxes" class="size-7" />
                  </div>
                  <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">{{ t('auth.welcomeTitle') }}</h2>
                  <p class="mt-3 text-base leading-relaxed text-neutral-400">{{ t('auth.welcomeDescription') }}</p>
               </div>

               <UForm :schema="authSchema" :state="state" class="space-y-5" @submit="onSubmit">
                  <UFormField :label="t('auth.username')" name="username" required>
                     <UInput
                        v-model="state.username"
                        class="w-full"
                        size="xl"
                        icon="i-lucide-user"
                        :placeholder="t('auth.usernamePlaceholder')"
                        autocomplete="username"
                        :disabled="loading"
                     />
                  </UFormField>

                  <UFormField :label="t('auth.password')" name="password" required>
                     <UInput
                        v-model="state.password"
                        class="w-full"
                        size="xl"
                        icon="i-lucide-lock-keyhole"
                        :type="showPassword ? 'text' : 'password'"
                        :placeholder="t('auth.passwordPlaceholder')"
                        autocomplete="current-password"
                        :disabled="loading"
                     >
                        <template #trailing>
                           <UButton
                              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                              color="neutral"
                              variant="ghost"
                              size="sm"
                              :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                              :disabled="loading"
                              @click="showPassword = !showPassword"
                           />
                        </template>
                     </UInput>
                  </UFormField>

                  <UButton type="submit" color="primary" size="xl" block class="mt-8 font-bold" :loading="store.isLoading('login')">
                     {{ t('auth.submit') }}
                     <UIcon name="i-lucide-arrow-right" class="size-5" />
                  </UButton>
               </UForm>

               <p class="mt-10 text-center text-xs text-neutral-500">WMS.GO · {{ t('auth.footer') }}</p>
            </div>
         </section>
      </div>
   </UMain>
</template>
