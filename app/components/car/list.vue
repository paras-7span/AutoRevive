<template>
    <UContainer class="flex flex-col lg:flex-row gap-6  mx-auto">
        <!-- Left Filter Panel -->
        <div
            class="w-full lg:w-2/5 flex flex-col gap-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md sticky h-fit top-20 py-4 px-4  shadow-xs">
            <div
                class="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-1">
                <h3 class="font-bold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                    <UIcon name="i-heroicons-funnel" class="w-5 h-5 text-neutral-500" />
                    Filters
                </h3>
                <UButton label="Clear All" variant="ghost" color="neutral" size="xs" @click="resetFilters" />

            </div>


            <!-- All Filters  -->
            <div class="flex flex-col gap-2">
                <UBadge variant="subtle" class="mb-2 text-white bg-secondary-500 ">Price Range</UBadge>
                <USlider v-model="priceRange" color="neutral" :min="100000" :max="2500000" :step="10000"
                    :default-value="100000" />
                <p>{{ priceRange }}Rs.</p>
            </div>

            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">Brands</UBadge>
                <UCheckboxGroup :ui="{ fieldset: 'flex flex-wrap gap-x-2', }" color="neutral" orientation="horizontal"
                    v-model="brandValue" :items="brands" />

            </div>
            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">Fuel Type</UBadge>
                <UCheckboxGroup :ui="{ fieldset: 'flex flex-wrap gap-x-2', }" color="neutral" orientation="horizontal"
                    v-model="fuelValue" :items="fueltype" />

            </div>
            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">Transmission</UBadge>
                <UCheckboxGroup :ui="{ fieldset: 'flex flex-wrap gap-x-2', }" color="neutral" orientation="horizontal"
                    v-model="transmissionValue" :items="transmissions" />

            </div>
            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">Body Type</UBadge>
                <UCheckboxGroup :ui="{ fieldset: 'flex flex-wrap gap-x-2', }" color="neutral" orientation="horizontal"
                    v-model="bodyValue" :items="bodytypes" />


            </div>
            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">Owner</UBadge>
                <UCheckboxGroup :ui="{ fieldset: 'flex flex-wrap gap-x-2', }" color="neutral" orientation="horizontal"
                    v-model="ownerValue" :items="ownerships" />


            </div>
            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">Registration Year</UBadge>
                <USlider v-model="registrationYear" color="neutral" :min="2005" :max="2026" :step="1"
                    :default-value="2005" />
                <p>{{ registrationYear }}</p>
            </div>
            <div class="flex flex-col gap-2">
                <UBadge class="mb-2  text-white bg-secondary-500" variant="subtle">KM Driven</UBadge>
                <USlider v-model="kmDriven" color="neutral" :min="0" :max="150000" :step="5000" :default-value="0" />
                <p>{{ kmDriven }}</p>

            </div>
        </div>

        <div class="w-full">
            <div v-if="isloading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div v-else-if="cars.length">
                <UPageGrid :ui="{ base: 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4' }">
                    <CarCard v-for="car in cars" :key="car.id" :car="car" />
                </UPageGrid>

            </div>
            <div v-else class="flex items-center justify-center flex-col gap-2">
                <NuxtImg src="/nocarfound.png" class="h-96 w-auto mx-auto" />
                <p class="text-center text-lg font-bold">No cars found, Try adjusting your filters</p>
            </div>
        </div>
    </UContainer>
</template>


<!-- =============================================================== -->
<script setup>
import { ref, watch } from 'vue'



const { getItems } = useDirectusItems()

const priceRange = ref()
const registrationYear = ref()
const kmDriven = ref()
const brandValue = ref([])
const fuelValue = ref([])
const transmissionValue = ref([])
const bodyValue = ref([])
const ownerValue = ref([])

// const formatField = (val) => {
//     if (Array.isArray(val)) {
//         return val.join(', ')
//     }
//     return val || ''
// }

const cars = ref([])
const error = ref(null)
const isloading = ref(true)

async function fetchcars() {
    isloading.value = true;
    const baseFilters = [
        {
            status: {
                _eq: 'published'
            }
        }
    ]

    if (priceRange.value) {
        baseFilters.push({
            price_range: {
                _lte: priceRange.value
            }
        })
    }
    if (registrationYear.value) {
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
    if (brandValue.value && brandValue.value.length) {
        baseFilters.push({
            brand: {
                brands_id: {
                    id: {
                        _in: brandValue.value
                    }
                }
            }
        })
    }
    if (fuelValue.value && fuelValue.value.length) {
        baseFilters.push({
            fuel_type: {
                fuel_type_id: {
                    id: {
                        _in: fuelValue.value
                    }
                }
            }
        })
    }
    if (transmissionValue.value && transmissionValue.value.length) {
        baseFilters.push({
            transmission: {
                transmissions_id: {
                    id: {
                        _in: transmissionValue.value
                    }
                }
            }
        })
    }
    if (bodyValue.value && bodyValue.value.length) {
        baseFilters.push({
            body_type: {
                body_types_id: {
                    id: {
                        _in: bodyValue.value
                    }
                }
            }
        })
    }
    if (ownerValue.value && ownerValue.value.length) {
        baseFilters.push({
            ownership: {
                ownerships_id: {
                    id: {
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
                    'id', 'brand.brands_id.name', 'model', 'variant', 'milage', 'km_driven', 'discounted_price', 'original_price', 'emi_per_month', 'cover_image', 'slug', 'price_range', 'fuel_type.fuel_type_id.name', 'transmission.transmissions_id.name', 'body_type.body_types_id.name', 'ownership.ownerships_id.name', 'additional_badge', 'registration_year', 'engine'
                ],
                filter: {
                    _and: baseFilters
                }
            }
        })
        cars.value = res.map((item) => {
            return {
                id: `/cars/${item?.id}`,
                brand: item?.brand?.[0]?.brands_id?.name || '',
                model: item?.model || '',
                variant: item?.variant || '',
                mileage: item?.mileage || '',
                km_driven: item?.km_driven || 0,
                discounted_price: item?.discounted_price || 0,
                original_price: item?.original_price || 0,
                emi_per_month: item?.emi_per_month || 0,
                cover_image: item?.cover_image || '',
                path: item?.slug,
                price_range: item?.price_range || '',
                fuel_type: item?.fuel_type?.[0]?.fuel_type_id?.name || '',
                transmission: item?.transmission?.[0]?.transmissions_id?.name || '',
                body_type: item?.body_type?.[0]?.body_types_id?.name || '',
                ownership: item?.ownership?.[0]?.ownerships_id?.name || '',
                additional_badge: item?.additional_badge || '',
                registration_year: item?.registration_year || '',
                engine: item?.engine || ''
            }
        })
        error.value = null
    } catch (e) {
        error.value = e
    }
    finally {
        isloading.value = false
    }
}


// Watch filters
watch([priceRange, registrationYear, kmDriven, brandValue, fuelValue, transmissionValue, bodyValue, ownerValue], fetchcars)


console.log("cars :", cars.value);

// ============= Brand ==================

const isbrandsloading = ref(false)
const { data: brands } = await useAsyncData
    ("brands", async () => {
        isbrandsloading.value = true;
        return await getItems(
            {
                collection: 'brands',
                params: {
                    fields: [
                        'id', 'name'
                    ],
                }
            }).then((res) => {
                return res.map((item) => {
                    return {
                        id: `/cars/${item?.id}`,
                        label: item?.name || '',
                        value: item?.id || ''
                    }
                })
            })
    }
    )
isbrandsloading.value = false;

// ============= Fuel Type ==================

const isfuelloading = ref(false)
const { data: fueltype } = await useAsyncData
    ("fuel_type", async () => {
        isfuelloading.value = true;
        return await getItems(
            {
                collection: 'fuel_type',
                params: {
                    fields: [
                        'id', 'name'
                    ],
                }
            }).then((res) => {
                return res.map((item) => {
                    return {
                        id: `/cars/${item?.id}`,
                        label: item?.name || '',
                        value: item?.id || ''
                    }
                })
            })
    }
    )
isfuelloading.value = false;

// ============= Transmission Type ==================

const istransmissionsloading = ref(false)
const { data: transmissions } = await useAsyncData
    ("transmissions", async () => {
        istransmissionsloading.value = true;
        return await getItems(
            {
                collection: 'transmissions',
                params: {
                    fields: [
                        'id', 'name'
                    ],
                }
            }).then((res) => {
                return res.map((item) => {
                    return {
                        id: `/cars/${item?.id}`,
                        label: item?.name || '',
                        value: item?.id || ''
                    }
                })
            })
    }
    )
istransmissionsloading.value = false;

// ============= Body Type ==================

const isbodytypesloading = ref(false)
const { data: bodytypes } = await useAsyncData
    ("body_types", async () => {
        isbodytypesloading.value = true;
        return await getItems(
            {
                collection: 'body_types',
                params: {
                    fields: [
                        'id', 'name'
                    ],
                }
            }).then((res) => {
                return res.map((item) => {
                    return {
                        id: `/cars/${item?.id}`,
                        label: item?.name || '',
                        value: item?.id || ''
                    }
                })
            })
    }
    )
isbodytypesloading.value = false;


// ============= Owner ==================

const isownershipsloading = ref(false)
const { data: ownerships } = await useAsyncData
    ("ownerships", async () => {
        isownershipsloading.value = true;
        return await getItems(
            {
                collection: 'ownerships',
                params: {
                    fields: [
                        'id', 'name'
                    ],
                }
            }).then((res) => {
                return res.map((item) => {
                    return {
                        id: `/cars/${item?.id}`,
                        label: item?.name || '',
                        value: item?.id || ''
                    }
                })
            })
    }
    )
isownershipsloading.value = false;

console.log("Cars", cars.value)

const resetFilters = () => {
    priceRange.value = null
    registrationYear.value = null
    kmDriven.value = null
    brandValue.value = []
    fuelValue.value = []
    transmissionValue.value = []
    bodyValue.value = []
    ownerValue.value = []
}



onMounted(() => {
    fetchcars()
})



</script>
