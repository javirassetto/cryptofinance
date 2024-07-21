import { createRouter, createWebHistory } from "vue-router";
import CoinView from "@/views/CoinView.vue";
import LoginView from "@/views/LoginView.vue";
import MovementHistoryView from "@/views/MovementHistoryView.vue";
import BuyAndSell from "@/views/BuyAndSell.vue";
import ActualStateView from "@/views/ActualStateView.vue";
import InvestmentAnalysisView from "@/views/InvestmentAnalysisView.vue";

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
    path: "/actualState",
    name: "actualState",
    component: ActualStateView,
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

export default router;
