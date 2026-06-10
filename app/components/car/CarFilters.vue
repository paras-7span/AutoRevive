<template>
    <div
        class="w-full lg:w-1/5 flex flex-col gap-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md sticky h-fit top-20 py-4 px-4 shadow-xs shrink-0">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-1">
            <h3 class="font-bold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <UIcon name="i-heroicons-funnel" class="w-5 h-5 text-neutral-500" />
                Filters
            </h3>

            <UButton label="Clear All" variant="ghost" color="neutral" size="xs" @click="$emit('resetFilters')" />
        </div>

        <!-- PRICE RANGE -->
        <UAccordion :items="[
            {
                label: 'Price Range',
                slot: 'price'
            }
        ]">
            <template #price>
                <USlider :model-value="priceRange" @update:model-value="$emit('update:priceRange', $event)"
                    :min="minPrice" :max="maxPrice" :step="50000" color="neutral" :ui="{ root: 'px-5 py-4' }" />

                <p v-if="priceRange?.length === 2">
                    ₹{{ priceRange[0]?.toLocaleString() }}
                    -
                    ₹{{ priceRange[1]?.toLocaleString() }}
                </p>
            </template>
        </UAccordion>


        <!-- BRANDS -->
        <div v-if="isbrandsloading" class="flex items-center justify-center">
            <div class="w-full flex flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <USkeleton class="h-5 w-5" />
                    <USkeleton class="h-5 w-20" />
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-0">
            <UAccordion :items="[
                {
                    label: 'Brand',
                    slot: 'brands'
                }
            ]">
                <template #brands>
                    <UCheckboxGroup :model-value="brandValue" @update:model-value="$emit('update:brandValue', $event)"
                        value-key="label" :items="brands" color="neutral" orientation="vertical" :ui="{
                            fieldset:
                                'flex flex-col overflow-y-auto max-h-40 gap-2'
                        }" />
                </template>
            </UAccordion>
        </div>

        <!-- FUEL -->
        <div v-if="isfueltypesloading" class="flex items-center justify-center">
            <div class="w-full flex flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <USkeleton class="h-5 w-5" />
                    <USkeleton class="h-5 w-20" />
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-2">
            <UAccordion :items="[
                {
                    label: 'Fuel Type',
                    slot: 'fuel'
                }
            ]">
                <template #fuel>
                    <UCheckboxGroup :model-value="fuelValue" @update:model-value="$emit('update:fuelValue', $event)"
                        value-key="label" :items="fuelTypes" color="neutral" orientation="vertical" :ui="{
                            fieldset: 'flex flex-col gap-2'
                        }" />
                </template>
            </UAccordion>
        </div>

        <!-- TRANSMISSION -->
        <div v-if="istransmissionloading" class="flex items-center justify-center">
            <div class="w-full flex flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <USkeleton class="h-5 w-5" />
                    <USkeleton class="h-5 w-20" />
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-2">
            <UAccordion :items="[
                {
                    label: 'Transmission',
                    slot: 'transmission'
                }
            ]">
                <template #transmission>
                    <UCheckboxGroup :model-value="transmissionValue"
                        @update:model-value="$emit('update:transmissionValue', $event)" value-key="label"
                        :items="transmissions" color="neutral" orientation="vertical" :ui="{
                            fieldset: 'flex flex-col gap-2'
                        }" />
                </template>
            </UAccordion>
        </div>

        <!-- BODY TYPE -->
        <div v-if="isbodytypesloading" class="flex items-center justify-center">
            <div class="w-full flex flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <USkeleton class="h-5 w-5" />
                    <USkeleton class="h-5 w-20" />
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-2">
            <UAccordion :items="[
                {
                    label: 'Body Type',
                    slot: 'body'
                }
            ]">
                <template #body>
                    <UCheckboxGroup :model-value="bodyValue" @update:model-value="$emit('update:bodyValue', $event)"
                        value-key="label" :items="bodyTypes" color="neutral" orientation="vertical" :ui="{
                            fieldset: 'flex flex-col gap-2'
                        }" />
                </template>
            </UAccordion>
        </div>

        <!-- OWNER -->
        <div v-if="isownershiploading" class="flex items-center justify-center">
            <div class="w-full flex flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <USkeleton class="h-5 w-5" />
                    <USkeleton class="h-5 w-20" />
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-2">
            <UAccordion :items="[
                {
                    label: 'Owner',
                    slot: 'owner'
                }
            ]">
                <template #owner>
                    <UCheckboxGroup :model-value="ownerValue" @update:model-value="$emit('update:ownerValue', $event)"
                        value-key="label" :items="ownerships" color="neutral" orientation="vertical" :ui="{
                            fieldset: 'flex flex-col gap-2'
                        }" />
                </template>
            </UAccordion>
        </div>

        <!-- REGISTRATION YEAR -->
        <div class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-black mb-1">
                Registration Year
            </span>

            <USlider :model-value="registrationYear" @update:model-value="$emit('update:registrationYear', $event)"
                :min="2005" :max="2026" :step="1" color="neutral" />

            <p>{{ registrationYear }}</p>
        </div>

        <!-- KM DRIVEN -->
        <div class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-black mb-1">
                KM Driven
            </span>

            <USlider :model-value="kmDriven" @update:model-value="$emit('update:kmDriven', $event)" :min="0"
                :max="100000" :step="1000" color="neutral" />

            <p>{{ kmDriven }}</p>
        </div>
    </div>
</template>

<script setup>
// what data parent sends to child
defineProps({
    priceRange: Array,
    minPrice: Number,
    maxPrice: Number,

    registrationYear: Number,
    kmDriven: Number,

    brandValue: Array,
    fuelValue: Array,
    transmissionValue: Array,
    bodyValue: Array,
    ownerValue: Array,

    brands: Array,
    fuelTypes: Array,
    transmissions: Array,
    bodyTypes: Array,
    ownerships: Array,

    isbrandsloading: Boolean,
    isfueltypesloading: Boolean,
    istransmissionloading: Boolean,
    isbodytypesloading: Boolean,
    isownershiploading: Boolean
})



// what events child can send to parent
defineEmits([
    'update:priceRange',
    'update:registrationYear',
    'update:kmDriven',

    'update:brandValue',
    'update:fuelValue',
    'update:transmissionValue',
    'update:bodyValue',
    'update:ownerValue',

    'resetFilters'
])
</script>