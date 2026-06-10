import { ref, watch } from 'vue'

export const useCarFilters = async (fetchcars) => {
    const router = useRouter()
    const route = useRoute()

    const priceRange = ref([])
    const registrationYear = ref(2005)
    const kmDriven = ref(0)

    const brandValue = ref([])
    const fuelValue = ref([])
    const transmissionValue = ref([])
    const bodyValue = ref([])
    const ownerValue = ref([])

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

    const { getItems } = useDirectusItems()
    const priceData = await getItems({
        collection: 'cars',
        params: {
            fields: ['price_range']
        }
    })

    if (priceData?.length) {
        const prices = priceData
            .map(c => Number(c.price_range))
            .filter(Boolean)

        minPrice.value = Math.min(...prices)
        maxPrice.value = Math.max(...prices)

        priceRange.value = [
            minPrice.value,
            maxPrice.value
        ]
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
            ownerValue
        ],
        () => {
            router.push({
                query: {
                    q: route.query.q || '',
                    price_range: priceRange.value || '',
                    registration_year:
                        registrationYear.value || '',
                    km_driven: kmDriven.value || '',
                    brand: brandValue.value || '',
                    fuel_type: fuelValue.value || '',
                    transmission:
                        transmissionValue.value || '',
                    body_type: bodyValue.value || '',
                    owner: ownerValue.value || ''
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
        priceRange.value = [
            minPrice.value,
            maxPrice.value
        ]

        registrationYear.value = 2005
        kmDriven.value = 0

        brandValue.value = []
        fuelValue.value = []
        transmissionValue.value = []
        bodyValue.value = []
        ownerValue.value = []

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

        resetFilters,
        initFilters
    }
}