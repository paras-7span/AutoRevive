<script setup>
const props = defineProps({
    error: Object
})

const router = useRouter()

function handleGoHome() {
    clearError({ redirect: '/' })
}

useSeoMeta({
    title: 'D2C Guru - 404',
    description: 'Error - D2C Guru',
    favicon: '/images/favicon.png'
})


console.log("ERROR", props.error);
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white dark:bg-black">
        <!-- Error Content -->
        <UContainer class="my-auto">
            <div class="flex flex-col items-center justify-center py-4 mb-4">
                <span>
                    <div class="order-1 md:order-2 flex-shrink-0">
                        <!-- <img src="/images/main_error_img.png" alt="Error illustration" class="w-64 h-auto md:w-96" /> -->
                    </div>
                </span>
                <p class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Oops!!</p>
                <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-1 leading-relaxed">
                    May be you lost the path...
                </p>
                <div class="flex flex-wrap gap-3">
                    <UButton label="Find Your Way" icon="i-lucide-home" size="lg" color="primary" @click="handleGoHome"
                        class="cursor-pointer" />
                </div>
            </div>
        </UContainer>
    </div>
</template>
