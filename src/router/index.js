import { createRouter, createWebHistory } from "vue-router";
import CoinView from "@/views/CoinView.vue";
import LoginView from "@/views/LoginView.vue";
import MovementHistoryView from "@/views/MovementHistoryView.vue";
import BuyAndSell from "@/views/BuyAndSell.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/buyAndSell",
    name: "buyAndSell",
    component: BuyAndSell,
  },
  {
    path: "/coinInfo",
    name: "coinInfo",
    component: CoinView,
  },
  {
    path: "/movementHistory",
    name: "movementHistory",
    component: MovementHistoryView,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //  import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
