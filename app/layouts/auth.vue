<template>
  <div class="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
    <!-- Top Navigation -->
    <header class="w-full max-w-md mx-auto flex items-center justify-between py-2">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to Home
      </NuxtLink>

      <NuxtLink to="/">
        <NuxtImg src="/autorevicelogo.png" alt="AutoRevive Logo" class="h-8 w-auto" />
      </NuxtLink>
    </header>

    <!-- Centered Content -->
    <main class="w-full max-w-md mx-auto my-auto py-6">
      <slot />
    </main>

    <!-- Footer Links -->
    <footer class="w-full max-w-md mx-auto text-center text-xs text-gray-500 py-3 space-x-4">
      <NuxtLink to="/contact" class="hover:underline">Need Help?</NuxtLink>
      <span>•</span>
      <NuxtLink to="/cars" class="hover:underline">Browse Cars</NuxtLink>
      <span>•</span>
      <NuxtLink to="/privacy" class="hover:underline">Privacy</NuxtLink>
    </footer>
  </div>
</template>

<script setup>
</script>