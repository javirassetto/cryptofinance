<template>
  <h3>Compra tus Crypto</h3>
  <div class="Buy">
    <CoinInfo />
  </div>
  <div></div>
</template>

<script>
// @ is an alias to /src
import CoinInfo from "@/components/CoinInfo.vue";
export default {
  name: "BuyCoin",
  components: {
    CoinInfo,
  },
};
</script>
