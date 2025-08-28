<script setup lang="ts">
import { computed, ref } from "vue";

// Props dari App.vue
const props = defineProps<{
  data: {
    channel: string
    positive: number
    neutral: number
    negative: number
    total: number
  }[]
}>()

// Search input
const search = ref("")

// Filter data berdasarkan search
const filtered = computed(() => {
  if (!search.value) return props.data
  return props.data.filter(row =>
    row.channel.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <div>
    <!-- Search box -->
    <input
      v-model="search"
      placeholder="Search channel..."
      class="border p-2 mb-3 w-full rounded"
    />

    <!-- Table -->
    <table class="table-auto border-collapse border w-full">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Channel</th>
          <th class="p-2 border">Positive</th>
          <th class="p-2 border">Neutral</th>
          <th class="p-2 border">Negative</th>
          <th class="p-2 border">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filtered" :key="row.channel" class="hover:bg-gray-50">
          <td class="border p-2 font-semibold">{{ row.channel }}</td>
          <td class="border p-2 text-green-600">{{ row.positive }}</td>
          <td class="border p-2 text-gray-600">{{ row.neutral }}</td>
          <td class="border p-2 text-red-600">{{ row.negative }}</td>
          <td class="border p-2">{{ row.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
