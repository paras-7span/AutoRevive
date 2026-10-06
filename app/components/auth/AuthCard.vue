<template>
  <div class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
    <!-- Header -->
    <div class="mb-6 text-center">
      <h1 v-if="title" class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>

    <!-- Main Form Slot -->
    <div>
      <slot />
    </div>

    <!-- Optional Footer Slot -->
    <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
