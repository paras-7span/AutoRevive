export const useFuelTypes = () => {
    const { getItems } = useDirectusItems()

    const fuelTypes = ref([])

    const fetchFuelTypes = async () => {

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

    }

    return { fuelTypes, fetchFuelTypes }
}