<template>
  <div class="login">
    <h2>Registro</h2>
    <form @submit.prevent="createUser">
      <div>
        <label for="username">Nombre Usuario:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="ingrese el usuario.."
          @input="validateUsername"
        />
        <span v-if="usernameError">{{ usernameError }}</span>
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          placeholder="ingrese la contraseña.."
          v-model="password"
        />
      </div>
      <button type="submit" :disabled="!isFormValid">Ingresar</button>
    </form>
  </div>
</template>
<script>
export default {
  name: "LoginComponent",
  data() {
    return {
      username: "",
      password: "",
      usernameError: "",
      isFormValid: false,
    };
  },
  computed: {},
  methods: {
    validateUsername() {
      const alphanumericKey = /^[a-z0-9]+$/i;
      if (!alphanumericKey.test(this.username)) {
        this.usernameError = "El usuario debe ser alfanumerico";
        this.isFormValid = false;
      } else {
        this.usernameError = "";
        this.isFormValid = true;
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 300px;
  margin: auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
}
div {
  margin-bottom: 1em;
}
label {
  margin-bottom: 0.5em;
  color: #333333;
  display: block;
}
input {
  border: 1px solid #cccccc;
  padding: 0.5em;
  font-size: 1em;
  width: calc(100% - 1em);
}
span {
  color: red;
  font-size: 0.8em;
}
button {
  padding: 0.7em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #cccccc;
}
button.hover {
  background-color: #63788f;
}
</style>
