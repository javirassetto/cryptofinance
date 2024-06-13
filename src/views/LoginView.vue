<template>
  <div class="container">
    <header class="header-view">
      <img alt="headerCrypto" src="../assets/crypto_finance_header.png" />
    </header>
    <div class="login-view">
      <Login />
    </div>
  </div>
</template>

<script>
import Login from "../components/LoginComponent.vue";

export default {
  name: "LoginView",
  components: {
    Login,
  },
};
</script>

<style scoped>
.header-view {
  width: 100%;
}
.header-view img {
  width: 100%;
  max-height: 285px;
  object-fit: cover;/* Asegura que la imagen se ajuste bien dentro del contenedor */
}
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  margin-top: 0;
  padding: 0 5px;
}
</style>
