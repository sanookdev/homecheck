<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <nav class="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-40 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            <span class="font-bold text-xl tracking-tight text-gray-900">HomeCheck</span>
          </div>
        </div>
      </div>
    </nav>

    <Dashboard />
  </div>
</template>

<script setup>
import Dashboard from './components/Dashboard.vue'
</script>
