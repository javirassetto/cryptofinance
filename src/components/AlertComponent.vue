<template>
  <div v-if="visible" class="alert">
    <div class="alert-content">
      <p>{{ message }}</p>
      <div class="button-container">
        <button @click="acceptAlert">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message"],
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    //emito un evento para que el componente padre escuche
    acceptAlert() {
      this.visible = false;
      this.$emit("accept");
    },
  },
};
</script>

<style scoped>
.alert {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.alert-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 2px solid #888;
  border-radius: 10px;
  width: 45%;
}
.alert-content p {
  margin: 0 0 10px 0;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}
.button-container {
  display: flex;
  justify-content: flex-end;
}
.alert-content button {
  padding: 10px 30px;
  border: none;
  background-color: #203682;
  color: #fefefe;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.alert-content button:hover {
  background-color: #0056b3;
}
</style>
