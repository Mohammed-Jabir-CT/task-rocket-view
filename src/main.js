// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './router';
import { createPinia } from 'pinia';
import Loading from './components/Loading.vue';

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .component('Loading', Loading)
  .mount('#app');
