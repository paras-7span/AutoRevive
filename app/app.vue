<script setup>
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/autorevivefavicon.png' }],
  htmlAttrs: {
    lang: 'en'
  }
  // ,
  // script: [
  //   {
  //     src: ' https://widget-sitegpt.preview.im/embed.js',
  //     defer: true,
  //     'data-bot-id': '01KSKY2JHPHQ9PNKXQXK5H54V1'
  //   }
  // ]
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
