export const useBrands = () => {
    const { getItems } = useDirectusItems()

    const brands = ref([])
    const isbrandsloading = ref(false)

    const fetchBrands = async () => {
        isbrandsloading.value = true

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

        isbrandsloading.value = false
    }

    return { brands, isbrandsloading, fetchBrands }
}