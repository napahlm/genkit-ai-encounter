import "./assets/main.scss";
import 'primeicons/primeicons.css';

import { createApp } from "vue";
import { createPinia } from "pinia";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component("Button", Button);
app.component("InputText", InputText);

app.mount("#app");
