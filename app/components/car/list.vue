<template>
    <UContainer class="flex flex-col lg:flex-row gap-6 mx-auto">

        <!-- filter bar -->
        <CarFilters v-model:priceRange="priceRange" v-model:registrationYear="registrationYear"
            v-model:kmDriven="kmDriven" v-model:brandValue="brandValue" v-model:fuelValue="fuelValue"
            v-model:transmissionValue="transmissionValue" v-model:bodyValue="bodyValue" v-model:ownerValue="ownerValue"
            :minPrice="minPrice" :maxPrice="maxPrice" :minKm="minKm" :maxKm="maxKm" :minYear="minYear"
            :maxYear="maxYear" :brands="brands" :fuelTypes="fuelTypes" :transmissions="transmissions"
            :bodyTypes="bodyTypes" :ownerships="ownerships" @resetFilters="resetFilters" />

        <!-- right side -->
        <div class="w-full">

            <!-- SORT -->
            <div class="w-full p-2 flex items-center justify-end">
                <UDropdownMenu :items="sortOptions">

                    <UButton :label="sortBy
                        ? sortOptions.flat().find(o => o.value === sortBy)?.label
                        : 'Sort By'" color="neutral" variant="outline" icon="material-symbols:sort" />

                </UDropdownMenu>
            </div>

            <!-- skeleton -->
            <div v-if="isloading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="i in 6" :key="i">
                    <div class="w-full flex flex-col gap-2">

                        <USkeleton class="h-50 w-full rounded-xl" />

                        <USkeleton class="h-5 w-full" />

                        <div class="flex gap-2">
                            <USkeleton class="h-10 w-1/3" />
                            <USkeleton class="h-10 w-1/3" />
                            <USkeleton class="h-10 w-1/3" />
                        </div>
                        <USkeleton class="h-10 w-full" />
                    </div>
                </div>
            </div>

            <!-- car card grid -->
            <div v-else-if="cars.length">

                <UPageGrid :ui="{
                    base: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                }">

                    <CarCard v-for="car in visibleCars" :key="car.id" :car="car" />

                    <!-- load more skeleton -->
                    <template v-if="loadingMore">
                        <div v-for="i in 6" :key="`load-${i}`">
                            <div class="w-full flex flex-col gap-2">
                                <USkeleton class="h-50 w-full rounded-xl" />
                                <USkeleton class="h-5 w-full" />
                                <div class="flex gap-2">
                                    <USkeleton class="h-10 w-1/3" />
                                    <USkeleton class="h-10 w-1/3" />
                                    <USkeleton class="h-10 w-1/3" />
                                </div>
                                <USkeleton class="h-10 w-full" />
                            </div>
                        </div>
                    </template>
                </UPageGrid>

                <!-- observer trigger -->
                <div ref="loadTrigger" class="h-20 flex items-center justify-center">
                    <p v-if="visibleCount >= cars.length" class="text-sm text-gray-400">
                        No more cars available
                    </p>
                </div>

            </div>

            <!-- if no more cars available -->
            <div v-else class="flex items-center justify-center flex-col gap-2">
                <NuxtImg src="/nocarfound.png" class="h-96 w-auto mx-auto" />
                <p class="text-center text-lg font-bold">
                    No cars found, Try adjusting your filters
                </p>
            </div>
        </div>
    </UContainer>
</template>

<script setup>

const { getItems } = useDirectusItems()

const sortOptions = [[{ label: 'Price: Low to High', value: 'price_low_to_high', onSelect: () => { sortBy.value = 'price_low_to_high' } },
{
    label: 'Price: High to Low', value: 'price_high_to_low', onSelect: () => {
        sortBy.value = 'price_high_to_low'
    }
},

{
    label: 'Newest First',
    value: 'newest_first',
    onSelect: () => {
        sortBy.value = 'newest_first'
    }
},

{
    label: 'Oldest First',
    value: 'oldest_first',
    onSelect: () => {
        sortBy.value = 'oldest_first'
    }
},

{
    label: 'KM: Low to High',
    value: 'km_low_to_high',
    onSelect: () => {
        sortBy.value = 'km_low_to_high'
    }
}
]
]
const cars = ref([])
const error = ref(null)
const isloading = ref(true)
// infinite scroll
const visibleCount = ref(6)
const loadingMore = ref(false)
const loadTrigger = ref(null)
let observer = null

// visible cars
const visibleCars = computed(() => {
    return cars.value.slice(0, visibleCount.value)
})

// load more
async function loadMoreCars() {

    if (
        loadingMore.value ||
        visibleCount.value >= cars.value.length
    ) return
    loadingMore.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    visibleCount.value += 6
    loadingMore.value = false
}

async function fetchcars() {
    isloading.value = true
    const baseFilters = [
        {
            status: {
                _eq: 'published'
            }
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
    if (registrationYear.value.length === 2) {
        baseFilters.push({
            registration_year: {
                _between: [
                    Number(registrationYear.value[0]),
                    Number(registrationYear.value[1])
                ]
            }
        })
    }
    if (kmDriven.value.length === 2) {
        baseFilters.push({
            km_driven: {
                _between: [
                    Number(kmDriven.value[0]),
                    Number(kmDriven.value[1])
                ]
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
                },

                sort: (() => {
                    const map = {
                        price_low_to_high: ['original_price'],
                        price_high_to_low: ['-original_price'],
                        newest_first: ['-registration_year'],
                        oldest_first: ['registration_year'],
                        km_low_to_high: ['km_driven']
                    }
                    return sortBy.value
                        ? map[sortBy.value]
                        : ['-date_created']
                })()
            }
        })
        const parsePrice = s =>
            Number(String(s || '').replace(/,/g, ''))
        const [minP, maxP] =
            priceRange.value.length === 2
                ? [
                    priceRange.value[0],
                    priceRange.value[1]
                ]
                : [null, null]

        const filtered =
            minP !== null
                ? res.filter(item => {

                    const p = parsePrice(item.original_price)

                    return p >= minP && p <= maxP
                })
                : res
        cars.value = filtered.map(item => ({
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
            body_type: item?.body_type?.[0]?.body_types_id?.name || '',
            ownership: item?.ownership?.[0]?.ownerships_id?.name || '',
            additional_badge: item?.additional_badge || '',
            registration_year: item?.registration_year || '',
            engine: item?.engine || ''
        }))
        visibleCount.value = 6
        error.value = null

    } catch (e) {
        error.value = e
    } finally {
        isloading.value = false
    }
}


// destruct
const {
    priceRange,
    registrationYear,
    kmDriven,
    brandValue,
    fuelValue,
    transmissionValue,
    bodyValue,
    ownerValue,
    sortBy,
    searchquery,
    minPrice,
    maxPrice,
    minKm,
    maxKm,
    minYear,
    maxYear,
    brands,
    fuelTypes,
    transmissions,
    bodyTypes,
    ownerships,

    resetFilters,
    initFilters

} = await useCarFilters(fetchcars)

onMounted(async () => {
    await fetchcars()
    await initFilters()

    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                loadMoreCars()
            }

        },
        {
            threshold: 0.2
        }
    )

    if (loadTrigger.value) {
        observer.observe(loadTrigger.value)
    }

})

onBeforeUnmount(() => {

    if (observer) {
        observer.disconnect()
    }

})

</script>