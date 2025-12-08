import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // or wherever your Tailwind/CSS is

const app = createApp(App)

app.use(router) // <--- MAKE SURE THIS LINE EXISTS
app.mount('#app')