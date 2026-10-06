<template>
  <AuthCard
    title="Welcome Back"
    subtitle="Sign in to your AutoRevive account to access saved cars and inquiries."
  >
    <AuthLoginForm />
  </AuthCard>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Sign In | AutoRevive',
  description: 'Sign in to your AutoRevive account.'
})
</script>
