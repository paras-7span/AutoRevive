<script setup>
import { ref } from 'vue'
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
                <UButton label="Home" to="/" variant="ghost" class="text-black hover:bg-primary-600 hover:text-white"
                    color="neutral" />
                <UButton label="Buy Cars" to="/cars" variant="ghost"
                    class="text-black hover:bg-secondary-600 hover:text-white" color="neutral" />
                <!-- <UButton label="Contact" to="/contact" variant="ghost" /> -->
            </div>
        </template>

        <template #right>
            <UInput placeholder="Search..." v-model="searchquery" @input="debouncegetcars"
                leading-icon="i-heroicons-magnifying-glass" />
            <UColorModeButton />


        </template>
    </UHeader>
</template>
