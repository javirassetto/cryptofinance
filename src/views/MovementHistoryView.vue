<template>
  <div class="Movement">
    <h2>Historial de Transacciones</h2>
  </div>
  <div>
    <MovementHistory />
  </div>
</template>

<script>
// @ is an alias to /src
import MovementHistory from "@/components/MovementHistory.vue";

export default {
  name: "recordMovement",
  components: {
    MovementHistory,
  },
};
</script>
