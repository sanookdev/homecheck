<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div class="h-48 bg-gray-200 relative">
      <img 
        v-if="item.imageUrl" 
        :src="item.imageUrl" 
        :alt="item.title" 
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      <div class="absolute top-3 right-3">
        <span 
          class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
          :class="statusBadgeClass"
        >
          {{ item.status }}
        </span>
      </div>
    </div>
    <div class="p-5">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-bold text-gray-800">{{ item.title }}</h3>
        <span class="text-brand-primary font-semibold">฿{{ formatPrice(item.price) }}</span>
      </div>
      <p class="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{{ item.description }}</p>
      <div class="flex justify-between items-center mt-4">
        <button 
          @click="$emit('edit', item)"
          class="text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors"
        >
          Edit Details
        </button>
        <button 
          @click="$emit('delete', item.id)"
          class="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US');
};

const statusBadgeClass = computed(() => {
  switch (props.item.status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
    default: return 'bg-gray-100 text-gray-800';
  }
});
</script>
