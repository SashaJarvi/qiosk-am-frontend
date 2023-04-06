import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/refund-policy",
      name: "refund-policy",
      component: () => import("@/views/RefundPolicyView.vue"),
    },
  ],
});

export default router;
