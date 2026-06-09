<template>
    <UPageCard reverse :to="car.id" :ui="{
        container: 'p-1 sm:p-1',
        description: 'flex-1',

    }">
        <template #title>
            {{ car.brand }} {{ car.model }} {{ car.variant }}
        </template>
        <template #description>

            {{ car.price_range }} | {{ car.km_driven }} km | {{ car.fuel_type }} | {{ car.transmission }} | {{
                car.body_type
            }} | {{ car.ownership }} | {{ car.registration_year }} | {{ car.engine }}
        </template>

        <NuxtImg :src="getAssetsUrl(car.cover_image)" :alt="car.brand + ' ' + car.model + ' ' + car.variant"
            class="w-full h-48 object-contain rounded-t-md border-b border-gray-200" />
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