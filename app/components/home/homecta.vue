<template>
    <UContainer class="my-4">
        <div class="flex flex-col md:flex-row items-center justify-between bg-primary-50 rounded-lg p-4">

            <div class=" text-white">
                <h2 class="text-2xl md:text-3xl font-bold ">Talk with our experts</h2>
                <p class="text-white">We will help you find the perfect car for you.</p>
            </div>
            <div>
                <UButton to="/contact" label="Contact Our Expert" icon="material-symbols:chat" variant="ghost"
                    class="active:bg-white justify-center py-2 w-full border bg-white border-primary-50 text-primary-50 hover:bg-white mt-4 cursor-pointer ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:outline-none" />
            </div>
        </div>
    </UContainer>
</template>
<script setup>
</script>