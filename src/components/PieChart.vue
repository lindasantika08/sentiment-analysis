<script setup lang="ts">
import { computed } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();

const rawChannelData = computed(() => dataStore.getSelectedChannelData);

const series = computed(() => {
  try {
    const channelData = rawChannelData.value;
    
    if (!channelData?.pie?.series) {
      console.warn('No pie series data found');
      return [];
    }

    const pieData = channelData.pie.series;
    
    if (!Array.isArray(pieData)) {
      console.warn('Pie series is not an array');
      return [];
    }

    const cleanData = pieData.map((item: any) => {
      if (typeof item === 'number') {
        return item;
      } else if (typeof item === 'object' && item !== null) {
        return item.y || item.value || 0;
      }
      return 0;
    }).filter((val: number) => !isNaN(val) && isFinite(val) && val >= 0);

    console.log('Clean pie data:', cleanData);
    return cleanData;

  } catch (error) {
    console.error('Error processing pie chart data:', error);
    return [];
  }
});

const hasValidData = computed(() => {
  return series.value.length > 0 && series.value.some((val: any) => val > 0);
});

const errorMessage = computed(() => {
  if (!dataStore.jsonData) return 'Loading data...';
  if (!rawChannelData.value) return `No data available for channel: ${dataStore.selectedChannel}`;
  if (!rawChannelData.value.pie) return 'No pie chart data structure found';
  if (!hasValidData.value) return 'No valid data points found';
  return 'Data tidak tersedia';
});

const selectedChannelLabel = computed(() => {
  return dataStore.selectedChannel === 'all' ? 'All Channels' : 
         dataStore.selectedChannel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

const chartOptions = computed(() => ({
  labels: ['Positive', 'Neutral', 'Negative'],
  colors: ['#3EC764', '#B3B6C6', '#ED3E3E'],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any, opts: any) {
      const value = opts.w.config.series[opts.seriesIndex];
      return `${Math.round(val)}% (${value})`;
    },
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    }
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val.toLocaleString();
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}));

const refreshData = async () => {
  await dataStore.fetchJsonData();
};
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Pie Chart - {{ selectedChannelLabel }}</h2>
    
    <div v-if="hasValidData">
      <apexchart 
        type="pie" 
        height="250"
        :options="chartOptions" 
        :series="series"
      ></apexchart>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
      <p>{{ errorMessage }}</p>
      <!-- <button 
        @click="refreshData" 
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Data
      </button> -->
    </div>
  </div>
</template>
