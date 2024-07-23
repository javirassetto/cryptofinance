<template>
  <div>
    <nav class="navigation">
      <img src="../assets/favicon.png" class="icono" title="cryptoFinance" />
      <span class="user-name">☑️ Usuario: {{ username }}</span>
      <div class="nav-links">
        <router-link to="/coinInfo" class="nav-link">Inicio</router-link>
        <router-link to="/buyAndSell" class="nav-link"
          >Nueva Operación</router-link
        >
        <router-link to="/movementHistory" class="nav-link"
          >Mis Movimientos</router-link
        >
        <router-link to="/actualState" class="nav-link"
          >Estado Actual</router-link
        >
        <router-link to="/investmentAnalysis" class="nav-link"
          >Inversiones</router-link
        >
        <router-link to="/login" class="nav-link" @click="logout()"
          >Cerrar Sesión</router-link
        >
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavComponent",
  data() {
    return {
      userName: null,
    };
  },
  computed: {
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
};
</script>

<style scoped>
/* Icono style */
.icono {
  width: 50px;
  height: 50px;
  padding: 0.8%;
  border-radius: 15px;
}

.navigation {
  background-color: #203682;
  padding: 0.5rem 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(72, 9, 190, 0.1);
  font-family: Arial, Helvetica, sans-serif;
}

.user-name {
  color: #ecf0f1;
  font-weight: bold;
  margin: 0 1rem;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}

.nav-link:hover {
  color: #03090f;
  font-weight: bold;
}
.router-link-active {
  background-color: #1a25bc;
  color: black;
  font-weight: bold;
  text-decoration: underline;
  font-size: larger;
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
    align-items: center;
  }

  .user-name {
    margin: 0.5rem 0;
  }

  .nav-links {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .icono {
    width: 40px;
    height: 40px;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .router-link-active {
    font-size: 1rem;
  }
}
</style>
