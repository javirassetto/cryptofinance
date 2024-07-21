<template>
  <div v-if="error" class="error">
    <strong> {{ error }} </strong>
  </div>
  <div class="buy-and-sell" v-if="!error">
    <Alert v-if="showAlert" :message="alertMessage" @accept="handleAccept" />
    <form @submit.prevent="handleTransaction">
      <div>
        <label for="exchange">Tipo de Exchange: </label>
        <select v-model.trim="selectedExchange" required>
          <option disabled selected value="">Seleccione un exchange</option>
          <option value="satoshitango">SatoshiTango</option>
          <option value="buenbit">Buenbit</option>
          <option value="binance">Binance</option>
          <option value="cryptomkt">CryptoMarket</option>
        </select>
      </div>
      <div>
        <label for="action">Tipo de Operación: </label>
        <select v-model.trim="action" required>
          <option disabled selected value="">Seleccione una operación</option>
          <option
            v-for="option in actionOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div>
        <label for="crypto">Criptomoneda: </label>
        <select v-model.trim="crypto_code" required>
          <option disabled selected value="">Seleccione una crypto..</option>
          <option value="btc">Bitcoin (BTC)</option>
          <option value="eth">Ethereum (ETH)</option>
          <option value="usdt">Tether (USDT)</option>
          <option value="sol">Solana (SOL)</option>
          <option value="usdc">Usdc (USDC)</option>
        </select>
      </div>
      <div>
        <label for="amount">Cantidad: </label>
        <input
          type="number"
          step="any"
          min="0.000001"
          v-model.number="crypto_amount"
          placeholder="Ingrese la cantidad.."
          @input="validateAndCalculatePrice"
        />
      </div>
      <div>
        <label for="money">Monto en ARS: </label>
        <input
          type="number"
          step="any"
          min="0.000001"
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
    <br />
    <div v-if="!error">
      <h3>Tu última Transacción</h3>
      <div v-if="loading">Cargando...</div>
      <table v-if="transactions.length > 0 && !loading">
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
            <td>
              {{ latestTransaction.action === "purchase" ? "Compra" : "Venta" }}
            </td>
            <td>{{ latestTransaction.datetime }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <p v-if="!loading">No hay transacciones recientes para mostrar...</p>
      </div>
      <button type="button" style="margin: 10px" @click="isMovementView()">
        Ir a mis movimientos
      </button>
    </div>
  </div>
</template>

<script>
import { createTransaction, getTransactions } from "@/services/apiService";
import { calculatePrice } from "@/utils/calculatePrice";
import Alert from "@/components/AlertComponent.vue";

export default {
  name: "BuyandSell",
  components: {
    Alert,
  },
  data() {
    return {
      crypto_code: "",
      crypto_amount: "",
      money: "",
      action: "",
      datetime: "",
      transactions: [],
      loading: false,
      actionOptions: [
        { value: "purchase", label: "Compra" },
        { value: "sale", label: "Venta" },
      ],
      userCryptos: {},
      error: null,
      showAlert: false,
      alertMessage: "",
      selectedExchange: "",
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
    this.fetchUserCryptos();
  },
  methods: {
    //metodo que reacciona ante el evento del componente hijo y reacciona
    handleAccept() {
      this.showAlert = false;
    },
    showAlertMessage(message) {
      this.alertMessage = message;
      this.showAlert = true;
    },
    async handleTransaction() {
      const userId = this.$store.getters.getUser;
      if (!this.crypto_code || !this.crypto_amount) {
        this.showAlertMessage("Todos los campos son obligatorios.");
        return;
      }
      if (this.crypto_amount <= 0) {
        this.showAlertMessage("La cantidad deben ser un numero mayor a 0.");
        return;
      }
      if (this.action === "sale" && !this.canSellCrypto()) {
        this.showAlertMessage(
          "No tienes suficiente cantidad de esta criptomoneda para realizar la venta."
        );
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
        this.fetchUserCryptos(); // Actualiza las criptomonedas del usuario
        this.cleanForm();
        this.showAlertMessage("Transacción registrada exitosamente.");
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
        this.error = "Ha ocurrido un error al intentar operar..";
        console.error("Error obteniendo transacciones:", error);
      } finally {
        this.loading = false;
      }
    },
    //funcion para ver si dispone de criptos
    async fetchUserCryptos() {
      try {
        //const userId = this.$store.getters.getUser;
        const transactions = await getTransactions();
        this.userCryptos = this.calculateUserCryptos(transactions);
      } catch (error) {
        console.error("Error obteniendo las criptomonedas del usuario:", error);
      }
    },
    calculateUserCryptos(transactions) {
      const userCryptos = {};
      transactions.forEach((transaction) => {
        const { crypto_code, crypto_amount, action } = transaction;
        if (!userCryptos[crypto_code]) {
          userCryptos[crypto_code] = 0;
        }
        if (action === "purchase") {
          userCryptos[crypto_code] += crypto_amount;
        } else if (action === "sale") {
          userCryptos[crypto_code] -= crypto_amount;
        }
      });
      return userCryptos;
    },
    isMovementView() {
      return this.$router.push({ name: "movementHistory" });
    },
    cleanForm() {
      this.selectedExchange = "";
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
    //funcion de util/calculatePrice
    async validateAndCalculatePrice() {
      this.money = await calculatePrice(
        this.crypto_code,
        this.action,
        this.crypto_amount,
        this.selectedExchange
      );
    },
    canSellCrypto() {
      const userCryptoAmount = this.userCryptos[this.crypto_code] || 0;
      return this.crypto_amount <= userCryptoAmount;
    },
  },
  watch: {
    action() {
      this.validateAndCalculatePrice();
    },
    crypto_code() {
      this.validateAndCalculatePrice();
    },
    crypto_amount() {
      this.validateAndCalculatePrice();
    },
    selectedExchange() {
      this.validateAndCalculatePrice();
    },
  },
};
</script>
<style scoped>
.buy-and-sell {
  max-width: 800px;
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
  width: 400px;
  margin-right: auto;
  margin-left: auto;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #203682;
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
.error {
  color: red;
}
</style>
