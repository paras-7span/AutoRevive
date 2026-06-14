<template>
    <UContainer class="my-4 ">
        <div class="flex flex-col mb-3 items-center justify-center">
            <h2 class=" text-2xl md:text-3xl font-bold text-black">Popular Brands</h2>
            <p class="text-gray-400">Choose from most reliable brands.</p>
        </div>
        <div class="flex flex-wrap  justify-evenly gap-y-4 py-2">
            <div class="flex items-center justify-center hover:scale-105 duration-400  transition" v-for="i in images"
                :key="i">
                <NuxtImg :src="i" class="h-24 w-24 object-contain ring ring-default rounded-lg shadow-lg p-1"
                    alt="Brand Logo" />
            </div>
        </div>

    </UContainer>

</template>
<script setup>
const images = ['/carcompanies/ford-logo.png', '/carcompanies/honda-logo.png', '/carcompanies/hyundai-logo.png', '/carcompanies/Kia-logo.jpg', '/carcompanies/jeep-logo.png', '/carcompanies/mg-logo.png', '/carcompanies/Mahindra-logo.jpg', '/carcompanies/Suzuki-logo.jpg', '/carcompanies/toyota-logo-2020.png', '/carcompanies/Volkswagen-logo.jpg']

</script>