<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Error Alert Banner -->
    <div
      v-if="errorMessage"
      class="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm"
      role="alert"
    >
      <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 shrink-0 mt-0.5" />
      <div class="flex-1">
        <p class="font-medium">Sign In Failed</p>
        <p class="text-xs mt-0.5 opacity-90">{{ errorMessage }}</p>
      </div>
      <button
        type="button"
        class="text-red-500 hover:text-red-700 dark:hover:text-red-200 text-sm font-bold"
        @click="errorMessage = ''"
      >
        ✕
      </button>
    </div>

    <!-- Email Address -->
    <div class="space-y-1">
      <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        Email Address <span class="text-red-500">*</span>
      </label>
      <UInput
        v-model="form.email"
        type="email"
        placeholder="name@example.com"
        icon="i-heroicons-envelope"
        size="lg"
        class="w-full"
        variant="outline"
        required
      />
    </div>

    <!-- Password -->
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Password <span class="text-red-500">*</span>
        </label>
        <NuxtLink to="/forgot-password" class="text-xs text-primary-600 dark:text-primary-400 hover:underline">
          Forgot password?
        </NuxtLink>
      </div>
      <div class="relative">
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          icon="i-heroicons-lock-closed"
          size="lg"
          class="w-full pr-10"
          variant="outline"
          required
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="pt-2">
      <UButton
        type="submit"
        size="lg"
        :loading="authLoading"
        :disabled="authLoading"
        class="w-full justify-center bg-primary-50 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold py-3 shadow-md shadow-primary-500/25 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <template #leading>
          <UIcon v-if="!authLoading" name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-1" />
        </template>
        {{ authLoading ? 'Signing in...' : 'Sign In' }}
      </UButton>
    </div>

    <!-- Link to Sign Up -->
    <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-3">
      Don't have an account?
      <NuxtLink to="/signup" class="font-semibold text-primary-600 dark:text-primary-400 hover:underline ml-1">
        Create one now
      </NuxtLink>
    </p>
  </form>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const { signIn, loading: authLoading, error: authError } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!form.email || !form.password) {
    errorMessage.value = 'Please provide both email and password.'
    return
  }

  const result = await signIn({
    email: form.email,
    password: form.password
  })

  if (result.success) {
    const redirect = route.query.redirect || '/'
    await router.push(redirect)
  } else {
    errorMessage.value = result.error || authError.value || 'Invalid email or password.'
  }
}
</script>
