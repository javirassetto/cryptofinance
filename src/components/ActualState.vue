<template>
  <div class="actual-state">
    <div v-if="loading">Cargando...</div>
    <div v-if="coinData.length > 0" class="conteiner">
      <h3>Tus Criptomonedas</h3>
      <table>
        <thead>
          <tr>
            <th>Cripto</th>
            <th>Cantidad</th>
            <th>Dinero</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(coins, index) in coinData" :key="index">
            <td>{{ coins.crypto_code.toUpperCase() }}</td>
            <td>{{ coins.crypto_amount }}</td>
            <td>${{ coins.money.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalMoney !== null">
        <h3>Total Dinero Actual</h3>
        <p>${{ totalMoney.toFixed(2) }}</p>
      </div>
    </div>
    <div v-else>
      <p v-if="!loading">No hay transacciones para mostrar...</p>
    </div>
  </div>
</template>

<script>
import { getTransactions, getCryptoPrice } from "@/services/apiService";

export default {
  name: "ActualState",
  data() {
    return {
      coinData: [],
      totalMoney: 0,
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      await this.calculateCryptoPrice();
      await this.calculateTotalMoney();
      this.loading = false;
    },
    async calculateCryptoPrice() {
      try {
        //obtengo las transacciones actuales
        const transactions = await getTransactions();
        //console.log(transactions);

        //guardo por codigos mapeando en transactions y uso Set para eliminar duplicados
        const CryptoCodes = [
          ...new Set(transactions.map((type) => type.crypto_code)),
        ];
        console.log(CryptoCodes);
        const coins = [];

        for (const crypto_code of CryptoCodes) {
          const totalCryptoAmount = transactions.reduce(
            (accumulator, actual) => {
              if (actual.crypto_code === crypto_code) {
                if (actual.action === "purchase") {
                  return accumulator + parseFloat(actual.crypto_amount);
                } else if (actual.action === "sale") {
                  return accumulator - parseFloat(actual.crypto_amount);
                }
              }
              return accumulator;
            },
            0
          );

          if (totalCryptoAmount !== 0) {
            //obtengo el precio actual
            try {
              const cryptoPrice = await getCryptoPrice(crypto_code, "purchase");
              const moneyValue = totalCryptoAmount * cryptoPrice;
              coins.push({
                crypto_code,
                crypto_amount: totalCryptoAmount,
                money: moneyValue,
              });
              //console.log(cryptoPrice);
              //console.log(coins);
            } catch (error) {
              console.error("Error al calcular el precio:", error);
            }
          }
        }
        this.coinData = coins;
        console.log(this.coinData.length);
      } catch (error) {
        console.error("Error al calcular las criptomonedas:", error);
      }
    },
    async calculateTotalMoney() {
      try {
        this.totalMoney = this.coinData.reduce(
          (accumulator, actual) => accumulator + actual.money,
          0
        );
        console.log("total:" + this.totalMoney);
      } catch (error) {
        console.error("Error calculado el dinero total:", error);
      }
    },
  },
};
</script>

<style scoped>
.actual-state {
  max-width: 800px;
  margin: 2em auto;
}

.actual-state h2 {
  text-align: center;
  color: #333;
}
.conteiner {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f4f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 2em auto;
  padding: 1em;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
}

table th,
table td {
  padding: 0.5em;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
