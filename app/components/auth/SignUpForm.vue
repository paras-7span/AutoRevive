<template>
  <div>
    <!-- Success Celebration State -->
    <div v-if="isSuccess" class="text-center py-6 space-y-5 animate-fade-in">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto shadow-inner">
        <UIcon name="i-heroicons-check-circle" class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to AutoRevive, {{ registeredName }}!
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Your account has been created successfully. You can now explore, compare, and save verified pre-owned cars.
        </p>
      </div>

      <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-xs text-gray-500 space-y-1">
        <p>Redirecting you automatically in <span class="font-bold text-primary-500">{{ countdown }}s</span>...</p>
      </div>

      <div class="pt-2">
        <UButton
          to="/"
          size="lg"
          class="w-full justify-center bg-primary-50 hover:bg-primary-600 text-white font-semibold py-2.5 shadow-md shadow-primary-500/20"
        >
          Explore Cars Now
        </UButton>
      </div>
    </div>

    <!-- Sign Up Form State -->
    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Error Alert Banner -->
      <div
        v-if="errorMessage"
        class="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm"
        role="alert"
      >
        <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 shrink-0 mt-0.5" />
        <div class="flex-1">
          <p class="font-medium">Registration Failed</p>
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

      <!-- Full Name -->
      <div class="space-y-1">
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Full Name <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="form.name"
          placeholder="e.g. Paras Sharma"
          icon="i-heroicons-user"
          size="lg"
          class="w-full"
          variant="outline"
          required
        />
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

      <!-- Phone Number -->
      <div class="space-y-1">
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Phone Number <span class="text-xs text-gray-400 font-normal lowercase">(optional)</span>
        </label>
        <UInput
          v-model="form.phone"
          type="tel"
          inputmode="numeric"
          maxlength="10"
          placeholder="10-digit mobile number"
          icon="i-heroicons-phone"
          size="lg"
          class="w-full"
          variant="outline"
        />
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Password <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="At least 8 characters"
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

      <!-- Confirm Password -->
      <div class="space-y-1">
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Confirm Password <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <UInput
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Re-enter password"
            icon="i-heroicons-lock-closed"
            size="lg"
            class="w-full pr-10"
            variant="outline"
            required
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <UIcon :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Terms & Conditions Checkbox -->
      <div class="pt-1">
        <label class="flex items-start gap-2.5 cursor-pointer select-none text-xs text-gray-600 dark:text-gray-400">
          <input
            v-model="form.agreeTerms"
            type="checkbox"
            class="mt-0.5 rounded border-gray-300 text-primary-500 focus:ring-primary-400 dark:border-gray-700 dark:bg-gray-800"
          />
          <span>
            I agree to the
            <NuxtLink to="/terms" class="text-primary-600 dark:text-primary-400 underline hover:text-primary-700">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-primary-600 dark:text-primary-400 underline hover:text-primary-700">Privacy Policy</NuxtLink>.
          </span>
        </label>
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
            <UIcon v-if="!authLoading" name="i-heroicons-user-plus" class="w-5 h-5 mr-1" />
          </template>
          {{ authLoading ? 'Creating your account...' : 'Create Account' }}
        </UButton>
      </div>

      <!-- Link to Login -->
      <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-3">
        Already have an account?
        <NuxtLink to="/login" class="font-semibold text-primary-600 dark:text-primary-400 hover:underline ml-1">
          Sign In
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
const router = useRouter()
const { signUp, loading: authLoading, error: authError } = useAuth()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)
const registeredName = ref('')
const countdown = ref(3)

const handleSubmit = async () => {
  errorMessage.value = ''

  // Simple manual checks
  if (!form.name.trim()) {
    errorMessage.value = 'Please enter your full name.'
    return
  }

  if (!form.email.trim()) {

    errorMessage.value = 'Please enter your email address.'
    return
  }

  if (!form.password) {
    errorMessage.value = 'Please enter a password.'
    return
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (form.phone && form.phone.replace(/\D/g, '').length !== 10) {
    errorMessage.value = 'Please enter a valid 10-digit mobile number.'
    return
  }

  if (!form.agreeTerms) {
    errorMessage.value = 'Please agree to the Terms of Service and Privacy Policy.'
    return
  }

  // Call sign up
  const result = await signUp({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    password: form.password
  })

  if (result.success) {
    registeredName.value = result.user?.name || form.name
    isSuccess.value = true

    const timer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearInterval(timer)
        router.push('/')
      }
    }, 1000)
  } else {
    errorMessage.value = result.error || authError.value || 'Registration failed. Please try again.'
  }
}
</script>
