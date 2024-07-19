<template>
  <div class="crypto-data">
    <div v-if="loading">Cargando...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <h3>
      <b v-if="coinData.length" style="text-align: center">Criptomonedas</b>
    </h3>
    <table v-if="coinData.length" class="table">
      <thead>
        <tr class="tr-title">
          <th>Ranking</th>
          <th>Símbolo</th>
          <th>Nombre</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody class="tr-body">
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

          <th
            v-if="coinData.length"
            @click="selectCoin(index)"
            class="coin-cell"
          >
            <img :src="coin.image" class="coin-image" /><br />
          </th>
          <th @click="selectCoin(index)">
            <span>
              <b>{{ coin.name }}</b>
            </span>
            <span class="span-symbol">
              {{ coin.symbol.toUpperCase() }}
            </span>
          </th>
          <th @click="selectCoin(index)">
            <span>
              <b>USD {{ coin.current_price.toFixed(2) }}</b>
            </span>
          </th>
        </tr>
      </tbody>
    </table>
    <!-- Vista pequeña -->
    <div v-if="selectedCoin !== null && smallView" class="smallView">
      <div class="selected-coin-view">
        <h3>Detalles de la criptomoneda</h3>
        <img :src="selectedCoin.image" class="selected-coin-image" />
        <p><b>Nombre:</b> {{ selectedCoin.name }}</p>
        <p><b>Símbolo:</b> {{ selectedCoin.symbol.toUpperCase() }}</p>
        <p><b>Precio actual:</b> US$ {{ selectedCoin.current_price }}</p>
        <p><b>Ranking de mercado:</b> {{ selectedCoin.market_cap_rank }}°</p>
        <button class="close-btn" @click="closeSelectedCoin">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCryptoData } from "@/services/apiService";

export default {
  name: "CoinData",
  data() {
    return {
      coinData: [],
      loading: false,
      error: null,
      selectedCoin: null,
      hover: null,
      smallView: false,
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
        const data = await getCryptoData();
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
      this.selectedCoin = this.coinData[index];
      this.smallView = true;
    },
    closeSelectedCoin() {
      this.selectedCoin = null;
    },
    limitedCoinData() {
      return this.coinData.slice(0, 15);
    },
  },
  watchEffect: {
    rechargeMe() {
      this.fetchCryptoData();
    },
  },
};
</script>

<style scoped>
.error {
  font-weight: bold;
}
/* Estilos para la tabla y las celdas de las monedas */
.tr-title {
  background-color: rgba(48, 46, 46, 0.651);
  color: #203682;
  font-size: larger;
}
.table {
  width: 95%;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  background-color: black;
  cursor: pointer;
  border-radius: 8px;
}

th,
td {
  padding: 10px;
  border: 1px solid dimgrey;
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
.crypto-data {
  position: relative;
}
/* estilos para la vista pequeña */
.smallView {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.selected-coin-view {
  background-color: white;
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.selected-coin-view p {
  margin-left: 60px;
  text-align: left;
}
.selected-coin-image {
  max-width: 100px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.459);
  border-radius: 50%;
}

.close-btn {
  background-color: #203682;
  border-radius: 4px;
  color: #fff;
  border: none;
  font-size: 19px;
  cursor: pointer;
  font-weight: bold;
}
.close-btn:hover {
  background-color: #0056b3;
}
</style>
