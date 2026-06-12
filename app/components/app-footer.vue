<script setup>


</script>

<template>
    <UFooter class="border-t border-neutral-200 dark:border-neutral-700">
        <template #left>
            <div class="flex flex-col ">
                <NuxtImg src="/autorevicelogo.png" alt="Logo" class="h-7 " />
                <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }} AutoRevive</p>
            </div>
        </template>


        <template #default>
            <p>Your trusted platform for buying quality used cars.</p>
        </template>
        <template #right>

            <UButton icon="material-symbols:perm-phone-msg-outline-rounded" color="neutral" variant="ghost"
                to="https://go.nuxt.com/x" target="_blank" aria-label="X" />
            <UButton icon="material-symbols:mail-outline-rounded" color="neutral" variant="ghost"
                to="mailto:[EMAIL_ADDRESS]" target="_blank" aria-label="Gmail" />
        </template>
    </UFooter>
</template>
