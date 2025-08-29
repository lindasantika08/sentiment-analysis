<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Histogram (Line Chart)</h2>
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  xaxis: {
    categories: dataStore.getHistogramCategories,
  },
});

const series = ref(dataStore.getHistogramData);

// Watch for changes in the store's data
watch(() => dataStore.jsonData, (newData) => {
  if (newData) {
    series.value = newData.data.all.histogram.series;
    chartOptions.value.xaxis.categories = newData.data.all.histogram.categories;
  }
}, { immediate: true });
</script>
