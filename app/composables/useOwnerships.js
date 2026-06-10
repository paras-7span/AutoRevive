export const useOwnerships = () => {
    const { getItems } = useDirectusItems()

    const ownerships = ref([])
    const isownershiploading = ref(false)

    const fetchOwnerships = async () => {
        isownershiploading.value = true

        const res = await getItems({
            collection: 'ownerships',
            params: { fields: ['id', 'name'] }
        })

        ownerships.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

        isownershiploading.value = false
    }

    return { ownerships, isownershiploading, fetchOwnerships }
}