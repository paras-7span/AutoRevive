<template>
    <UPageCard reverse :ui="{
        root: 'shadow-md',
        container: 'p-4 sm:p-4',
        description: ' flex-1 mt-4 w-full',
        body: 'w-full mt-2',
        title: 'mt-4',
        footer: 'w-full'

    }">
        <template #title>
            <div class="flex justify-between items-center">
                <div class="text-lg">
                    {{ car.registration_year }} {{ car.brand }} {{ car.model }} <span class="text-xs font-gray-500">{{
                        car.variant
                    }}</span>
                </div>
            </div>
        </template>
        <template #description>
            <div class="flex items-center justify-between ">
                <UBadge icon="material-symbols:road" variant="soft"
                    class="p-1   w-[31%]  bg-gray-100 text-black flex flex-col">
                    {{ car.km_driven }} km
                </UBadge>
                <UBadge icon="fluent:gas-pump-24-regular" variant="soft"
                    class="p-1  w-[31%] bg-gray-100 text-black flex flex-col">
                    {{ car.fuel_type }}
                </UBadge>
                <UBadge icon="material-symbols:settings-outline" variant="soft"
                    class="p-1  w-[31%]  bg-gray-100 text-black flex flex-col">

                    {{ car.transmission }}
                </UBadge>
            </div>
            <div class="text-md mt-3 flex    justify-between">
                <p class="text-md  font-semibold text-black ">₹{{ car.emi_per_month }} EMI/month</p>
                <div class="text-center">
                    <p class="text-md font-bold text-black">₹{{ car.discounted_price }}</p>
                    <p class="line-through text-sm">₹{{ car.original_price }}</p>
                </div>
            </div>

        </template>
        <!-- btns -->
        <template #footer>
            <div class="flex items-center justify-between gap-2">
                <UButton :to="`/cars/${car.id}`" label="View Details"
                    class=" justify-center  w-full active:bg-gray-900 bg-gray-900 text-white hover:bg-gray-950 " />
                <UButton :to="`/compare`" label="Compare Cars"
                    class=" justify-center  w-full active:bg-gray-900 bg-gray-900 text-white hover:bg-gray-950 " />
            </div>

        </template>
        <div class=" text-[10px] text-yellow-800 bg-yellow-100 absolute top-2 right-2 px-2 py-1 rounded-md">
            {{ car.additional_badge }}</div>

        <NuxtImg :src="getAssetsUrl(car.cover_image)" :alt="car.brand + ' ' + car.model + ' ' + car.variant"
            class="w-full h-48 object-contain " />
    </UPageCard>
</template>
<script setup>
const props = defineProps({
    car: {
        type: Object,
        required: true
    }
})


</script>