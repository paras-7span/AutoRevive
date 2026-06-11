<script setup>
const props = defineProps({
    error: Object
})

const router = useRouter()

function handleGoHome() {
    clearError({ redirect: '/' })
}

useSeoMeta({
    title: 'AutoRevive - 404',
    description: 'Error - AutoRevive',
    favicon: '/images/favicon.png'
})


console.log("ERROR", props.error);
</script>

<template>

    <div class="flex flex-col items-center justify-center ">
        <span>
            <img src="/404car.png" alt="Error illustration" class="w-64 h-auto md:w-96" />

        </span>
        <p class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Oops!!</p>
        <p class="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-2">
            You got crashed...
        </p>
        <div class="flex flex-wrap gap-3">
            <UButton label="Find Your Way" icon="i-lucide-home" size="lg" @click="handleGoHome"
                class="cursor-pointer bg-primary-50 hover:bg-primary-50 hover:scale-102" />
        </div>
    </div>

</template>
