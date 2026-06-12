
export const useTransmissions = () => {
    const { getItems } = useDirectusItems()

    const transmissions = ref([])

    const fetchTransmissions = async () => {

        const res = await getItems({
            collection: 'transmissions',
            params: { fields: ['id', 'name'] }
        })

        transmissions.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

    }

    return { transmissions, fetchTransmissions }
}