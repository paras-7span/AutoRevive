<template>
    <UContainer class="py-8 max-w-3xl">
        <!-- Loading -->
        <div v-if="loading" class="space-y-6">
            <USkeleton class="h-5 w-32" />
            <USkeleton class="h-10 w-full" />
            <USkeleton class="h-5 w-2/3" />
            <USkeleton class="h-80 w-full rounded-2xl" />
            <div class="space-y-3">
                <USkeleton v-for="i in 8" :key="i" class="h-4 w-full" />
            </div>
        </div>

        <!-- Article -->
        <article v-else-if="blog">
            <!-- Back -->
            <UButton to="/blogs" label="All Posts" icon="i-heroicons-arrow-left" variant="ghost" color="neutral"
                size="sm" class="mb-6 text-gray-500 hover:text-gray-900" />

            <!-- Category & Read Time -->
            <div class="flex items-center gap-3 mb-4">
                <span v-if="blog.category"
                    class="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-50/10 text-primary-50">
                    {{ getCategoryLabel(blog.category) }}
                </span>
                <span v-if="blog.read_time" class="text-xs text-gray-400 flex items-center gap-1">
                    <UIcon name="i-heroicons-clock" class="text-sm" />
                    {{ blog.read_time }} min read
                </span>
            </div>

            <!-- Title -->
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {{ blog.title }}
            </h1>

            <!-- Excerpt -->
            <p v-if="blog.excerpt" class="mt-4 text-lg text-gray-500 leading-relaxed">
                {{ blog.excerpt }}
            </p>

            <!-- Author & Date -->
            <div class="mt-6 mb-8 flex items-center gap-4 pb-6 border-b border-gray-100">
                <div
                    class="w-10 h-10 rounded-full bg-primary-50/10 text-primary-50 flex items-center justify-center text-sm font-bold uppercase">
                    {{ getAuthorInitials(blog.author) }}
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-800">
                        {{ getAuthorName(blog.author) }}
                    </p>
                    <p class="text-xs text-gray-400">
                        {{ formatDate(blog.date_published) }}
                    </p>
                </div>
            </div>

            <!-- Featured Image -->
            <div v-if="blog.featured_image" class="mb-8 rounded-2xl overflow-hidden shadow-md">
                <NuxtImg :src="getAssetsUrl(blog.featured_image)" :alt="blog.title"
                    class="w-full h-auto object-cover" />
            </div>

            <!-- Tags -->
            <div v-if="blog.tags?.length" class="flex flex-wrap gap-2 mb-8">
                <span v-for="tag in blog.tags" :key="tag"
                    class="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    #{{ tag }}
                </span>
            </div>

            <!-- Content -->
            <div class="blog-content" v-html="blog.content" />

            <!-- Bottom Nav -->
            <div class="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
                <UButton to="/blogs" label="← Back to Blog" variant="ghost" color="neutral" />
            </div>
        </article>

        <!-- Not Found -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="text-5xl text-gray-300 mb-4" />
            <h2 class="text-lg font-semibold text-gray-600">Blog post not found</h2>
            <p class="text-sm text-gray-400 mt-1">The post you're looking for doesn't exist or has been removed.</p>
            <UButton to="/blogs" label="Browse All Posts" variant="outline" color="neutral" class="mt-4" />
        </div>
    </UContainer>
</template>

<script setup>
const route = useRoute()
const { getItems } = useDirectusItems()

const loading = ref(true)
const blog = ref(null)

const categories = [
    { label: 'Maintenance Tips', value: 'maintenance' },
    { label: 'Buying Guide', value: 'buying-guide' },
    { label: 'Industry News', value: 'industry-news' },
    { label: 'Car Reviews', value: 'car-reviews' },
    { label: 'How-To', value: 'how-to' },
]

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

async function fetchBlog() {
    loading.value = true
    try {
        const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
        const res = await getItems({
            collection: 'blogs',
            params: {
                fields: [
                    'id',
                    'title',
                    'slug',
                    'excerpt',
                    'content',
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
                    slug: { _eq: slug },
                    status: { _eq: 'published' }
                },
                limit: 1
            }
        })
        blog.value = res?.[0] || null

        if (blog.value) {
            useSeoMeta({
                title: `${blog.value.title} | AutoRevive Blog`,
                description: blog.value.excerpt || `Read "${blog.value.title}" on the AutoRevive blog.`,
                ogTitle: blog.value.title,
                ogDescription: blog.value.excerpt,
                ogImage: blog.value.featured_image ? getAssetsUrl(blog.value.featured_image) : undefined,
            })
        }
    } catch (e) {
        console.error('Failed to fetch blog:', e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchBlog()
})
</script>

<style scoped>
.blog-content :deep(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
}

.blog-content :deep(h3) {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.blog-content :deep(p) {
    color: #4b5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1.0125rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    color: #4b5563;
}

.blog-content :deep(li) {
    margin-bottom: 0.4rem;
    line-height: 1.7;
}

.blog-content :deep(ul) {
    list-style-type: disc;
}

.blog-content :deep(ol) {
    list-style-type: decimal;
}

.blog-content :deep(strong) {
    font-weight: 600;
    color: #111827;
}

.blog-content :deep(a) {
    color: #ff5a1f;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.blog-content :deep(a:hover) {
    color: #e04e18;
}

.blog-content :deep(blockquote) {
    border-left: 4px solid #ff5a1f;
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: #6b7280;
    font-style: italic;
}

.blog-content :deep(img) {
    border-radius: 1rem;
    margin: 1.5rem 0;
    max-width: 100%;
}
</style>
