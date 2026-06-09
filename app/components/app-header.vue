<script setup>
import { ref } from 'vue'
import { useRouter } from '#app';


const searchquery = ref('')

</script>

<template>
    <UHeader>
        <template #title>
            <NuxtLink to="/">
                <NuxtImg src="/autorevicelogo.png" class="h-12 w-auto" />
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
            <UInput placeholder="Search..." v-model="searchquery" leading-icon="i-heroicons-magnifying-glass" />
            <UColorModeButton />


        </template>
    </UHeader>
</template>
