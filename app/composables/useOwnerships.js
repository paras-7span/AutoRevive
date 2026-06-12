export const useOwnerships = () => {
    const { getItems } = useDirectusItems()

    const ownerships = ref([])

    const fetchOwnerships = async () => {

        const res = await getItems({
            collection: 'ownerships',
            params: { fields: ['id', 'name'] }
        })

        ownerships.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

    }

    return { ownerships, fetchOwnerships }
}