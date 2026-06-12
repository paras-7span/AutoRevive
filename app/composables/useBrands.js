export const useBrands = () => {
    const { getItems } = useDirectusItems()

    const brands = ref([])

    const fetchBrands = async () => {

        const res = await getItems({
            collection: 'brands',
            params: {
                fields: ['id', 'name']
            }
        })

        brands.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

    }

    return { brands, fetchBrands }
}