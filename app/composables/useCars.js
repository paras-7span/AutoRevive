import { ref, watch } from 'vue'

export const useCarFilters = async (fetchcars) => {
    const router = useRouter()
    const route = useRoute()

    const priceRange = ref([])
    const registrationYear = ref([])
    const kmDriven = ref([])

    const brandValue = ref([])
    const fuelValue = ref([])
    const transmissionValue = ref([])
    const bodyValue = ref([])
    const ownerValue = ref([])
    const sortBy = ref(null)

    const searchquery = ref(route.query.q || '')

    const {
        brands,
        isbrandsloading,
        fetchBrands
    } = useBrands()

    const {
        fuelTypes,
        isfueltypesloading,
        fetchFuelTypes
    } = useFuelTypes()

    const {
        transmissions,
        istransmissionloading,
        fetchTransmissions
    } = useTransmissions()

    const {
        bodyTypes,
        isbodytypesloading,
        fetchBodyTypes
    } = useBodyTypes()

    const {
        ownerships,
        isownershiploading,
        fetchOwnerships
    } = useOwnerships()

    const minPrice = ref(0)
    const maxPrice = ref(0)
    const minKm = ref(0)
    const maxKm = ref(100000)
    const minYear = ref(2005)
    const maxYear = ref(new Date().getFullYear())

    const { getItems } = useDirectusItems()
    const rangeData = await getItems({
        collection: 'cars',
        params: {
            fields: ['original_price', 'km_driven', 'registration_year']
        }
    })

    if (rangeData?.length) {
        const prices = rangeData
            .map(c => Number(String(c.original_price || '').replace(/,/g, '')))
            .filter(p => !isNaN(p) && p > 0)

        if (prices.length) {
            minPrice.value = Math.min(...prices)
            maxPrice.value = Math.max(...prices)
            priceRange.value = [minPrice.value, maxPrice.value]
        }

        const kms = rangeData
            .map(c => Number(c.km_driven))
            .filter(p => !isNaN(p) && p >= 0)

        if (kms.length) {
            minKm.value = Math.min(...kms)
            maxKm.value = Math.max(...kms)
            kmDriven.value = [minKm.value, maxKm.value]
        }

        const years = rangeData
            .map(c => Number(c.registration_year))
            .filter(p => !isNaN(p) && p > 0)

        if (years.length) {
            minYear.value = Math.min(...years)
            maxYear.value = Math.max(...years)
            registrationYear.value = [minYear.value, maxYear.value]
        }
    }

    watch(
        [
            priceRange,
            registrationYear,
            kmDriven,
            brandValue,
            fuelValue,
            transmissionValue,
            bodyValue,
            ownerValue,
            sortBy
        ],
        () => {
            router.push({
                query: {
                    q: route.query.q || '',
                    price_min: priceRange.value[0] || '',
                    price_max: priceRange.value[1] || '',
                    year_min: registrationYear.value[0] || '',
                    year_max: registrationYear.value[1] || '',
                    km_min: kmDriven.value[0] || '',
                    km_max: kmDriven.value[1] || '',
                    brand: brandValue.value || '',
                    fuel_type: fuelValue.value || '',
                    transmission: transmissionValue.value || '',
                    body_type: bodyValue.value || '',
                    owner: ownerValue.value || '',
                    sort_by: sortBy.value || ''
                }
            })

            fetchcars()
        },
        { deep: true }
    )

    watch(
        () => route.query.q,
        newQ => {
            searchquery.value = newQ || ''
            fetchcars()
        }
    )

    const resetFilters = () => {
        priceRange.value = [minPrice.value, maxPrice.value]
        registrationYear.value = [minYear.value, maxYear.value]
        kmDriven.value = [minKm.value, maxKm.value]
        brandValue.value = []
        fuelValue.value = []
        transmissionValue.value = []
        bodyValue.value = []
        ownerValue.value = []
        sortBy.value = null
        searchquery.value = ''

        router.push({
            path: '/cars'
        })

        fetchcars()
    }

    const initFilters = async () => {
        await fetchBrands()
        await fetchFuelTypes()
        await fetchTransmissions()
        await fetchBodyTypes()
        await fetchOwnerships()
    }

    return {
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


        isbrandsloading,
        isfueltypesloading,
        istransmissionloading,
        isbodytypesloading,
        isownershiploading,

        resetFilters,
        initFilters
    }
}