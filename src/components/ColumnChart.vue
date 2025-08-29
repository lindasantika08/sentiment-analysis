<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Column Chart</h2>
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();
const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: true
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0
      }
    }
  }],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 5,
    },
  },
  xaxis: {
    categories: dataStore.getColumnChartCategories,
  },
  legend: {
    position: 'right',
    offsetY: 40
  },
  fill: {
    opacity: 1
  }
});

const series = ref(dataStore.getColumnChartData);

// Watch for changes in the store's data
watch(() => dataStore.jsonData, (newData) => {
  if (newData) {
    series.value = newData.data.all.column.series;
    chartOptions.value.xaxis.categories = newData.data.all.column.categories;
  }
}, { immediate: true });
</script>
