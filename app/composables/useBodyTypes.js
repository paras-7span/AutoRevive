export const useBodyTypes = () => {
    const { getItems } = useDirectusItems()

    const bodyTypes = ref([])
    const isbodytypesloading = ref(false)

    const fetchBodyTypes = async () => {
        isbodytypesloading.value = true

        const res = await getItems({
            collection: 'body_types',
            params: { fields: ['id', 'name'] }
        })

        bodyTypes.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

        isbodytypesloading.value = false
    }

    return { bodyTypes, isbodytypesloading, fetchBodyTypes }
}