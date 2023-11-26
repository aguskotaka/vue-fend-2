import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/auth";
import store from './store';

const app = createApp(App).use(store).use(store);

app.use(router);
app.use(store);

app.mount("#app");