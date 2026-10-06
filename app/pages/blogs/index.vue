<template>
    <UContainer class="py-8">
        <!-- Hero Section -->
        <div class="text-center mb-10">
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                AutoRevive <span class="text-primary-50">Blog</span>
            </h1>
            <p class="mt-3 text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
                Tips, guides & news to keep your ride in top shape
            </p>
        </div>

        <!-- Category Filter -->
        <div class="flex flex-wrap items-center gap-2 mb-8 justify-center">
            <UButton v-for="cat in categories" :key="cat.value" :label="cat.label" size="sm"
                :variant="activeCategory === cat.value ? 'solid' : 'outline'"
                :class="activeCategory === cat.value
                    ? 'bg-primary-50 text-white hover:bg-primary-50/90 border-primary-50'
                    : 'text-gray-600 border-gray-300 hover:border-primary-50 hover:text-primary-50'"
                @click="activeCategory = cat.value" />
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i"
                class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <USkeleton class="h-52 w-full" />
                <div class="p-5 space-y-3">
                    <USkeleton class="h-4 w-20" />
                    <USkeleton class="h-6 w-full" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-3/4" />
                    <div class="flex items-center gap-3 pt-2">
                        <USkeleton class="h-8 w-8 rounded-full" />
                        <USkeleton class="h-4 w-24" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Blog Grid -->
        <div v-else-if="filteredBlogs.length"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink v-for="blog in filteredBlogs" :key="blog.id" :to="`/blogs/${blog.slug}`"
                class="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white hover:shadow-lg hover:border-primary-50/30 transition-all duration-300 flex flex-col">

                <!-- Thumbnail -->
                <div class="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <NuxtImg v-if="blog.featured_image" :src="getAssetsUrl(blog.featured_image)"
                        :alt="blog.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div v-else
                        class="w-full h-full flex items-center justify-center text-gray-300">
                        <UIcon name="i-heroicons-photo" class="text-5xl" />
                    </div>

                    <!-- Category badge -->
                    <span v-if="blog.category"
                        class="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm shadow-sm">
                        {{ getCategoryLabel(blog.category) }}
                    </span>
                </div>

                <!-- Content -->
                <div class="p-5 flex flex-col flex-1">
                    <h2
                        class="text-lg font-bold text-gray-900 group-hover:text-primary-50 transition-colors duration-200 line-clamp-2 leading-snug">
                        {{ blog.title }}
                    </h2>
                    <p class="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
                        {{ blog.excerpt }}
                    </p>

                    <!-- Meta Row -->
                    <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <div class="flex items-center gap-2">
                            <div
                                class="w-7 h-7 rounded-full bg-primary-50/10 text-primary-50 flex items-center justify-center text-[11px] font-bold uppercase">
                                {{ getAuthorInitials(blog.author) }}
                            </div>
                            <span class="text-gray-600 font-medium">
                                {{ getAuthorName(blog.author) }}
                            </span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-calendar-days" class="text-sm" />
                                {{ formatDate(blog.date_published) }}
                            </span>
                            <span v-if="blog.read_time" class="flex items-center gap-1">
                                <UIcon name="i-heroicons-clock" class="text-sm" />
                                {{ blog.read_time }} min
                            </span>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <UIcon name="i-heroicons-document-text" class="text-6xl text-gray-300 mb-4" />
            <h3 class="text-lg font-semibold text-gray-600">No blog posts found</h3>
            <p class="text-sm text-gray-400 mt-1">Check back soon for new content!</p>
            <UButton v-if="activeCategory !== 'all'" label="Show All Posts" variant="outline" color="neutral"
                class="mt-4" @click="activeCategory = 'all'" />
        </div>
    </UContainer>
</template>

<script setup>
useSeoMeta({
    title: 'Blog | AutoRevive',
    description: 'Read the latest tips, buying guides, car reviews, and industry news on the AutoRevive blog. Stay informed and make smarter automotive decisions.'
})

const { getItems } = useDirectusItems()

const loading = ref(true)
const blogs = ref([])
const activeCategory = ref('all')

const categories = [
    { label: 'All', value: 'all' },
    { label: 'Maintenance Tips', value: 'maintenance' },
    { label: 'Buying Guide', value: 'buying-guide' },
    { label: 'Industry News', value: 'industry-news' },
    { label: 'Car Reviews', value: 'car-reviews' },
    { label: 'How-To', value: 'how-to' },
]

const filteredBlogs = computed(() => {
    if (activeCategory.value === 'all') return blogs.value
    return blogs.value.filter(b => b.category === activeCategory.value)
})

function getCategoryLabel(value) {
    return categories.find(c => c.value === value)?.label || value
}

function getAuthorName(author) {
    if (!author) return 'AutoRevive'
    return [author.first_name, author.last_name].filter(Boolean).join(' ') || 'AutoRevive'
}

function getAuthorInitials(author) {
    if (!author) return 'A'
    const first = author.first_name?.[0] || ''
    const last = author.last_name?.[0] || ''
    return (first + last) || 'A'
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

async function fetchBlogs() {
    loading.value = true
    try {
        const res = await getItems({
            collection: 'blogs',
            params: {
                fields: [
                    'id',
                    'title',
                    'slug',
                    'excerpt',
                    'featured_image',
                    'category',
                    'tags',
                    'read_time',
                    'date_published',
                    'author.first_name',
                    'author.last_name',
                    'author.avatar',
                ],
                filter: {
                    status: { _eq: 'published' }
                },
                sort: ['-date_published']
            }
        })
        blogs.value = res
    } catch (e) {
        console.error('Failed to fetch blogs:', e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchBlogs()
})
</script>
