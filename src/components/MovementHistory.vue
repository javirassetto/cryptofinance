<template>
  <div class="Movement-History">
    <Alert v-if="showAlert" :message="alertMessage" @accept="handleAccept" />
    <div v-if="loading">Cargando...</div>
    <div v-if="error" class="error">
      <strong> {{ error }} </strong>
    </div>
    <table v-if="transactions.length > 0 && !error && !loading">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Dinero</th>
          <th>Acción</th>
          <th>Fecha y Hora</th>
          <th>Opciones historial</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in sortedTransactions" :key="transaction._id">
          <td>{{ transaction.crypto_code.toUpperCase() }}</td>
          <td>{{ transaction.crypto_amount }}</td>
          <td>${{ transaction.money }}</td>
          <td>
            {{ transaction.action === "purchase" ? "Compra" : "Venta" }}
          </td>
          <td>{{ transaction.datetime }}</td>
          <td>
            <button @click="DetailTransaction(transaction)">Detalle</button>
            <button @click="editTransaction(transaction)">Editar</button>
            <button @click="confirmDelete(transaction._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!--Div Print-->
    <br />
    <div v-if="transactions.length > 0 && !error && !loading">
      <img
        :src="imagePrint"
        title="Imprimir Historial"
        class="print"
        @click="Print()"
      />
    </div>
    <div v-else-if="!loading && !error">
      <strong><p>No hay transacciones para mostrar...</p></strong>
    </div>
    <!-- Div Modal para ver detalle de la transaccion -->
    <div v-if="isDetail" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelDetail">&times;</span>
        <h3>Detalle de Transacción</h3>
        <div class="detailView">
          <p>
            <strong>Acción:</strong>
            {{ detailTransaction.action === "purchase" ? "Compra" : "Venta" }}
          </p>
          <p>
            <strong>Criptomoneda:</strong>
            {{ detailTransaction.crypto_code.toUpperCase() }}
          </p>
          <p>
            <strong>Cantidad:</strong> {{ detailTransaction.crypto_amount }}
          </p>
          <p><strong>Dinero:</strong> $ {{ detailTransaction.money }}</p>
          <p><strong>Fecha y Hora:</strong> {{ detailTransaction.datetime }}</p>
        </div>
        <div>
          <button @click="cancelDetail">Cerrar</button>
        </div>
      </div>
    </div>
    <!-- Div Modal para editar transacción -->
    <div v-if="isEditing" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelEdit">&times;</span>
        <h3>Editar Transacción</h3>
        <form @submit.prevent="handleTransaction">
          <div>
            <label for="action">Acción: </label>
            <select v-model.trim="action" id="action" required>
              <option value="purchase">Compra</option>
              <option value="sale">Venta</option>
            </select>
          </div>
          <div>
            <label for="crypto_code">Criptomoneda: </label>
            <select v-model.trim="crypto_code" id="crypto_code" required>
              <option disabled selected value="">Seleccione una crypto</option>
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ETH)</option>
              <option value="usdt">Tether (USDT)</option>
              <option value="sol">Solana (SOL)</option>
              <option value="usdc">Usdc (USDC)</option>
            </select>
          </div>
          <div>
            <label for="crypto_amount">Cantidad: </label>
            <input
              v-model.number="crypto_amount"
              type="number"
              step="any"
              min="0.000001"
              id="crypto_amount"
              @input="calculatePrice"
              required
            />
          </div>
          <div>
            <label for="money">Monto en ARS: </label>
            <input
              v-model="money"
              type="number"
              step="any"
              min="0.000001"
              id="money"
              readonly
            />
          </div>
          <!-- <div>
            <label for="datetime">Ingrese la fecha: </label>
            <input
              v-model="datetime"
              type="datetime-local"
              id="datetime"
              required
            />
          </div> -->
          <div>
            <button type="submit">Guardar</button>
            <button type="button" @click="cancelEdit">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Div Modal para eliminar transacción -->
    <div v-if="isDelete" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelDelete">&times;</span>
        <h3>Eliminar Transacción</h3>
        <h4>¿Está seguro de querer eliminar?</h4>
        <div>
          <button @click="deleteTransaction">Eliminar</button>
          <button @click="cancelDelete">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  createTransaction,
  getTransactions,
  deleteTransactionById,
  updateTransaction,
} from "@/services/apiService";
import { calculatePrice } from "@/utils/calculatePrice";
import Alert from "@/components/AlertComponent.vue";
import ImagePrint from "../assets/Print.jpg";

export default {
  name: "MovementHistory",
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
      isDetail: false,
      detailTransaction: null,
      isEditing: false,
      editingTransaction: null,
      isDelete: false,
      deleteTransactionId: null,
      error: null,
      showAlert: false,
      alertMessage: "",
      imagePrint: ImagePrint,
    };
  },
  computed: {
    sortedTransactions() {
      return this.transactions
        .slice()
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    },
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    handleAccept() {
      this.showAlert = false;
    },
    showAlertMessage(message) {
      this.alertMessage = message;
      this.showAlert = true;
    },
    async handleTransaction() {
      const transaction = {
        user_id: this.$store.getters.getUser,
        action: this.action,
        crypto_code: this.crypto_code,
        crypto_amount: this.crypto_amount,
        money: this.money,
        datetime: new Date().toISOString(),
      };
      try {
        if (this.isEditing && this.editingTransaction) {
          await updateTransaction(this.editingTransaction._id, transaction);
          this.isEditing = false;
          this.editingTransaction = null;
        } else {
          await createTransaction(transaction);
        }
        this.fetchTransactions();
        this.showAlertMessage("Transacción registrada exitosamente");
      } catch (error) {
        this.error = " Ha ocurrido un error en la operación.";
        this.isEditing = false;
        console.error("Error registrando la transacción:", error);
      }
    },
    async fetchTransactions() {
      this.loading = true;
      try {
        this.transactions = await getTransactions();
        this.orderTransctions();
      } catch (error) {
        this.error = "Error al cargar tu historial...";
        console.error("Error obteniendo transacciones:", error);
      } finally {
        this.loading = false;
      }
    },
    DetailTransaction(transaction) {
      this.isDetail = true;
      this.detailTransaction = transaction;
    },
    cancelDetail() {
      this.isDetail = false;
      this.detailTransaction = null;
    },
    editTransaction(transaction) {
      this.isEditing = true;
      this.editingTransaction = transaction;
      this.crypto_code = transaction.crypto_code;
      this.crypto_amount = transaction.crypto_amount;
      this.money = transaction.money;
      this.action = transaction.action;
      this.datetime = transaction.datetime;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingTransaction = null;
      this.crypto_code = "";
      this.crypto_amount = "";
      this.money = "";
      this.action = "";
      this.datetime = "";
    },
    confirmDelete(transactionId) {
      this.isDelete = true;
      this.deleteTransactionId = transactionId;
    },
    cancelDelete() {
      this.isDelete = false;
      this.deleteTransactionId = null;
    },
    async deleteTransaction() {
      try {
        await deleteTransactionById(this.deleteTransactionId);
        this.fetchTransactions();
        this.isDelete = false;
        this.deleteTransactionId = null;
        this.showAlertMessage("Transacción eliminada exitosamente");
      } catch (error) {
        this.error = " Ha ocurrido un error en la operación";
        this.isDelete = false;
        console.error("Error eliminando la transacción:", error);
      }
    },
    orderTransctions() {
      return this.transactions
        .slice()
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    },
    async validateAndCalculatePrice() {
      this.money = await calculatePrice(
        this.crypto_code,
        this.crypto_amount,
        this.action
      );
    },
    Print() {
      window.print();
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
  },
};
</script>

<style scoped>
.Movement-History {
  padding: 15px;
  margin-left: auto;
  margin-right: auto;
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
/*estilos para botones */
button {
  margin-right: 8px;
  padding: 5px 10px;
  color: #fff;
  background-color: #203682;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #0056b3;
}
/* Estilos para la ventana modal */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 10px;
  width: 50%;
}
.modal-content label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.modal-content input,
.modal-content select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-content button {
  color: #fff;
  background-color: #203682;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.modal-content button:hover {
  background-color: #0056b3;
}

.close {
  color: #203682;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #aaa;
  text-decoration: none;
  cursor: pointer;
}
.detailView p {
  margin-left: 15em;
  text-align: left;
}
/* Estilos para el formulario de edición */
.edit-form h3 {
  margin-bottom: 10px;
}

.edit-form div {
  margin-bottom: 10px;
}

.edit-form label {
  display: block;
  margin-bottom: 5px;
}

.edit-form input,
.edit-form select {
  width: 100%;
  margin: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.edit-form button {
  margin-right: 10px;
}
.print {
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
  cursor: pointer;
}
.print:hover {
  height: 60px;
  width: 60px;
}
.error {
  color: red;
}
</style>
