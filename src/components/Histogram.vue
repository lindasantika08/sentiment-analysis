<script setup lang="ts">
import { computed } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();

const rawChannelData = computed(() => dataStore.getSelectedChannelData);

const series = computed(() => {
  try {
    const channelData = rawChannelData.value;
    
    if (!channelData?.histogram?.series) {
      console.warn('No histogram series data found');
      return [];
    }

    const histogramSeries = channelData.histogram.series;
    
    if (!Array.isArray(histogramSeries)) {
      console.warn('Histogram series is not an array');
      return [];
    }

    // Proses setiap series
    const processedSeries = histogramSeries.map((seriesItem: any) => {
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

    console.log('Processed histogram series:', processedSeries);
    return processedSeries;

  } catch (error) {
    console.error('Error processing histogram data:', error);
    return [];
  }
});

const categories = computed(() => {
  try {
    const channelData = rawChannelData.value;
    
    if (!channelData?.histogram?.categories) {
      return [];
    }

    const cats = channelData.histogram.categories;
    return Array.isArray(cats) ? cats.filter(cat => cat != null && cat !== '') : [];

  } catch (error) {
    console.error('Error processing histogram categories:', error);
    return [];
  }
});

const hasValidData = computed(() => {
  return series.value.length > 0 && 
         series.value.some((s: any) => s?.data && s.data.length > 0) &&
         categories.value.length > 0;
});

const errorMessage = computed(() => {
  if (!dataStore.jsonData) return 'Loading data...';
  if (!rawChannelData.value) return `No data available for channel: ${dataStore.selectedChannel}`;
  if (!rawChannelData.value.histogram) return 'No histogram data structure found';
  if (!hasValidData.value) return 'No valid data points found';
  return 'Data tidak tersedia';
});

const selectedChannelLabel = computed(() => {
  return dataStore.selectedChannel === 'all' ? 'All Channels' : 
         dataStore.selectedChannel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    },
    fontFamily: 'Inter, sans-serif',
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
    borderColor: '#e7e7e7',
  },
  xaxis: {
    categories: categories.value,
    title: {
      text: 'Time/Categories',
      style: {
        fontSize: '12px',
        fontWeight: 600
      }
    },
    labels: {
      formatter: function (val: any) {
        return val ? val.toString() : '';
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
    },
    labels: {
      formatter: function (val: any) {
        const value = Number(val);
        return isNaN(value) ? '0' : value.toLocaleString();
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        const value = Number(val);
        return isNaN(value) ? '0' : value.toLocaleString();
      }
    }
  },
  markers: {
    size: 4,
    colors: ['#3EC764', '#B3B6C6', '#ED3E3E'],
    strokeWidth: 2,
    hover: {
      size: 6
    }
  }
}));

const refreshData = async () => {
  await dataStore.fetchJsonData();
};
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Histogram (Line Chart) - {{ selectedChannelLabel }}</h2>
    
    <div v-if="hasValidData">
      <apexchart 
        type="line" 
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