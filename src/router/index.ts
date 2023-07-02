import { createRouter, createWebHistory, RouterView } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Tr from "@/i18n/translation";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:locale?",
      component: RouterView,
      beforeEnter: Tr.routeMiddleware,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "event/:eventId",
          name: "event-page",
          component: () => import("@/views/EventView.vue"),
        },
        {
          path: "archive",
          name: "events-archive",
          component: () => import("@/views/ArchiveView.vue"),
        },
        {
          path: "refund-policy",
          name: "refund-policy",
          component: () => import("@/views/RefundPolicyView.vue"),
        },
      ],
    },
  ],
});

export default router;
