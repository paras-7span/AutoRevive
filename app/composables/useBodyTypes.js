export const useBodyTypes = () => {
    const { getItems } = useDirectusItems()

    const bodyTypes = ref([])

    const fetchBodyTypes = async () => {

        const res = await getItems({
            collection: 'body_types',
            params: { fields: ['id', 'name'] }
        })

        bodyTypes.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

    }

    return { bodyTypes, fetchBodyTypes }
}