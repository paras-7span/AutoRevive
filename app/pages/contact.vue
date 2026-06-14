<template>
    <UContainer>
        <div class="flex items-center justify-center py-10">
            <div class="w-full border border-gray-200 shadow-md p-6 rounded-lg max-w-sm">
                <h1 class="text-2xl font-bold mb-6 text-center">Contact Us</h1>
                <UForm :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormField label="Your Name : " name="name" required>
                        <UInput v-model="state.name" placeholder="Enter your name" class="w-full" />
                    </UFormField>

                    <UFormField label="Your Contact : " name="contact" required>
                        <UInput v-model="state.contact" placeholder="Enter your phone number" class="w-full" type="tel"
                            inputmode="numeric" :maxlength="10" />
                    </UFormField>

                    <UFormField label="Drop Your Message : " name="message" required>
                        <UTextarea v-model="state.message" placeholder="Enter your message" class="w-full" />
                    </UFormField>

                    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
                    <p v-if="success" class="text-green-500 text-sm">{{ success }}</p>

                    <UButton type="submit" :loading="submitting"
                        :icon="!submitting ? 'mdi:send-outline' : 'material-symbols:fitbit-check-small-sharp'"
                        loading-icon="svg-spinners:ring-resize"
                        class="cursor-pointer w-full justify-center bg-primary-50! text-white! hover:bg-primary-50! disabled:bg-primary-50! disabled:opacity-80">
                        Submit
                    </UButton>
                </UForm>
            </div>
        </div>
    </UContainer>
</template>

<script setup>

const { createItems } = useDirectusItems()

const state = reactive({
    name: '',
    contact: '',
    message: ''
})

const submitting = ref(false)
const error = ref('')
const success = ref('')

const onSubmit = async () => {
    if (!state.name || !state.contact || !state.message) {
        error.value = "Please fill all the fields"
        return
    }
    if (state.contact.length !== 10) {
        error.value = "Please enter a valid 10-digit phone number"
        return
    }

    error.value = ''
    submitting.value = true
    try {
        await createItems({
            collection: 'contact_us',
            items: [{
                name: state.name,
                contact: state.contact,
                message: state.message
            }]
        })
        state.name = ''
        state.contact = ''
        state.message = ''
        success.value = 'Message sent successfully'
    } catch (e) {
        console.log(e)
        error.value = 'Failed to send message. Please try again.'
    } finally {
        submitting.value = false
    }
}
</script>