<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Renovation Checklist</h1>
        <p class="mt-2 text-sm text-gray-500">Manage your home renovation and shopping items.</p>
      </div>
      <button 
        @click="openForm()"
        class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Item
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between text-gray-500">
          <span class="text-sm font-medium">Total Items</span>
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ items.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between text-gray-500">
          <span class="text-sm font-medium">Completed Repairs</span>
          <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ completedItemsCount }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between text-gray-500">
          <span class="text-sm font-medium">Est. Budget</span>
          <svg class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-900 mt-2">฿{{ totalBudget.toLocaleString('en-US') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button 
          v-for="f in ['All', 'Pending', 'In Progress', 'Completed']" 
          :key="f"
          @click="filterStatus = f"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="filterStatus === f ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          {{ f }}
        </button>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loadingData" class="py-20 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Grid -->
    <transition-group 
      v-else-if="filteredItems.length > 0"
      name="list" 
      tag="div" 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ChecklistCard 
        v-for="item in filteredItems" 
        :key="item.id" 
        :item="item" 
        @edit="openForm"
        @delete="handleDelete"
      />
    </transition-group>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 border-dashed">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No items found</h3>
      <p class="mt-1 text-sm text-gray-500" v-if="filterStatus === 'All'">Get started by creating a new checklist item.</p>
      <div class="mt-6" v-if="filterStatus === 'All'">
        <button @click="openForm()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Item
        </button>
      </div>
    </div>

    <!-- Form Modal -->
    <ChecklistForm 
      v-if="showForm" 
      :initialData="selectedItem" 
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import ChecklistCard from './ChecklistCard.vue';
import ChecklistForm from './ChecklistForm.vue';

const items = ref([]);
const loadingData = ref(true);
const showForm = ref(false);
const selectedItem = ref(null);
const filterStatus = ref('All');

onMounted(() => {
  fetchItems();
});

const fetchItems = async () => {
  loadingData.value = true;
  try {
    const response = await api.getChecklists();
    items.value = response.data;
  } catch (error) {
    console.error('Failed to load checklists:', error);
  } finally {
    loadingData.value = false;
  }
};

const completedItemsCount = computed(() => items.value.filter(i => i.status === 'Completed').length);
const totalBudget = computed(() => items.value.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0));

const filteredItems = computed(() => {
  if (filterStatus.value === 'All') return items.value;
  return items.value.filter(item => item.status === filterStatus.value);
});

const openForm = (item = null) => {
  selectedItem.value = item;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  selectedItem.value = null;
};

const handleSave = async ({ id, formData }) => {
  try {
    if (id) {
      await api.updateChecklist(id, formData);
    } else {
      await api.createChecklist(formData);
    }
    await fetchItems();
    closeForm();
  } catch (error) {
    console.error('Failed to save:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('PIN ไม่ถูกต้อง กรุณาลองใหม่');
    } else {
      alert('An error occurred while saving.');
    }
  }
};

const handleDelete = async (id) => {
  const pin = prompt('กรุณาใส่ PIN เพื่อยืนยันการลบ:');
  if (!pin) return;
  try {
    await api.deleteChecklist(id, pin);
    await fetchItems();
  } catch(error) {
    console.error('Failed to delete:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('PIN ไม่ถูกต้อง');
    } else {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  }
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
