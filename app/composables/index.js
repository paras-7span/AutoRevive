export const getAssetsUrl = (path) => {
    const env = useRuntimeConfig()
    return `${env?.public.assetsUrl}/${path}`
}