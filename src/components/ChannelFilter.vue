<script setup lang="ts">
import { computed } from 'vue';
import { useJsonDataStore } from '@/stores/dataStore';

const dataStore = useJsonDataStore();

const props = defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const channels = computed(() => {
  // Filter out 'all' dari channel list karena sudah ditambahkan manual
  return dataStore.getChannelList.filter(channel => channel !== 'all');
});

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  // Update selected channel di store
  dataStore.setSelectedChannel(target.value);
}

function formatChannelName(channel: string): string {
  // Capitalize first letter dan replace underscore dengan space
  return channel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>

<template>
  <div class="">
    <select
      class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      :value="modelValue" @change="onChange">
      <option value="all">All Channels</option>
      <option v-for="channel in channels" :key="channel" :value="channel">
        {{ formatChannelName(channel) }}
      </option>
    </select>
  </div>
</template>
