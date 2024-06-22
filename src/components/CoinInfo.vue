<template>
  <div class="crypto-data">
    <div v-if="loading">Cargando...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <br />
    <h4>
      <b v-if="coinData.length" style="text-align: center">Criptomonedas</b>
    </h4>
    <table class="table">
      <tr
        v-for="(coin, index) in limitedCoinData()"
        :key="coin._id"
        @mouseover="hover = index"
        @mouseleave="hover = null"
        :class="{ hover: hover === index }"
      >
        <th class="static-th" style="padding-left: 30px">
          <p>{{ coin.market_cap_rank }}°</p>
        </th>

        <td v-if="coinData.length" @click="selectCoin(index)" class="coin-cell">
          <img :src="coin.image" class="coin-image" /><br />
        </td>
        <td @click="selectCoin(index)">
          <span>
            <b>{{ coin.name }}</b>
          </span>
          <span class="span-symbol">
            {{ coin.symbol.toUpperCase() }}
          </span>
        </td>
        <td @click="selectCoin(index)">
          <span>
            <b>${{ coin.current_price }}</b>
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import apiService from "../services/apiService";

export default {
  name: "CoinData",
  data() {
    return {
      coinData: [],
      loading: false,
      error: null,
      selectedCoin: null,
      hover: null,
    };
  },
  created() {
    this.fetchCryptoData();
  },
  methods: {
    async fetchCryptoData() {
      this.loading = true;
      this.error = null;
      try {
        const data = await apiService.getCryptoData();
        this.coinData = data;
        if (data.length > 0) {
          this.selectedCoin = 0; // Establecer la primera opción como predeterminada
        }
      } catch (error) {
        this.error =
          "Hubo un problema al cargar los datos de las criptomonedas.";
      } finally {
        this.loading = false;
      }
    },
    selectCoin(index) {
      alert("Cripto N°" + (index + 1));
    },
    handleSelect() {
      if (this.selectedCoin !== null) {
        const selectedCoin = this.coinData[this.selectedCoin];
        alert(
          `Seleccionaste ${selectedCoin.name} - Precio: $${selectedCoin.current_price}`
        );
      }
    },
    limitedCoinData() {
      return this.coinData.slice(0, 10);
    },
  },
};
</script>

<style scoped>
/* Estilos para la tabla y las celdas de las monedas */
.table {
  width: 95%;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  background-color: black;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  transition: transform 1.1s, background-color 0.3s;
}
.static-th.no-hover {
  /* Estilo específico para el th con coin.market_cap_rank */
  font-weight: bold;
  border: 1px solid #ddd;
}

tr.hover {
  transform: scale(1.1);
  color: rgb(49, 110, 25);
}
.span-symbol {
  padding-left: 1rem !important;
  color: dimgrey !important;
  font-size: 70%;
}
.coin-image {
  width: 2rem;
  margin: 1px;
  padding: 0px;
}
</style>
