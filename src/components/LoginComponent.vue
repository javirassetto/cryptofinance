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
        <span v-show="usernameError">{{ usernameError }}</span>
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          placeholder="ingrese la contraseña.."
          v-model="password"
          @input="validatePassword"
        />
        <span v-show="PasswordError">{{ PasswordError }}</span>
        <span @change="validateForm"></span>
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
      PasswordError: "",
    };
  },
  methods: {
    validateUsername() {
      const alphanumericKey = /^[a-z0-9_@.]+$/i;
      if (!alphanumericKey.test(this.username)) {
        this.usernameError = "El usuario debe ser alfanumérico ⛔";
        this.isFormValid = false;
        this.password = "";
        this.PasswordError = "";
      } else if (this.username.length < 7) {
        this.usernameError = "⚠️ El usuario debe tener al menos 7 caracteres";
        this.isFormValid = false;
        this.password = "";
        this.PasswordError = "";
      } else {
        this.usernameError = "☑️";
      }
    },
    validatePassword() {
      if (this.username.length > 7) {
        if (this.password.length === 0) {
          this.PasswordError = "⚠️ Ingrese una contraseña";
          this.isFormValid = false;
        } else {
          this.PasswordError = "☑️";
          this.isFormValid = true;
        }
      }
    },
    createUser() {
      this.validateUsername();
      this.validatePassword();
      if (
        this.isFormValid &&
        this.username.length > 7 &&
        this.password.length > 0
      ) {
        /* despacho el nombre del usuario a "store action login" */
        this.$store.dispatch("login", this.username);
        /*me redirecciono a la vista principal*/
        this.$router.push({ name: "coinInfo" });
      } else {
        alert("Error en el inicio de sesión");
        this.isFormValid = false;
        this.username = "";
        this.password = "";
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 2em auto;
  padding: 2em;
  border: 3px solid #203682;
  border-radius: 10px;
  background-color: #f0f4f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login h2 {
  text-align: center;
  color: #0d183f;
  margin-bottom: 1.5em;
}

div {
  margin-bottom: 1.5em;
}

label {
  margin-bottom: 0.5em;
  color: #0d183f;
  display: block;
}

input {
  border: 2px solid #ccc;
  padding: 0.5em;
  font-size: 1em;
  width: calc(100% - 1em);
  border-radius: 5px;
}

input:focus {
  border-color: #203682;
  outline: none;
}

span {
  color: red;
  font-size: 0.8em;
}

button {
  padding: 0.7em;
  color: #fff;
  background-color: #203682;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1em;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
