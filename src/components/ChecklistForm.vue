<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            v-model="form.title" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow"
            placeholder="e.g. Kitchen Renovation"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow resize-none"
            placeholder="Any specific details..."
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none bg-white font-medium"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (฿)</label>
            <input 
              v-model.number="form.price" 
              type="number" 
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow"
            />
          </div>
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
           <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-brand-primary transition-colors bg-gray-50 relative">
            <div class="space-y-1 text-center" v-if="!imagePreview">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 justify-center">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" @change="handleFileChange">
                </label>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
            <div v-else class="relative w-full">
              <img :src="imagePreview" class="h-32 mx-auto object-cover rounded-md shadow-sm" />
              <button type="button" @click="clearImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Verification PIN</label>
          <input 
            v-model="form.pin" 
            type="password" 
            inputmode="numeric"
            maxlength="6"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow tracking-widest text-center text-lg"
            placeholder="Enter 6-digit PIN"
          />
        </div>

        <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="loading"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving...' : 'Save Item' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['close', 'save']);

const isEditing = ref(false);
const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);

const form = ref({
  title: '',
  description: '',
  status: 'Pending',
  price: 0,
  pin: ''
});

onMounted(() => {
  if (props.initialData) {
    isEditing.value = true;
    form.value = { ...props.initialData };
    if (props.initialData.imageUrl) {
      imagePreview.value = props.initialData.imageUrl;
    }
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const clearImage = () => {
  imageFile.value = null;
  imagePreview.value = props.initialData?.imageUrl || null;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('status', form.value.status);
    formData.append('price', form.value.price);
    formData.append('pin', form.value.pin);
    
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    emit('save', { id: props.initialData?.id, formData });
  } catch (error) {
    console.error(error);
  }
  // Let parent close it on success
};
</script>
