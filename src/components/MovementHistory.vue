<template>
  <div>
    <div v-if="loading">Cargando...</div>
    <table v-if="transactions.length > 0">
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
        <tr v-for="transaction in transactions" :key="transaction._id">
          <td>{{ transaction.crypto_code.toUpperCase() }}</td>
          <td>{{ transaction.crypto_amount }}</td>
          <td>${{ transaction.money }}</td>
          <td>{{ transaction.action }}</td>
          <td>{{ transaction.datetime }}</td>
          <td>
            <button @click="editTransaction(transaction)">Editar</button>
            <button @click="confirmDelete(transaction._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>No hay transacciones para mostrar...</p>
    </div>
    <!-- Div Modal para editar transacción -->
    <div v-if="isEditing" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelEdit">&times;</span>
        <h3>Editar Transacción</h3>
        <form @submit.prevent="handleTransaction">
          <div>
            <label for="crypto_code">Criptomoneda: </label>
            <select v-model.trim="crypto_code" id="crypto_code" required>
              <option disabled selected value="">Seleccione una crypto</option>
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ETH)</option>
              <option value="usdt">Tether (USDT)</option>
              <option value="dai">Dai</option>
            </select>
          </div>
          <div>
            <label for="crypto_amount">Cantidad: </label>
            <input
              v-model="crypto_amount"
              type="number"
              step="0.0001"
              id="crypto_amount"
              required
            />
          </div>
          <div>
            <label for="money">Dinero: </label>
            <input
              v-model="money"
              type="number"
              step="0.01"
              id="money"
              required
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
            <label for="action">Acción: </label>
            <select v-model="action" id="action" required>
              <option value="purchase">Compra</option>
              <option value="sale">Venta</option>
            </select>
          </div>
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

export default {
  name: "MovementHistory",
  data() {
    return {
      crypto_code: "",
      crypto_amount: "",
      money: "",
      action: "",
      datetime: "",
      transactions: [],
      loading: false,
      isEditing: false,
      editingTransaction: null,
      isDelete: false,
      deleteTransactionId: null,
    };
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    async handleTransaction() {
      const transaction = {
        user_id: this.$store.getters.getUser,
        action: this.action,
        crypto_code: this.crypto_code,
        crypto_amount: this.crypto_amount,
        money: this.money,
        datetime: this.myDateTime(),
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
        alert("Transacción registrada exitosamente");
      } catch (error) {
        console.error("Error registrando la transacción:", error);
      }
    },
    async fetchTransactions() {
      this.loading = true;
      try {
        this.transactions = await getTransactions();
      } catch (error) {
        console.error("Error obteniendo transacciones:", error);
      } finally {
        this.loading = false;
      }
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
        alert("Transacción eliminada exitosamente");
      } catch (error) {
        console.error("Error eliminando la transacción:", error);
      }
    },
    myDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = `${now.getMonth() + 1}`.padStart(2, "0");
      const day = `${now.getDate()}`.padStart(2, "0");
      const hour = `${now.getHours()}`.padStart(2, "0");
      const minute = `${now.getMinutes()}`.padStart(2, "0");
      return `${year}-${month}-${day}  ${hour}:${minute}`;
    },
  },
};
</script>

<style scoped>
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
  background-color: #007bff;
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
  width: 70%;
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
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.modal-content button:hover {
  background-color: #0056b3;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
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
</style>
