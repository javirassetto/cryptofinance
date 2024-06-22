<template>
  <div class="Sell">
    <h3>Vende tus Crypto</h3>
  </div>
  <div class="coins">
    <CoinInfo />
  </div>
</template>

<script>
// @ is an alias to /src
import CoinInfo from "@/components/CoinInfo.vue";

export default {
  name: "SellCoin",
  components: {
    CoinInfo,
  },
};
</script>
<style scoped></style>
