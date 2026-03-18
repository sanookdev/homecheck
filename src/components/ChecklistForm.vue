<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Images (max 5)</label>
          
          <!-- Preview Grid -->
          <div v-if="allPreviews.length > 0" class="grid grid-cols-3 gap-2 mb-3">
            <div v-for="(img, idx) in allPreviews" :key="idx" class="relative group">
              <img :src="img.url" class="h-24 w-full object-cover rounded-lg shadow-sm" />
              <button 
                type="button" 
                @click="removeImage(idx)"
                class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>

          <!-- Upload Zone -->
          <div 
            v-if="allPreviews.length < 5"
            class="flex justify-center px-6 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-gray-50 cursor-pointer"
            @click="$refs.fileInput.click()"
          >
            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mt-1 text-sm text-gray-600">Click to add images</p>
              <p class="text-xs text-gray-400">{{ allPreviews.length }}/5 · PNG, JPG up to 5MB each</p>
            </div>
          </div>
          <input 
            ref="fileInput" 
            type="file" 
            class="hidden" 
            accept="image/*" 
            multiple 
            @change="handleFileChange"
          />
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
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['close', 'save']);

const isEditing = ref(false);
const loading = ref(false);
const newFiles = ref([]);        // Newly picked File objects
const existingUrls = ref([]);    // URLs already saved in DB

const form = ref({
  title: '',
  description: '',
  status: 'Pending',
  price: 0,
  pin: ''
});

// Unified preview list: existing URLs + new file blobs
const allPreviews = computed(() => {
  const existing = existingUrls.value.map(url => ({ type: 'existing', url }));
  const added = newFiles.value.map(file => ({ type: 'new', url: URL.createObjectURL(file) }));
  return [...existing, ...added];
});

onMounted(() => {
  if (props.initialData) {
    isEditing.value = true;
    form.value = { ...props.initialData, pin: '' };
    // Support both old single imageUrl and new imageUrls array
    if (props.initialData.imageUrls && props.initialData.imageUrls.length > 0) {
      existingUrls.value = [...props.initialData.imageUrls];
    } else if (props.initialData.imageUrl) {
      existingUrls.value = [props.initialData.imageUrl];
    }
  }
});

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const totalAllowed = 5 - allPreviews.value.length;
  const toAdd = files.slice(0, totalAllowed);
  newFiles.value = [...newFiles.value, ...toAdd];
  e.target.value = ''; // reset so same file can be re-picked
};

const removeImage = (idx) => {
  if (idx < existingUrls.value.length) {
    existingUrls.value.splice(idx, 1);
  } else {
    newFiles.value.splice(idx - existingUrls.value.length, 1);
  }
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
    formData.append('existingImages', JSON.stringify(existingUrls.value));
    
    newFiles.value.forEach(file => {
      formData.append('images', file);
    });

    emit('save', { id: props.initialData?.id, formData });
  } catch (error) {
    console.error(error);
  }
};
</script>
