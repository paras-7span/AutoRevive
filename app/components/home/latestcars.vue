<template>
    <UContainer class="mb-6 mt-8">
        <div class="mb-3 flex justify-between">

            <h3 class="text-2xl md:text-3xl font-bold text-black">Latest on <span
                    class="text-primary-50">AutoRevive</span></h3>

            <UButton trailing-icon="material-symbols:arrow-forward-rounded" to="/cars" label="View All Cars"
                variant="link" class="text-black hover:text-primary-50 hover:bg-white" />
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="w-full flex flex-col gap-2">
                <USkeleton class="h-48 w-full rounded-xl" />
                <USkeleton class="h-5 w-full" />
                <div class="flex gap-2">
                    <USkeleton class="h-10 w-1/3" />
                    <USkeleton class="h-10 w-1/3" />
                    <USkeleton class="h-10 w-1/3" />
                </div>
                <USkeleton class="h-10 w-full" />
            </div>
        </div>

        <UPageGrid v-else :ui="{ base: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' }">
            <CarCard :car="car" v-for="car in latestCars" :key="car.id" />
        </UPageGrid>
    </UContainer>
</template>

<script setup>
const { getItems } = useDirectusItems()

const latestCars = ref([])
const isLoading = ref(true)

async function fetchLatestCars() {
    isLoading.value = true
    try {
        const res = await getItems({
            collection: 'cars',
            params: {
                fields: [
                    'id',
                    'brand.name',
                    'model',
                    'variant',
                    'km_driven',
                    'original_price',
                    'cover_image',

                    'fuel_type.name',
                    'transmission.name',
                    'additional_badge',
                    'registration_year',

                ],
                filter: {
                    status: {
                        _eq: 'published'
                    }
                },
                limit: 4,
                sort: ['-date_created']
            }
        })

        latestCars.value = res.map(item => ({
            id: item?.id,
            brand: item?.brand?.name || '',
            model: item?.model || '',
            variant: item?.variant || '',
            mileage: item?.mileage || '',
            km_driven: item?.km_driven || 0,
            discounted_price: item?.discounted_price || 0,
            original_price: item?.original_price || '',
            emi_per_month: item?.emi_per_month || 0,
            cover_image: item?.cover_image || '',
            path: item?.slug,
            fuel_type: item?.fuel_type?.name || '',
            transmission: item?.transmission?.name || '',
            additional_badge: item?.additional_badge || '',
            registration_year: item?.registration_year || '',
            engine: item?.engine || ''
        }))
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchLatestCars()
})
</script>