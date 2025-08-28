import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import VueApexCharts from "vue3-apexcharts"

const app = createApp(App)

app.use(createPinia())

app.mount('#app')

app.component("apexchart", VueApexCharts);
