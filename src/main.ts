import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/main.scss";

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(head);
app.use(router);

app.mount("#app");
