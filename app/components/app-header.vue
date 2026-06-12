<script setup>
import { useRouter, useRoute } from '#app';
const router = useRouter();
const route = useRoute();

const searchquery = ref('')
watch(
    () => route.query.q,
    (newQ) => {
        searchquery.value = newQ || ''
    },
    { immediate: true }
)

watch(
    () => route.path,
    (newPath) => {
        if (!newPath.startsWith('/cars')) {
            searchquery.value = ''
        }
    }
)

const debouncegetcars = useDebounceFn(() => {
    if (searchquery.value) {
        router.push(`/cars/?q=${searchquery.value}`)
    } else {
        router.push(`/cars`)
    }
}, 500)
</script>

<template>
    <UHeader>
        <template #title>
            <NuxtLink to="/">
                <NuxtImg src="/autorevicelogo.png" class="h-8 w-auto" />
            </NuxtLink>
        </template>

        <template #default>
            <div class="flex gap-3">
                <UButton icon="i-solar:home-outline" label="Home" to="/" variant="ghost"
                    class="text-black hover:bg-gray-100 hover:text-black" color="neutral" />
                <UButton icon="material-symbols:directions-car-outline" label="Buy Cars" to="/cars" variant="ghost"
                    class="text-black hover:bg-gray-100 hover:text-black" color="neutral" />
            </div>
        </template>

        <template #right>
            <UInput :ui="{ base: 'ring-gray-400 focus-visible:ring-gray-500' }" placeholder="Search..."
                v-model="searchquery" @input="debouncegetcars" leading-icon="i-heroicons-magnifying-glass"
                class="hidden md:block " />
            <!-- <UColorModeButton /> -->


        </template>
        <template #body>
            <div class="px-2 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <UInput v-model="searchquery" placeholder="Search cars, Brands"
                    class="w-full text-black dark:text-white md:hidden" icon="i-heroicons-magnifying-glass"
                    @input="debouncegetcars" />
                <UButton icon="i-solar:home-outline" label="Home" to="/" variant="ghost"
                    class="text-black hover:bg-primary-600 hover:text-white" color="neutral" /><br />
                <UButton icon="material-symbols:directions-car-outline" label="Buy Cars" to="/cars" variant="ghost"
                    class="text-black hover:bg-secondary-600 hover:text-white" color="neutral" />

            </div>
        </template>
    </UHeader>
</template>
