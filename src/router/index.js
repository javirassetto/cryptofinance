import { createRouter, createWebHistory } from "vue-router";
import CoinView from "@/views/CoinView.vue";
import LoginView from "@/views/LoginView.vue";
import MovementHistoryView from "@/views/MovementHistoryView.vue";
import BuyAndSell from "@/views/BuyAndSell.vue";
import CurrentStateView from "@/views/CurrentStateView.vue";
import InvestmentAnalysisView from "@/views/InvestmentAnalysisView.vue";
import store from "@/store";
const routes = [
  {
    path: "/",
    redirect: "/login",
    component: LoginView,
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
  },
  {
    path: "/currentState",
    name: "currenteState",
    component: CurrentStateView,
  },
  {
    path: "/investmentAnalysis",
    name: "investmentAnalysis",
    component: InvestmentAnalysisView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
//navegación global
router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const isAuthenticated = store.getters.isAuthenticated;

  if (authRequired && !isAuthenticated) {
    return next("/login");
  }
  next();
});

export default router;
