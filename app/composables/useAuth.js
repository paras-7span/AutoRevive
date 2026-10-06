export const useAuth = () => {
  const router = useRouter()
  const config = useRuntimeConfig()
  const API_URL = config.public.authApiUrl

  const userCookie = useCookie('auth_user')
  const user = useState('auth_user', () => userCookie.value || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  // Sign up
  const signUp = async (formData) => {
    loading.value = true
    error.value = null

    try {
      const createdUser = await $fetch(API_URL, {
        method: 'POST',
        body: formData
      })

      user.value = createdUser
      userCookie.value = createdUser

      return { success: true, user: createdUser }
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Failed to sign up'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Sign in
  const signIn = async ({ email, password }) => {
    loading.value = true
    error.value = null

    try {
      const users = await $fetch(API_URL)
      const matched = users?.find(
        (u) => u.email?.toLowerCase() === email?.toLowerCase() && u.password === password
      )

      if (!matched) {
        throw new Error('Invalid email or password')
      }

      user.value = matched
      userCookie.value = matched

      return { success: true, user: matched }
    } catch (err) {
      const message = err?.message || 'Failed to sign in'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    user.value = null
    userCookie.value = null
    await router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signUp,
    signIn,
    signOut
  }
}
