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
/* Contenedor principal */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Encabezado */
.header-view {
  width: 100%;
}
.header-view img {
  width: 100%;
  max-height: 285px;
  object-fit: cover;
  border-bottom: 3px solid rgb(192, 150, 95);
}

/* Vista de inicio de sesión */
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
  background: #f8f9fa;
}

.login {
  background: #fff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.login h2 {
  margin-bottom: 1em;
  color: #333;
  font-family: "Arial", sans-serif;
  text-align: center;
}

.login form {
  display: flex;
  flex-direction: column;
}

.login div {
  margin-bottom: 1em;
}

.login label {
  margin-bottom: 0.5em;
  color: #333;
  font-family: "Arial", sans-serif;
  display: block;
}

.login input {
  border: 1px solid #cccccc;
  padding: 0.75em;
  font-size: 1em;
  border-radius: 5px;
  width: calc(100% - 1.5em);
}

.login span {
  color: red;
  font-size: 0.8em;
}

.login button {
  padding: 0.75em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-family: "Arial", sans-serif;
  transition: background-color 0.3s ease;
}

.login button:disabled {
  background-color: #cccccc;
}

.login button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
