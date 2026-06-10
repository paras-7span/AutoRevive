
export const useTransmissions = () => {
    const { getItems } = useDirectusItems()

    const transmissions = ref([])
    const istransmissionloading = ref(false)

    const fetchTransmissions = async () => {
        istransmissionloading.value = true

        const res = await getItems({
            collection: 'transmissions',
            params: { fields: ['id', 'name'] }
        })

        transmissions.value = res.map(item => ({
            label: item.name,
            value: item.id
        }))

        istransmissionloading.value = false
    }

    return { transmissions, istransmissionloading, fetchTransmissions }
}