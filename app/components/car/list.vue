<template>
    <UContainer class="flex flex-col lg:flex-row gap-6 mx-auto">

        <!-- FILTER COMPONENT -->
        <CarFilters v-model:priceRange="priceRange" v-model:registrationYear="registrationYear"
            v-model:kmDriven="kmDriven" v-model:brandValue="brandValue" v-model:fuelValue="fuelValue"
            v-model:transmissionValue="transmissionValue" v-model:bodyValue="bodyValue" v-model:ownerValue="ownerValue"
            :minPrice="minPrice" :maxPrice="maxPrice" :brands="brands" :fuelTypes="fuelTypes"
            :transmissions="transmissions" :bodyTypes="bodyTypes" :ownerships="ownerships"
            :isbrandsloading="isbrandsloading" :isfueltypesloading="isfueltypesloading"
            :istransmissionloading="istransmissionloading" :isbodytypesloading="isbodytypesloading"
            :isownershiploading="isownershiploading" @resetFilters="resetFilters" />

        <!-- RIGHT SIDE -->
        <div class="w-full lg:w-4/5">

            <!-- LOADING -->
            <div v-if="isloading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="i in 8" :key="i">
                    <div class="w-full flex flex-col gap-2">
                        <USkeleton class="h-50 w-full" />
                        <USkeleton class="h-10 w-full" />

                        <div class="flex gap-2">
                            <USkeleton class="h-10 w-1/2" />
                            <USkeleton class="h-10 w-1/2" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- CAR GRID -->
            <div v-else-if="cars.length">
                <UPageGrid :ui="{
                    base: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                }">
                    <CarCard v-for="car in cars" :key="car.id" :car="car" />
                </UPageGrid>
            </div>

            <!-- EMPTY -->
            <div v-else class="flex items-center justify-center flex-col gap-2">
                <NuxtImg src="/nocarfound.png" class="h-96 w-auto mx-auto" />

                <p class="text-center text-lg font-bold">
                    No cars found, Try adjusting your filters
                </p>
            </div>

        </div>
    </UContainer>
</template>


<!-- =============================================================== -->
<script setup>
import { ref, onMounted } from 'vue'

const { getItems } = useDirectusItems()

const cars = ref([])
const error = ref(null)
const isloading = ref(true)

async function fetchcars() {
    isloading.value = true

    const baseFilters = [
        {
            status: { _eq: 'published' }
        }
    ]


    if (searchquery.value) {
        baseFilters.push({
            _or: [
                {
                    model: {
                        _icontains: searchquery.value
                    }
                },
                {
                    brand: {
                        name: {
                            _icontains: searchquery.value
                        }
                    }
                },
                {
                    variant: {
                        _icontains: searchquery.value
                    }
                }
            ]
        })
    }


    if (priceRange.value.length === 2) {
        baseFilters.push({
            price_range: {
                _between: [
                    Number(priceRange.value[0]),
                    Number(priceRange.value[1])
                ]
            }
        })
    }

    if (registrationYear.value > 2005) {
        baseFilters.push({
            registration_year: {
                _gte: registrationYear.value
            }
        })
    }

    if (kmDriven.value) {
        baseFilters.push({
            km_driven: {
                _lte: kmDriven.value
            }
        })
    }

    if (brandValue.value.length) {
        baseFilters.push({
            brand: {
                name: {
                    _in: brandValue.value
                }
            }
        })
    }

    if (fuelValue.value.length) {
        baseFilters.push({
            fuel_type: {
                name: {
                    _in: fuelValue.value
                }
            }
        })
    }


    if (transmissionValue.value.length) {
        baseFilters.push({
            transmission: {
                name: {
                    _in: transmissionValue.value
                }
            }
        })
    }

    if (bodyValue.value.length) {
        baseFilters.push({
            body_type: {
                body_types_id: {
                    name: {
                        _in: bodyValue.value
                    }
                }
            }
        })
    }

    if (ownerValue.value.length) {
        baseFilters.push({
            ownership: {
                ownerships_id: {
                    name: {
                        _in: ownerValue.value
                    }
                }
            }
        })
    }

    try {
        const res = await getItems({
            collection: 'cars',
            params: {
                fields: [
                    'id',
                    'brand.name',
                    'model',
                    'variant',
                    'milage',
                    'km_driven',
                    'discounted_price',
                    'original_price',
                    'emi_per_month',
                    'cover_image',
                    'slug',
                    'price_range',
                    'fuel_type.name',
                    'transmission.name',
                    'body_type.body_types_id.name',
                    'ownership.ownerships_id.name',
                    'additional_badge',
                    'registration_year',
                    'engine'
                ],

                filter: {
                    _and: baseFilters
                }
            }
        })

        cars.value = res.map(item => ({
            id: `/cars/${item?.id}`,
            brand: item?.brand?.name || '',
            model: item?.model || '',
            variant: item?.variant || '',
            mileage: item?.mileage || '',
            km_driven: item?.km_driven || 0,
            discounted_price:
                item?.discounted_price || 0,
            original_price:
                item?.original_price || 0,
            emi_per_month:
                item?.emi_per_month || 0,
            cover_image: item?.cover_image || '',
            path: item?.slug,
            price_range:
                item?.price_range || '',
            fuel_type:
                item?.fuel_type?.name || '',
            transmission:
                item?.transmission?.name || '',
            body_type:
                item?.body_type?.[0]?.body_types_id
                    ?.name || '',
            ownership:
                item?.ownership?.[0]
                    ?.ownerships_id?.name || '',
            additional_badge:
                item?.additional_badge || '',
            registration_year:
                item?.registration_year || '',
            engine: item?.engine || ''
        }))

        error.value = null
    } catch (e) {
        error.value = e
    } finally {
        isloading.value = false
    }
}

const {
    priceRange,
    registrationYear,
    kmDriven,

    brandValue,
    fuelValue,
    transmissionValue,
    bodyValue,
    ownerValue,

    searchquery,

    minPrice,
    maxPrice,

    brands,
    fuelTypes,
    transmissions,
    bodyTypes,
    ownerships,

    isbrandsloading,
    isfueltypesloading,
    istransmissionloading,
    isbodytypesloading,
    isownershiploading,

    // METHODS
    resetFilters,
    initFilters
} = await useCarFilters(fetchcars)

onMounted(async () => {
    await fetchcars()
    await initFilters()
})
</script>