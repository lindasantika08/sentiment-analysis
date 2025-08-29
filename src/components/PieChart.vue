<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Pie Chart</h2>
    <apexchart type="pie" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();
const chartOptions = ref({
  labels: ['Positive', 'Neutral', 'Negative'],
  colors: ['#3EC764', '#B3B6C6', '#ED3E3E'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
});

const series = ref(dataStore.getPieChartData);

// Watch for changes in the store's data to ensure reactivity
watch(() => dataStore.jsonData, (newData) => {
  if (newData) {
    series.value = newData.data.all.pie.series;
  }
}, { immediate: true });
</script>
