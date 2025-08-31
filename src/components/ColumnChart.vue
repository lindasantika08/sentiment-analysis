<script setup lang="ts">
import { computed } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();

const rawChannelData = computed(() => dataStore.getSelectedChannelData);

const series = computed(() => {
  try {
    const channelData = rawChannelData.value;
    
    if (!channelData?.column?.series) {
      console.warn('No column series data found');
      return [];
    }

    const columnSeries = channelData.column.series;
    
    if (!Array.isArray(columnSeries)) {
      console.warn('Column series is not an array');
      return [];
    }

    // Proses setiap series
    const processedSeries = columnSeries.map((seriesItem: any) => {
      if (!seriesItem?.data) {
        return null;
      }

      const cleanData = Array.isArray(seriesItem.data) 
        ? seriesItem.data.map((item: any) => {
            if (typeof item === 'number') {
              return item;
            } else if (typeof item === 'object' && item !== null) {
              return item.y || item.value || 0;
            }
            return 0;
          }).filter((val: number) => !isNaN(val) && isFinite(val))
        : [];

      return {
        name: seriesItem.name || 'Data',
        data: cleanData
      };
    }).filter((item: any) => item !== null && item.data.length > 0);

    console.log('Processed column series:', processedSeries);
    return processedSeries;

  } catch (error) {
    console.error('Error processing column chart data:', error);
    return [];
  }
});

const categories = computed(() => {
  try {
    const channelData = rawChannelData.value;
    
    if (!channelData?.column?.categories) {
      return [];
    }

    const cats = channelData.column.categories;
    return Array.isArray(cats) ? cats : [];

  } catch (error) {
    console.error('Error processing column categories:', error);
    return [];
  }
});

const hasValidData = computed(() => {
  return series.value.length > 0 && 
         series.value.some((s: any) => s?.data && s.data.length > 0);
});

const errorMessage = computed(() => {
  if (!dataStore.jsonData) return 'Loading data...';
  if (!rawChannelData.value) return `No data available for channel: ${dataStore.selectedChannel}`;
  if (!rawChannelData.value.column) return 'No column chart data structure found';
  if (!hasValidData.value) return 'No valid data points found';
  return 'Data tidak tersedia';
});

const selectedChannelLabel = computed(() => {
  return dataStore.selectedChannel === 'all' ? 'All Channels' : 
         dataStore.selectedChannel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    stacked: false,
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
      dataLabels: {
        position: 'top'
      }
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any) {
      const value = Number(val);
      return isNaN(value) ? '0' : value.toString();
    },
    style: {
      fontSize: '10px',
      colors: ['#fff'],
      fontWeight: 'bold'
    }
  },
  xaxis: {
    categories: categories.value,
    title: {
      text: 'Categories',
      style: {
        fontSize: '12px',
        fontWeight: 600
      }
    }
  },
  yaxis: {
    title: {
      text: 'Values',
      style: {
        fontSize: '12px',
        fontWeight: 600
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  },
  fill: {
    opacity: 0.8
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        const value = Number(val);
        return isNaN(value) ? '0' : value.toLocaleString();
      }
    }
  }
}));

const refreshData = async () => {
  await dataStore.fetchJsonData();
};
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Column Chart - {{ selectedChannelLabel }}</h2>
    
    <div v-if="hasValidData">
      <apexchart 
        type="bar" 
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
