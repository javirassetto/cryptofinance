<template>
  <h2>Estado actual de tus finanzas</h2>
  <div>
    <ActualState />
  </div>
</template>

<script>
import ActualState from "@/components/ActualState.vue";

export default {
  name: "ActualStateView",
  components: {
    ActualState,
  },
};
</script>
