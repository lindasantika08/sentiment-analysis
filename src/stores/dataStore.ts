import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ResponseData, SentimentData } from '../types/Types';

export const useJsonDataStore = defineStore('jsonData', () => {
  const jsonData = ref<ResponseData | null>(null);
  const selectedChannel = ref('all');

  const fetchJsonData = async () => {
    try {
      const response = await fetch('/response.json');
      const data: ResponseData = await response.json();
      jsonData.value = data;
      console.log('Loaded data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getChannelList = computed(() => {
    if (!jsonData.value?.data) return ['all'];
    // Filter out 'total' key yang bukan channel
    const channels = ['all', ...Object.keys(jsonData.value.data).filter(key => key !== 'all' && key !== 'total')];
    console.log('Available channels:', channels);
    return channels;
  });

  const getSelectedChannelData = computed(() => {
    if (!jsonData.value?.data) return null;
    return jsonData.value.data[selectedChannel.value];
  });

  const getAllSentimentData = computed((): SentimentData[] => {
    if (!jsonData.value?.data) return [];
    
    const result: SentimentData[] = [];
    
    Object.keys(jsonData.value.data).forEach(channelKey => {
      // Skip 'all' dan 'total' karena bukan channel
      if (channelKey === 'all' || channelKey === 'total') return;
      
      const channelData = jsonData.value!.data[channelKey];
      
      if (channelData?.bar?.series && Array.isArray(channelData.bar.series)) {
        const series = channelData.bar.series[0];
        if (series?.data && Array.isArray(series.data)) {
          let positive = 0, neutral = 0, negative = 0;
          
          series.data.forEach((item: any, index: number) => {
            const value = typeof item === 'object' ? (item.y || item.value || 0) : item;
            
            if (index === 0) positive = value;
            else if (index === 1) neutral = value;
            else if (index === 2) negative = value;
          });
          
          result.push({
            channel: channelKey,
            positive,
            neutral,
            negative,
            total: positive + neutral + negative
          });
        }
      }
    });
    
    return result;
  });

  const getFilteredSentimentData = computed((): SentimentData[] => {
    if (selectedChannel.value === 'all') {
      return getAllSentimentData.value;
    }
    
    return getAllSentimentData.value.filter(item => item.channel === selectedChannel.value);
  });

  const getPieChartData = computed(() => {
    if (!getSelectedChannelData.value?.pie) return [];
    return getSelectedChannelData.value.pie.series || [];
  });

  const getBarChartData = computed(() => {
    if (!getSelectedChannelData.value?.bar) return [];
    
    const barData = getSelectedChannelData.value.bar;
    console.log('Raw bar data:', barData);
    
    if (barData.series && Array.isArray(barData.series)) {
      const seriesData = barData.series[0];
      
      if (seriesData?.data && Array.isArray(seriesData.data)) {
        return [{
          name: 'Sentiment Count',
          data: seriesData.data.map((item: any) => {
            if (typeof item === 'object' && item.y !== undefined) {
              return item.y;
            }
            return typeof item === 'number' ? item : 0;
          })
        }];
      }
    }
    
    return [];
  });

  const getColumnChartData = computed(() => {
    if (!getSelectedChannelData.value?.column) return [];
    return getSelectedChannelData.value.column.series || [];
  });

  const getColumnChartCategories = computed(() => {
    if (!getSelectedChannelData.value?.column) return [];
    return getSelectedChannelData.value.column.categories || [];
  });

  const getHistogramData = computed(() => {
    if (!getSelectedChannelData.value?.histogram) return [];
    return getSelectedChannelData.value.histogram.series || [];
  });

  const getHistogramCategories = computed(() => {
    if (!getSelectedChannelData.value?.histogram) return [];
    return getSelectedChannelData.value.histogram.categories || [];
  });

  const setSelectedChannel = (channel: string) => {
    selectedChannel.value = channel;
    // console.log('Selected channel changed to:', channel);
  };

  return {
    jsonData,
    selectedChannel,
    fetchJsonData,
    setSelectedChannel,
    getChannelList,
    getSelectedChannelData,
    getAllSentimentData,
    getFilteredSentimentData,
    getPieChartData,
    getBarChartData,
    getColumnChartData,
    getColumnChartCategories,
    getHistogramData,
    getHistogramCategories
  };
});