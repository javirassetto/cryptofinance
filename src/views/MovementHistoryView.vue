<template>
  <div class="Movement">
    <h3>Historial de Transacciones</h3>
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
