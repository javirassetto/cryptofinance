<template>
  <navigation v-if="!isLoginView" />
  <h1 v-if="!isLoginView">{{ title.toUpperCase() }}</h1>
  <router-view />
</template>

<script>
import Navigation from "@/components/NavComponent.vue";

export default {
  components: {
    Navigation,
  },
  name: "App",
  data() {
    return {
      title: "Bienvenido a Crypto-Finance",
    };
  },
  computed: {
    isLoginView() {
      // Verifico si la ruta actual es "/login"
      return this.$route.path === "/login";
    },
  },
  methods: {},
  //Ejemplo con otra Api
  /* async mounted() {
    const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    const data = await response.json();
    console.log(data);
  },*/
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
