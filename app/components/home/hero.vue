<script setup lang="ts">


</script>

<template>
    <UPageHero :ui="{
        container: ' flex flex-col py-0 sm:py-0 lg:py-0 gap-10 sm:gap-y-0  items-center '

    }" description="Browse thousands of verified used cars with detailed
        inspection reports. Expert-vetted, transparent pricing, and delivered to your doorstep."
        orientation="horizontal">
        <template #title>
            <h1>Find Your Perfect <span class="text-primary-50">Drive</span> Today</h1>
        </template>
        <template #links>
            <div class="flex w-full justify-center lg:justify-start">
                <UButton trailing-icon="material-symbols:arrow-right-alt-rounded" label="Search Cars" size="lg"
                    to="/cars" class="text-lg bg-primary-50 hover:bg-primary-50 active:bg-primary-50" />
            </div>
        </template>
        <NuxtImg src="/hero2.png" alt="Creta" class="h-100 sm:h-96 lg:h-[calc(100vh-70px)] w-full object-contain" />
    </UPageHero>

</template>
