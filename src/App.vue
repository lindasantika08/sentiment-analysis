<script setup lang="ts">
import { ref, onMounted, watch, markRaw } from 'vue';
import type { Component } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';
import ChannelFilter from '@/components/ChannelFilter.vue';
import BarChart from '@/components/BarChart.vue';
import SentimentTable from '@/components/SentimentTable.vue';
import ColumnChart from '@/components/ColumnChart.vue';
import Histogram from '@/components/Histogram.vue';
import PieChart from '@/components/PieChart.vue';

const dataStore = useJsonDataStore();
const selectedChannel = ref('all');
const tableSearch = ref('');

const isModalOpen = ref(false);
const currentChartComponent = ref<Component | null>(null);
const modalTitle = ref('');

function showChartModal(component: any, title: string) {
  currentChartComponent.value = markRaw(component);
  modalTitle.value = title;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentChartComponent.value = null;
  modalTitle.value = '';
}

watch(selectedChannel, (newValue: string) => {
  dataStore.setSelectedChannel(newValue);
});

onMounted(async () => {
  await dataStore.fetchJsonData();
});

watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>


<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="w-full mx-auto">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-1">Dashboard Analisis Sentimen</h1>
        </div>

        <div class="mb-4 flex flex-wrap items-center justify-end gap-2">
          <button @click="showChartModal(PieChart, 'Pie Chart')"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            Pie Chart
          </button>
          <button @click="showChartModal(BarChart, 'Bar Chart')"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
            Bar Chart
          </button>
          <button @click="showChartModal(ColumnChart, 'Column Chart')"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
            Column Chart
          </button>
          <button @click="showChartModal(Histogram, 'Histogram')"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
            Histogram
          </button>

          <input v-model="tableSearch" placeholder="Search channel..."
            class="w-full max-w-sm p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <ChannelFilter v-model="selectedChannel" />
        </div>

        <div class="grid grid-cols-6 gap-4 mb-4">
          <div class="col-span-2">
            <PieChart />
          </div>
          <div class="col-span-2">
            <BarChart />
          </div>
          <div class="col-span-2">
            <SentimentTable :search-query="tableSearch" />
          </div>
        </div>

        <div class="grid grid-cols-6 gap-4 mb-3">
          <div class="col-span-2">
            <ColumnChart />
          </div>
          <div class="col-span-4">
            <Histogram />
          </div>
        </div>
      </div>

      <Transition name="smooth-modal">
        <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg p-6 shadow-xl w-full max-w-5xl relative">
            <button @click="closeModal"
              class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
            <div class="overflow-auto max-h-[80vh]">
              <component :is="currentChartComponent" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
</template>

<style>
.smooth-modal-enter-active,
.smooth-modal-leave-active {
  transition: opacity 0.3s ease;
}

.smooth-modal-enter-from,
.smooth-modal-leave-to {
  opacity: 0;
}

.smooth-modal-enter-active .bg-white {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s;
}

.smooth-modal-leave-active .bg-white {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.smooth-modal-enter-from .bg-white,
.smooth-modal-leave-to .bg-white {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>