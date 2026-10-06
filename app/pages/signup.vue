<template>
  <AuthCard
    title="Create your Account"
    subtitle="Join AutoRevive to discover, compare, and test drive verified pre-owned cars."
  >
    <AuthSignUpForm />
  </AuthCard>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Create Account | AutoRevive',
  description: 'Join AutoRevive to browse certified pre-owned cars, compare specs, and get pre-approved financing.'
})
</script>