<template>
  <div>
    <h2>Análisis de tus Inversiones</h2>
    <div v-if="loading">Cargando...</div>
    <div v-if="error">
      <strong> {{ error }} </strong>
    </div>
    <table v-if="results.length > 0" class="table">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results" :key="result.crypto_code">
          <td>{{ result.crypto_code.toUpperCase() }}</td>
          <td
            :class="{
              positive: result.Winnings > 0,
              negative: result.Winnings < 0,
            }"
          >
            {{ PaintWinnings(result.Winnings) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="!loading && !error">
      <strong><p>No tenes inversiones disponibles...</p></strong>
    </div>
  </div>
</template>

<script>
import { getTransactions, getCryptoPrice } from "@/services/apiService";

export default {
  name: "InvestmentAnalysis",
  data() {
    return {
      transactions: [],
      results: [],
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
      this.error = null;
      try {
        //obtengo las transacciones actuales
        const transactions = await getTransactions();
        //console.log(transactions);

        //guardo por codigo de cripto mapeando en transactions y uso Set para eliminar duplicados
        const CryptoCodes = [
          ...new Set(transactions.map((type) => type.crypto_code)),
        ];
        const coins = [];

        //verifico usando filter los cryptoCode
        for (const cryptoCode of CryptoCodes) {
          const cryptoTransactions = transactions.filter(
            (type) => type.crypto_code === cryptoCode
          );
          //console.log(cryptoTransactions);
          let totalInvested = 0;
          let totalCryptoAmount = 0;

          for (const transaction of cryptoTransactions) {
            if (transaction.action === "purchase") {
              totalInvested += parseFloat(transaction.money);
              totalCryptoAmount += parseFloat(transaction.crypto_amount);
            } else if (transaction.action === "sale") {
              totalInvested -= parseFloat(transaction.money);
              totalCryptoAmount -= parseFloat(transaction.crypto_amount);
            }
          }

          try {
            //obtengo el precio actual y calculo ganancias
            const cryptoPrice = await getCryptoPrice(cryptoCode, "purchase");
            const ActualTotalValue = totalCryptoAmount * cryptoPrice;
            const Winnings = ActualTotalValue - totalInvested;

            coins.push({
              crypto_code: cryptoCode,
              Winnings,
            });
          } catch (error) {
            this.error = "Error al cargar los datos de tus inversiones";
            console.error("Error al calcular el precio:", error);
          }
        }

        this.results = coins;
      } catch (error) {
        this.error = "Error al cargar los datos de tus inversiones";
        console.error("Error al calcular las criptomonedas:", error);
      } finally {
        this.loading = false;
      }
    },
    PaintWinnings(Winnings) {
      return Winnings > 0 ? `+${Winnings.toFixed(2)}` : Winnings.toFixed(2);
    },
  },
};
</script>

<style scoped>
.investment-analysis {
  text-align: center;
}
.table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 80%;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
.positive {
  color: rgb(65, 148, 33);
}
.negative {
  color: rgb(158, 9, 9);
}
</style>
