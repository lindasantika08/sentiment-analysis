<script setup lang="ts">
import { computed, ref } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();
const debugMode = ref(false); // lagi ga butuh debug info

const rawData = computed(() => dataStore.getSelectedChannelData);

const series = computed(() => {
  const data = dataStore.getBarChartData;
  console.log('Bar chart data from store:', data);
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.map((seriesItem: any) => {
    const processedData = Array.isArray(seriesItem.data) 
      ? seriesItem.data.filter((item: any) => item !== null && item !== undefined)
      : [];
    
    return {
      name: seriesItem.name || 'Sentiment',
      data: processedData
    };
  }).filter(item => item.data.length > 0);
});

const hasValidData = computed(() => {
  return series.value.some(s => s.data && s.data.length > 0);
});

const debugMessage = computed(() => {
  if (!dataStore.jsonData) return 'Loading data...';
  if (!rawData.value) return `No data for channel: ${dataStore.selectedChannel}`;
  if (!series.value || series.value.length === 0) return 'No series data available';
  return 'Data tidak tersedia';
});

const selectedChannelLabel = computed(() => {
  return dataStore.selectedChannel === 'all' ? 'All Channels' : 
         dataStore.selectedChannel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
    fontFamily: 'Inter, sans-serif',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any) {
      return val ? val.toString() : '0';
    },
    style: {
      fontSize: '12px',
      colors: ['#fff'],
      fontWeight: 'bold'
    }
  },
  xaxis: {
    categories: ['Positive', 'Neutral', 'Negative'],
    title: {
      text: 'Jumlah Sentimen'
    },
    labels: {
      formatter: function (val: any) {
        return val ? val.toString() : '0';
      }
    }
  },
  yaxis: {
    title: {
      text: 'Kategori Sentimen'
    }
  },
  colors: ['#3EC764', '#B3B6C6', '#ED3E3E'],
  legend: {
    show: false
  },
  grid: {
    borderColor: '#e7e7e7',
    strokeDashArray: 3,
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val ? val.toString() : '0';
      }
    }
  }
}));
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Bar Chart - {{ selectedChannelLabel }}</h2>
    
    <!-- Debug info -->
    <!-- <div v-if="debugMode" class="mb-4 p-2 bg-gray-100 rounded text-xs">
      <p>Raw data: {{ JSON.stringify(rawData) }}</p>
      <p>Processed series: {{ JSON.stringify(series) }}</p>
    </div> -->
    
    <div v-if="series && series.length > 0 && hasValidData">
      <apexchart 
        type="bar" 
        height="235"
        :options="chartOptions" 
        :series="series"
      ></apexchart>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
      <p>{{ debugMessage }}</p>
    </div>
  </div>
</template>
