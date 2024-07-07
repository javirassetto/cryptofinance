<template>
  <div class="buy-and-sell">
    <h2>Compra & Vende tus Cryptos</h2>
    <form @submit.prevent="handleTransaction">
      <div>
        <label for="action">Tipo de Operación: </label>
        <select v-model.trim="action" required>
          <option disabled selected value="">Seleccione una operación</option>
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>
      <div>
        <label for="crypto">Criptomoneda: </label>
        <select v-model.trim="crypto_code" required>
          <option disabled selected value="">Seleccione una crypto..</option>
          <option value="btc">Bitcoin (BTC)</option>
          <option value="eth">Ethereum (ETH)</option>
          <option value="usdt">Tether (USDT)</option>
          <option value="dai">Dai</option>
        </select>
      </div>
      <div>
        <label for="amount">Cantidad: </label>
        <input
          type="number"
          v-model="crypto_amount"
          placeholder="Ingrese la cantidad.."
          @input="calculatePrice"
        />
      </div>
      <div>
        <label for="money">Monto en ARS: </label>
        <input
          type="number"
          v-model="money"
          placeholder="Su monto es..."
          readonly
        />
      </div>
      <!-- <div>
        <label for="datetime">Ingrese la fecha: </label>
        <input type="datetime-local" v-model="datetime" required />
      </div> -->
      <button type="submit">Registrar Transacción</button>
    </form>
    <div>
      <h3>Tu última Transacción</h3>
      <div v-if="loading">Cargando...</div>
      <table v-if="transactions.length > 0">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
            <th>Acción</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="latestTransaction">
            <td>{{ latestTransaction.crypto_code.toUpperCase() }}</td>
            <td>{{ latestTransaction.crypto_amount }}</td>
            <td>${{ latestTransaction.money }}</td>
            <td>{{ latestTransaction.action }}</td>
            <td>{{ latestTransaction.datetime }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <p>No hay transacciones recientes para mostrar...</p>
      </div>
      <button type="button" style="margin: 10px" @click="isMovementView()">
        Ir a mis movimientos
      </button>
    </div>
  </div>
</template>

<script>
import {
  createTransaction,
  getTransactions,
  getCryptoPrice,
} from "@/services/apiService";

export default {
  name: "BuyandSell",
  data() {
    return {
      crypto_code: "",
      crypto_amount: "",
      money: "",
      action: "",
      datetime: "",
      transactions: [],
      loading: false,
    };
  },
  computed: {
    sortedTransactions() {
      return this.transactions
        .slice()
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    },
    latestTransaction() {
      if (this.transactions.length === 0) return null;
      return this.transactions
        .slice()
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0];
    },
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    async handleTransaction() {
      const userId = this.$store.getters.getUser;
      if (!this.crypto_code || !this.crypto_amount) {
        alert("Todos los campos son obligatorios");
        return;
      }
      if (this.crypto_amount < 0.000001) {
        alert("Tanto la cantidad como el monto deben ser numeros mayores a 0");
        return;
      }
      try {
        const transaction = {
          user_id: userId,
          action: this.action,
          crypto_code: this.crypto_code,
          crypto_amount: this.crypto_amount,
          money: this.money,
          datetime: new Date().toISOString(),
        };

        await createTransaction(transaction);
        this.fetchTransactions();
        this.cleanForm();
        alert("Transacción registrada exitosamente");
      } catch (error) {
        console.error("Error registrando la transacción:", error);
      }
    },
    async fetchTransactions() {
      this.loading = true;
      try {
        this.transactions = await getTransactions();
        this.orderTransctions();
      } catch (error) {
        console.error("Error obteniendo transacciones:", error);
      } finally {
        this.loading = false;
      }
    },
    isMovementView() {
      return this.$router.push({ name: "movementHistory" });
    },
    cleanForm() {
      this.crypto_code = "";
      this.crypto_amount = "";
      this.money = "";
      this.action = "";
      this.datetime = "";
    },
    orderTransctions() {
      return this.transactions
        .slice()
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    },
    async calculatePrice() {
      if (this.crypto_code && this.crypto_amount && this.action) {
        try {
          const cryptoValue = await getCryptoPrice(
            this.crypto_code,
            this.action
          );
          const calculatedMoney = this.crypto_amount * cryptoValue;
          // Asegúrate de que el valor calculado es un número válido
          if (!isNaN(calculatedMoney)) {
            this.money = calculatedMoney.toFixed(2);
          } else {
            this.money = "";
          }
        } catch (error) {
          console.error("Error al calcular el precio:", error);
        }
      } else {
        this.money = "";
      }
    },
  },
  watch: {
    action() {
      this.calculatePrice();
    },
    crypto_code() {
      this.calculatePrice();
    },
    crypto_amount() {
      this.calculatePrice();
    },
  },
};
</script>
<style scoped>
.buy-and-sell {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.buy-and-sell h2 {
  margin-bottom: 1rem;
}
.buy-and-sell form {
  display: flex;
  flex-direction: column;
}
.buy-and-sell label {
  margin-bottom: 0.5rem;
}
.buy-and-sell input,
.buy-and-sell select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.buy-and-sell button {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
.buy-and-sell button:hover {
  background-color: #0056b3;
}
/*ver estilos para option */
.option {
  color: rgba(10, 22, 133, 0.795);
}
/* estilos tabla */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: center;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #ddd;
}
</style>
