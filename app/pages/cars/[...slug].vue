<template>
    <UContainer class="my-3">
        <UButton to="/cars" label="Back to Cars" icon="i-solar:arrow-left-line-duotone" variant="ghost"
            class=" text-black hover:bg-white hover:text-primary-50" />
        <section class="flex  md:flex-row flex-col-reverse gap-6">
            <section class="w-full lg:w-3/5 flex flex-col ">



                <!-- img -->
                <div class="w-full flex  flex-col lg:flex-row gap-8 mt-1">

                    <div class=" w-full relative">
                        <UCarousel ref="carousel" v-slot="{ item }" :items="items" class="w-full" @select="onSelect">
                            <img :src="item" class="rounded-lg w-full h-95 object-cover" loading="lazy">
                        </UCarousel>
                        <div
                            class=" text-[10px] text-yellow-800 bg-yellow-100 absolute top-2 right-2 px-2 py-1 rounded-md">
                            {{ cars?.[0]?.additional_badge }}</div>

                        <div class="flex gap-4  pt-4 justify-center   overflow-x-auto mx-auto">
                            <div v-for="(item, index) in items" :key="index"
                                class="shrink-0 h-16 w-30 border rounded-lg"
                                :class="{ 'border-2 border-primary-50': activeIndex === index }" @click="select(index)">
                                <img :src="item" class="h-full w-full object-fill  rounded-lg" loading="lazy">
                            </div>
                        </div>
                    </div>

                    <!-- =========== -->

                </div>
                <!-- spec -->
                <div class=" w-full gap-6  border border-gray-200 mt-6 rounded-lg px-4 py-2">
                    <p class="font-semibold mb-2 text-xl text-black">Specifications</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                        <!-- Left Column -->
                        <div class="space-y-3">

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900 ">Brand</span>
                                <span class=" font-semibold text-gray-500">{{ cars?.[0]?.brand }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Variant</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.variant }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Model</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.model }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Fuel Type</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.fuel_type }}</span>

                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Year</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.registration_year }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">KM Driven</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.km_driven }} km</span>
                            </div>



                        </div>

                        <!-- Right Column -->
                        <div class="space-y-3">
                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Discounted Price</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.discounted_price }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Milage</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.milage }} km</span>
                            </div>
                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Engine</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.engine }}
                                </span>
                            </div>


                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Transmission</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.transmission }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Body Type</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.body_type }}</span>
                            </div>

                            <div class="flex justify-between border-b border-gray-100 pb-3">
                                <span class="font-semibold text-gray-900">Ownership</span>
                                <span class="font-semibold text-gray-500">{{ cars?.[0]?.ownership }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- why -->
                <div class="w-full  border border-gray-200 bg-green-50 mt-6 rounded-lg px-4 py-2">
                    <p class="font-semibold mb-2 text-xl text-black">Why Choose AutoRevive?</p>
                    <div class="flex flex-col md:flex-row gap-4 md:gap-2 items-start md:items-center justify-between">
                        <div class="flex flex-row md:flex-col  items-left px-2">
                            <NuxtImg src="/icons/MaterialSymbolsShieldOutline.svg" alt="Certified" class="h-12 w-12" />
                            <div class="flex flex-col ">
                                <p class="text-sm  text-black font-bold ">Verified Cars</p>
                                <p class="text-sm  text-black ">All cars are inspected for quality and safety
                                </p>
                            </div>

                        </div>
                        <div class="flex flex-row md:flex-col items-left px-2">
                            <NuxtImg src="/icons/MaterialSymbolsDocumentScannerOutlineSharp.svg" alt="Certified"
                                class="h-10 w-10" />
                            <div class="flex flex-col ">
                                <p class="text-sm text-black font-bold ">Transparent Pricing</p>
                                <p class="text-sm text-black">No Hidden Charges or extra fees</p>

                            </div>

                        </div>
                        <div class="flex flex-row md:flex-col  items-left ">
                            <NuxtImg src="/icons/MaterialSymbolsPersonCheckOutline.svg" alt="Certified"
                                class="h-12 w-12" />
                            <div class="flex flex-col ">
                                <p class="text-sm text-black font-bold ">Hassle-free Ownership</p>
                                <p class="text-sm text-black ">Easy documentation and smooth ownership</p>

                            </div>

                        </div>

                    </div>

                </div>
                <!-- Share cars -->
                <div
                    class="flex mt-6 border border-primary-50 rounded-lg flex-col lg:flex-row  gap-2 px-4 py-2 items-center justify-between">
                    <div class="flex flex-col">
                        <p class="text-lg text-black font-bold">Liked this car? </p>
                        <p class="text-sm text-gray-500">Share this car with your friends and family</p>
                    </div>
                    <UButton label="Share this car" icon="material-symbols:share-outline"
                        class="bg-primary-50 cursor-pointer active:bg-primary-50 hover:bg-primary-50"
                        @click="shareCar" />

                </div>
            </section>

            <!-- right card -->
            <section class="w-full h-fit lg:w-2/5 border border-gray-200 md:sticky top-27  p-4  rounded-lg">

                <div class=" items-end gap-2">
                    <h1 class="text-4xl text-black font-bold mb-1">
                        {{ cars?.[0]?.brand }}
                        {{ cars?.[0]?.model }}
                        {{ cars?.[0]?.variant }}
                    </h1>
                    <p class="text-3xl text-black font-bold">₹ {{ cars?.[0].original_price }}</p>
                    <p class="text-md  text-gray-500 ">₹ {{ cars?.[0]?.emi_per_month }} EMI/Month </p>
                </div>
                <div class="mt-4 grid grid-cols-3 gap-3">
                    <div class="border flex gap-2 items-center justify-center border-gray-200  rounded-md  p-2">
                        <NuxtImg src="/icons/MaterialSymbolsSpeedRounded.svg" alt="Driven" class="h-6 w-6" />
                        <div class="flex flex-col ">
                            <p class="text-md text-black font-semibold">{{ cars?.[0]?.km_driven }}/km</p>
                            <p class="text-sm">Driven</p>
                        </div>
                    </div>
                    <div class="border flex gap-2 items-center justify-center border-gray-200  rounded-md  p-2">
                        <NuxtImg src="/icons/BiFuelPumpFill.svg" alt="Fuel Type" class="h-6 w-6" />
                        <div class="flex flex-col ">
                            <p class="text-md text-black font-semibold">{{ cars?.[0]?.fuel_type }}</p>
                            <p class="text-sm">Fuel Type</p>
                        </div>
                    </div>
                    <div class="border flex gap-2 items-center justify-center border-gray-200  rounded-md  p-2">
                        <NuxtImg src="/icons/MaterialSymbolsAutoTransmission.svg" alt="Transmission" class="h-6 w-6" />
                        <div class="flex flex-col ">
                            <p class="text-md text-black font-semibold">{{ cars?.[0]?.transmission }}</p>
                            <p class="text-sm">Transmission</p>
                        </div>
                    </div>


                </div>
                <UButton label="Book Test Drive" icon="material-symbols:calendar-month-outline-sharp"
                    class="active:bg-primary-50 justify-center py-2 w-full bg-primary-50 hover:bg-primary-50 text-white hover:text-white-100 mt-4 cursor-pointer " />
                <UButton label="Contact Seller" icon="material-symbols:call"
                    class="active:bg-white justify-center py-2 w-full border bg-white border-primary-50  text-primary-50 hover:bg-white mt-4 cursor-pointer " />
                <p class="text-left text-gray-500 text-sm md:text-base mt-6 leading-relaxed">
                    {{ cars?.[0]?.brand }} {{ cars?.[0]?.model }} in excellent condition. {{ cars?.[0]?.ownership }}
                    vehicle with genuine {{ cars?.[0]?.km_driven }}km driven. Well maintained with regular
                    servicing. {{ cars?.[0]?.engine }} engine delivers excellent performance . Spacious {{
                        cars?.[0]?.body_type }} perfect for family and adventure. All documents are clear and up to date and
                    now avilabel on <span class="font-bold text-primary-50">Auto Revive</span>.
                </p>

            </section>
        </section>
    </UContainer>
</template>

<script setup>
const { getItems } = useDirectusItems()

const route = useRoute()

const { data: cars, error } = await useAsyncData(
    'car-detail',
    async () => {
        const data = await getItems({
            collection: 'cars',
            params: {
                fields: [
                    'id',
                    'brand.name',
                    'model',
                    'variant',
                    'milage',
                    'km_driven',
                    'cover_image',
                    'discounted_price',
                    'original_price',
                    'emi_per_month',
                    'fuel_type.name',
                    'transmission.name',
                    'body_type.body_types_id.name',
                    'ownership.ownerships_id.name',
                    'additional_badge',
                    'registration_year',
                    'engine',
                    'gallery_images.directus_files_id'
                ],
                filter: {
                    id: {
                        _eq: route.params.slug.at(-1)
                    }
                }
            }
        }).then((res) => {
            return res.map((item) => ({
                id: item.id,
                brand: item?.brand?.name || '',
                cover_image: item?.cover_image || '',
                model: item?.model || '',
                variant: item?.variant || '',
                milage: item?.milage || '',
                km_driven: item?.km_driven || 0,
                discounted_price:
                    item?.discounted_price || 0,
                original_price:
                    item?.original_price || '',
                emi_per_month:
                    item?.emi_per_month || 0,
                fuel_type:
                    item?.fuel_type?.name || '',
                transmission:
                    item?.transmission?.name || '',
                body_type:
                    item?.body_type?.[0]
                        ?.body_types_id?.name || '',
                ownership:
                    item?.ownership?.[0]
                        ?.ownerships_id?.name || '',
                additional_badge:
                    item?.additional_badge || '',
                registration_year:
                    item?.registration_year || '',
                engine: item?.engine || '',
                gallery_images:
                    item?.gallery_images?.map(
                        (img) =>
                            img.directus_files_id
                    ) ?? []
            }))
        })

        return data
    }
)
console.log("cars detail :", cars.value)

const items = computed(() => {
    return cars.value?.[0]?.gallery_images.map((id) => getAssetsUrl(id)) ?? []
})
const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onSelect(index) {
    activeIndex.value = index
}

function select(index) {
    activeIndex.value = index

    carousel.value?.emblaApi?.scrollTo(index)
}

useSeoMeta({
    title: `${cars.value?.[0]?.brand} ${cars.value?.[0]?.model} | AutoRevive`,
    description: `Discover the ${cars.value?.[0]?.brand} ${cars.value?.[0]?.model}, a premium used car available at AutoRevive. Known for its stunning design, powerful performance, and exceptional reliability, this model stands out in the competitive car market. With advanced features, superior comfort, and a superior driving experience, it's the perfect choice for those seeking quality and style. Explore detailed specifications, check availability, and find the best deals on this fantastic used car at AutoRevive.`,
    ogTitle: `${cars.value?.[0]?.brand} ${cars.value?.[0]?.model} is now on AutoRevive 🚀`,
    ogDescription: `Discover the ${cars.value?.[0]?.brand} ${cars.value?.[0]?.model} on AutoRevive`,

    ogImage: getAssetsUrl(cars.value?.[0]?.gallery_images?.[0]),
    ogUrl: `https://auto-revive.vercel.app`,
    ogType: 'website',

    twitterCard: 'summary_large_image',
    twitterTitle: `${cars.value?.[0]?.brand} ${cars.value?.[0]?.model} on AutoRevive 🚀`,
    twitterDescription: `Discover the ${cars.value?.[0]?.brand} ${cars.value?.[0]?.model} on AutoRevive`,
    twitterImage: getAssetsUrl(cars.value?.[0]?.cover_image?.[0])
})

const shareCar = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link Copied!!')
}
</script>
