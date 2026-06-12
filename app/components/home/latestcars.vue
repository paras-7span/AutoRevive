<template>
    <UContainer class="mb-6 mt-8">
        <div class="mb-3 flex justify-between">

            <h3 class=" text-3xl font-bold text-black">Latest on <span class="text-primary-50">AutoRevive</span></h3>

            <UButton trailing-icon="material-symbols:arrow-forward-rounded" to="/cars" label="View All Cars"
                variant="link" class="text-black hover:text-black hover:bg-gray-200" />
        </div>

        <UPageGrid :ui="{ base: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' }">
            <CarCard :car="item" v-for="item in latestcar" :key="item.id" />
        </UPageGrid>
    </UContainer>
</template>
<script setup>
const { getItems } = useDirectusItems()

const { data: latestcar } = await useAsyncData('latest-cars', async () => {
    return getItems
        ({
            collection: 'cars',
            params: {
                fields: ['id',
                    'brand.name',
                    'model',
                    'km_driven',
                    'discounted_price',
                    'cover_image',
                    'fuel_type.name',
                    'transmission.name',
                    'additional_badge',
                    'registration_year',
                    'engine'
                ],
                filter: {
                    status: {
                        _eq: 'published'
                    }
                },
                limit: 4,
                sort: ['-date_created']
            }
        }).then((res) => {
            return res.map((item) => {
                return {
                    id: item.id,
                    brand: item.brand.name,
                    model: item.model,
                    km_driven: item.km_driven,
                    discounted_price: item.discounted_price,
                    cover_image: item.cover_image,
                    fuel_type: item.fuel_type.name,
                    transmission: item.transmission.name,
                    additional_badge: item.additional_badge,
                    registration_year: item.registration_year
                }
            })
        })
})
</script>