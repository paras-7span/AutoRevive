export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated.value) {
    const redirect = to.query.redirect || '/'
    return navigateTo(redirect)
  }
})
