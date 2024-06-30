<template>
  <h3>Consulta el precio de las Criptomonedas</h3>
  <div class="init">
    <CoinInfo />
  </div>
</template>

<script>
// @ is an alias to /src
import CoinInfo from "@/components/CoinInfo.vue";
export default {
  name: "CoinView",
  components: {
    CoinInfo,
  },
};
</script>
