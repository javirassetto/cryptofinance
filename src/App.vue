<template>
  <nav v-if="!isLoginView" class="navigation">
    <span class="user-name">Usuario: {{ username }}</span>
    <router-link to="/buyCripto" class="nav-link">Comprar</router-link>
    <router-link to="/sellCripto" class="nav-link">Vender</router-link>
    <router-link to="/login" class="nav-link">Cerrar Sesión</router-link>
  </nav>
  <h1 v-if="!isLoginView">{{ title.toUpperCase() }}</h1>
  <router-view />
</template>
<script>
export default {
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
    username() {
      // retorno el nombre del usuario.
      return this.$store.getters.getUser;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
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
.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 4px;
}
.navigation {
  background-color: #2d77c0;
  padding: 0rem 1rem;
  display: flex;
  justify-content: center !important;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(72, 9, 190, 0.1);
  font-family: Arial, Helvetica, sans-serif;
  font-size: large;
}

.nav-link {
  color: #ecf0f1;
  margin: 0 0rem;
  padding: 1rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-family: Arial, Helvetica, sans-serif;
  font-size: large;
}

.nav-link:hover {
  background-color: #447ab1;
  color: #ffffff;
}

.nav-link:active {
  background-color: #1a25bc;
  color: #ffffff;
}

.nav-link:not(:last-child)::after {
  content: "--";
  color: #ecf0f1;
  margin-left: 2rem;
  /*separacion*/
}
.user-name {
  text-align: center;
  margin-left: 2rem;
  margin-top: 1rem;
  margin-right: auto;
  color: #ecf0f1;
  font-weight: bold; /*resltando texto*/
}
@media (max-width: 600px) {
  .navigation {
    flex-direction: column;
    align-items: flex-start;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
  }

  .nav-link {
    margin: 0.5rem 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
  }

  .nav-link:not(:last-child)::after {
    content: none;
  }
  /*anterior */
  nav {
    padding: 10px;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
}
</style>
