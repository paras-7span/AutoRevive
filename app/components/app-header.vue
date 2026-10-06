<script setup>
const router = useRouter();
const route = useRoute();
const { user, isAuthenticated, signOut } = useAuth();

const searchquery = ref('')
watch(
    () => route.query.q,
    (newQ) => {
        searchquery.value = newQ || ''
    },
    { immediate: true }
)

watch(
    () => route.path,
    (newPath) => {
        if (!newPath.startsWith('/cars')) {
            searchquery.value = ''
        }
    }
)

const debouncegetcars = useDebounceFn(() => {
    if (searchquery.value) {
        router.push(`/cars/?q=${searchquery.value}`)
    } else {
        router.push(`/cars`)
    }
}, 500)
</script>

<template>
    <UHeader>
        <template #title>
            <NuxtLink to="/">
                <NuxtImg src="/autorevicelogo.png" alt="logo" class="h-8 w-auto" />
            </NuxtLink>
        </template>

        <template #default>
            <div class="flex gap-3">
                <UButton icon="i-solar:home-outline" label="Home" to="/" variant="ghost"
                    class="text-black hover:bg-gray-100 hover:text-black" color="neutral" />
                <UButton icon="material-symbols:directions-car-outline" label="Buy Cars" to="/cars" variant="ghost"
                    class="text-black hover:bg-gray-100 hover:text-black" color="neutral" />
                <UButton icon="i-heroicons-document-text" label="Blog" to="/blogs" variant="ghost"
                    class="text-black hover:bg-gray-100 hover:text-black" color="neutral" />
            </div>
        </template>

        <template #right>
            <div class="flex items-center gap-3">
                <UInput :ui="{ base: 'ring-gray-400 focus-visible:ring-gray-500' }" placeholder="Search..."
                    v-model="searchquery" @input="debouncegetcars" leading-icon="i-heroicons-magnifying-glass"
                    class="hidden md:block " />

                <!-- Authenticated User State -->
                <div v-if="isAuthenticated && user" class="hidden md:flex items-center gap-2">
                    <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                        <NuxtImg
                            v-if="user.avatar"
                            :src="user.avatar"
                            :alt="user.name"
                            class="w-6 h-6 rounded-full object-cover"
                        />
                        <span class="max-w-[120px] truncate text-gray-800 dark:text-gray-200">
                            {{ user.name }}
                        </span>
                    </div>
                    <UButton
                        icon="i-heroicons-arrow-right-on-rectangle"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        title="Sign Out"
                        @click="signOut"
                    />
                </div>

                <!-- Guest State -->
                <div v-else class="hidden md:flex items-center gap-2">
                    <UButton
                        to="/login"
                        variant="ghost"
                        color="neutral"
                        label="Sign In"
                        size="sm"
                    />
                    <UButton
                        to="/signup"
                        color="primary"
                        label="Sign Up"
                        size="sm"
                        class="bg-primary-500 hover:bg-primary-600 text-white"
                    />
                </div>
            </div>
        </template>

        <template #body>
            <div class="px-2 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <UInput v-model="searchquery" placeholder="Search cars, Brands"
                    class="w-full text-black dark:text-white md:hidden" icon="i-heroicons-magnifying-glass"
                    @input="debouncegetcars" />
                <UButton icon="i-solar:home-outline" label="Home" to="/" variant="ghost"
                    class="text-black hover:bg-primary-600 hover:text-white w-full justify-start" color="neutral" />
                <UButton icon="material-symbols:directions-car-outline" label="Buy Cars" to="/cars" variant="ghost"
                    class="text-black hover:bg-secondary-600 hover:text-white w-full justify-start" color="neutral" />
                <UButton icon="i-heroicons-document-text" label="Blog" to="/blogs" variant="ghost"
                    class="text-black hover:bg-primary-600 hover:text-white w-full justify-start" color="neutral" />

                <!-- Mobile Auth Buttons -->
                <div class="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    <div v-if="isAuthenticated && user" class="space-y-2">
                        <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <NuxtImg
                                v-if="user.avatar"
                                :src="user.avatar"
                                :alt="user.name"
                                class="w-8 h-8 rounded-full"
                            />
                            <div class="flex-1 truncate">
                                <p class="text-sm font-semibold">{{ user.name }}</p>
                                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                            </div>
                        </div>
                        <UButton
                            icon="i-heroicons-arrow-right-on-rectangle"
                            label="Sign Out"
                            variant="outline"
                            color="error"
                            class="w-full justify-center"
                            @click="signOut"
                        />
                    </div>
                    <div v-else class="grid grid-cols-2 gap-2">
                        <UButton
                            to="/login"
                            label="Sign In"
                            variant="outline"
                            color="neutral"
                            class="w-full justify-center"
                        />
                        <UButton
                            to="/signup"
                            label="Sign Up"
                            color="primary"
                            class="w-full justify-center bg-primary-500 text-white"
                        />
                    </div>
                </div>
            </div>
        </template>
    </UHeader>
</template>

