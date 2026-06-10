export const useFuelTypes = () => {
    const { getItems } = useDirectusItems()

    const fuelTypes = ref([])
    const isfueltypesloading = ref(false)

    const fetchFuelTypes = async () => {
        isfueltypesloading.value = true

        const res = await getItems({
            collection: 'fuel_type',
            params: {
                fields: ['id', 'name']
            }
        })

        fuelTypes.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

        isfueltypesloading.value = false
    }

    return { fuelTypes, isfueltypesloading, fetchFuelTypes }
}