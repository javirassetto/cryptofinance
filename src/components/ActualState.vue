<template>
  <div class="actual-state">
    <div v-if="loading">Cargando...</div>
    <div v-if="error">
      <strong> {{ error }} </strong>
    </div>
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
        <p class="money">${{ totalMoney.toFixed(2) }}</p>
      </div>
    </div>
    <div v-else-if="!loading && !error">
      <strong><p>No tenes criptos disponibles...</p></strong>
      <h3>Total Dinero Actual</h3>
      <p class="money">${{ totalMoney.toFixed(2) }}</p>
      <button type="button" class="button" @click="isBuyAndSellView()">
        Comprar Criptos
      </button>
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
      error: null,
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
        //recorro y guardo en totalCripto valor unico con la funcion reduce descontando o sumando segun la accion
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
          console.log("cantidad " + totalCryptoAmount);
          if (totalCryptoAmount > 0) {
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
        this.error = "Error al cargar los datos de tu estado actual ";
      } finally {
        this.loading = false;
      }
    },
    async calculateTotalMoney() {
      try {
        //sumatoria del dinero total
        this.totalMoney = this.coinData.reduce(
          (accumulator, actual) => accumulator + actual.money,
          0
        );
        //por si edita y queda 1 una venta --Ver
        //if (this.totalMoney < 0) this.totalMoney = 0;
        console.log("total:" + this.totalMoney);
      } catch (error) {
        console.error("Error calculado el dinero total:", error);
      }
    },
    isBuyAndSellView() {
      return this.$router.push({ name: "buyAndSell" });
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
}
.conteiner {
  border: 0.5px solid #ccc;
  border-radius: 5px;
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
  border: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
.money {
  font-weight: bold;
}
.button {
  margin-right: auto;
  margin-left: auto;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #203682;
  color: #fff;
  cursor: pointer;
}
.button:hover {
  background-color: #0056b3;
}
</style>
