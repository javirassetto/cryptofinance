import { createRouter, createWebHistory } from "vue-router";
import BuyView from "@/views/BuyView";
import LoginView from "@/views/LoginView.vue";
import SellView from "@/views/SellView";

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
    path: "/buyCripto",
    name: "buyCripto",
    component: BuyView,
  },
  {
    path: "/sellCripto",
    name: "sellCripto",
    component: SellView,
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
