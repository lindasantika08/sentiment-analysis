<script setup lang="ts">
import { computed, ref, defineProps } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

// Menggunakan data dari store
const sentimentData = computed(() => {
  return dataStore.getFilteredSentimentData;
});

const filteredData = computed(() => {
  if (!props.searchQuery) return sentimentData.value;
  return sentimentData.value.filter(row =>
    row.channel.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

const grandTotal = computed(() => {
  return filteredData.value.reduce((sum, row) => sum + row.total, 0);
});

function formatChannelName(channel: string): string {
  return channel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Sentiment Analysis Table</h2>
    
    <div class="overflow-x-auto">
      <!-- Container dengan tinggi tetap 190px -->
      <div class="h-48 overflow-y-auto border border-gray-300 rounded-lg">
        <table class="min-w-full table-auto border-collapse">
          <thead class="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th class="p-3 border-b border-gray-300 text-left font-semibold">Channel</th>
              <th class="p-3 border-b border-gray-300 text-center font-semibold text-green-600">
                <div class="flex items-center justify-center gap-2">
                  <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                  Positive
                </div>
              </th>
              <th class="p-3 border-b border-gray-300 text-center font-semibold text-gray-600">
                <div class="flex items-center justify-center gap-2">
                  <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
                  Neutral
                </div>
              </th>
              <th class="p-3 border-b border-gray-300 text-center font-semibold text-red-600">
                <div class="flex items-center justify-center gap-2">
                  <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                  Negative
                </div>
              </th>
              <th class="p-3 border-b border-gray-300 text-center font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredData.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500">
                No data available
              </td>
            </tr>
            <tr v-for="row in filteredData" :key="row.channel" class="hover:bg-gray-50 transition-colors">
              <td class="border-b border-gray-200 p-3 font-semibold">
                {{ formatChannelName(row.channel) }}
              </td>
              <td class="border-b border-gray-200 p-3 text-center text-green-600 font-semibold">
                {{ row.positive }}
              </td>
              <td class="border-b border-gray-200 p-3 text-center text-gray-600 font-semibold">
                {{ row.neutral }}
              </td>
              <td class="border-b border-gray-200 p-3 text-center text-red-600 font-semibold">
                {{ row.negative }}
              </td>
              <td class="border-b border-gray-200 p-3 text-center font-bold">
                {{ row.total }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="filteredData.length > 0" class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="text-sm text-gray-600">
        Total Records: {{ filteredData.length }} | 
        Grand Total: {{ grandTotal }}
      </div>
    </div>
  </div>
</template>