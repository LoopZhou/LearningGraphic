import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 创建vue实例
const app = createApp(App);

// 使用route
app.use(router);
// 挂载pinia
app.use(store);

// 挂载实例
app.mount('#app');