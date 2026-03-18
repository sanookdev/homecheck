<template>
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">{{ item.title }}</h2>
        <div class="flex items-center gap-3">
          <span 
            class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
            :class="statusClass"
          >
            {{ item.status }}
          </span>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto flex-1">
        
        <!-- Gallery -->
        <div v-if="images.length > 0" class="relative bg-gray-900">
          <!-- Main Image -->
          <div class="relative h-80 flex items-center justify-center cursor-pointer" @click="openLightbox(currentIndex)">
            <img 
              :src="images[currentIndex]" 
              class="max-h-full max-w-full object-contain transition-opacity duration-300"
              :key="currentIndex"
            />
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          </div>
          <!-- Prev / Next -->
          <button 
            v-if="images.length > 1"
            @click="prevImage" 
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button 
            v-if="images.length > 1"
            @click="nextImage" 
            class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <!-- Thumbnails -->
          <div v-if="images.length > 1" class="flex gap-2 p-3 bg-gray-900/80 overflow-x-auto">
            <button 
              v-for="(img, idx) in images" 
              :key="idx" 
              @click="currentIndex = idx"
              class="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all"
              :class="idx === currentIndex ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- No Images -->
        <div v-else class="h-48 bg-gray-100 flex items-center justify-center">
          <div class="text-center text-gray-400">
            <svg class="mx-auto w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p class="text-sm">No images</p>
          </div>
        </div>

        <!-- Details -->
        <div class="px-6 py-5 space-y-4">
          <div>
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Description</label>
            <p class="mt-1 text-sm text-gray-700 leading-relaxed">{{ item.description || 'No description provided.' }}</p>
          </div>
          <div class="flex items-center gap-8">
            <div>
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Estimated Cost</label>
              <p class="mt-1 text-2xl font-bold text-gray-900">฿{{ Number(item.price).toLocaleString('en-US') }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Created</label>
              <p class="mt-1 text-sm text-gray-600">{{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button @click="$emit('edit', item)" class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          Edit
        </button>
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Lightbox Fullscreen -->
  <Teleport to="body">
    <div 
      v-if="lightboxOpen" 
      class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      @click.self="lightboxOpen = false"
    >
      <button @click="lightboxOpen = false" class="absolute top-4 right-4 text-white/70 hover:text-white z-10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <button 
        v-if="images.length > 1"
        @click="prevImage" 
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <img :src="images[currentIndex]" class="max-h-[90vh] max-w-[90vw] object-contain" />
      <button 
        v-if="images.length > 1"
        @click="nextImage" 
        class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  item: { type: Object, required: true }
});

defineEmits(['close', 'edit']);

const currentIndex = ref(0);
const lightboxOpen = ref(false);

const images = computed(() => {
  if (props.item.imageUrls && props.item.imageUrls.length > 0) return props.item.imageUrls;
  if (props.item.imageUrl) return [props.item.imageUrl];
  return [];
});

const statusClass = computed(() => {
  switch (props.item.status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
});

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};

const openLightbox = (idx) => {
  currentIndex.value = idx;
  lightboxOpen.value = true;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};
</script>
