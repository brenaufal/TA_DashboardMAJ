import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/Admin/auth'
import App from './App.vue';
import router from './router';
import './styles/main.css';
import './assets/tailwind.css';
import 'flowbite';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const authStore = useAuthStore(pinia);
authStore.loadUser();

app.use(router);

app.mount('#app');