import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";
// @ts-ignore
import VueYandexMetrika from "vue3-yandex-metrika";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/main.scss";

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(head);
app.use(router);
app.use(VueYandexMetrika, {
  id: import.meta.env.VITE_YM_ID,
  router: router,
  env: import.meta.env.MODE,
  options: {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: "dataLayer",
  },
});

app.mount("#app");
