<template>
    <UContainer>
        {{ cars }}
        <UPageGrid :ui="{ base: 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4' }">
            <CarCard v-for="car in cars" :key="car.id" :car="car" />
        </UPageGrid>
    </UContainer>
</template>

<script setup>
const { getItems } = useDirectusItems()

const formatField = (val) => {
    if (Array.isArray(val)) {
        return val.join(', ')
    }
    return val || ''
}

const { data: cars } = await useAsyncData(
    'cars',
    async () => {
        return await getItems({
            collection: 'cars',
            params: {
                fields: [
                    'id', 'brand', 'model', 'variant', 'mileage', 'km_driven', 'discounted_price', 'original_price', 'emi_per_month', 'cover_image', 'slug', 'price_range', 'fuel_type', 'transmission', 'body_type', 'ownership', 'additional_badge', 'registration_year', 'engine'
                ]
            }
        }).then((res) => {
            return res.map((item) => {
                return {
                    id: item?.id,
                    brand: item?.brand || '',
                    model: item?.model || '',
                    variant: item?.variant || '',
                    mileage: item?.mileage || '',
                    km_driven: item?.km_driven || 0,
                    discounted_price: item?.discounted_price || 0,
                    original_price: item?.original_price || 0,
                    emi_per_month: item?.emi_per_month || 0,
                    cover_image: item?.cover_image || '',
                    path: `/cars/${item?.slug}`,
                    price_range: item?.price_range || '',
                    fuel_type: formatField(item?.fuel_type),
                    transmission: formatField(item?.transmission),
                    body_type: formatField(item?.body_type),
                    ownership: formatField(item?.ownership),
                    additional_badge: item?.additional_badge || '',
                    registration_year: item?.registration_year || '',
                    engine: item?.engine || ''
                }
            })
        })
    }
)


</script>
