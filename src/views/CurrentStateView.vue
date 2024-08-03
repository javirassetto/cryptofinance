<template>
  <h2>Estado actual de tus finanzas</h2>
  <div>
    <CurrentState />
  </div>
</template>

<script>
import CurrentState from "@/components/CurrentState.vue";

export default {
  name: "CurrentStateView",
  components: {
    CurrentState,
  },
};
</script>
