import axios from "axios";
import store from "@/store";

// URL base para la API de almacenamiento de datos
//const URL_base = "https://laboratorio-36cf.restdb.io/rest/";

// Clave API para la API de almacenamiento de datos
//const apiKey = "64a5ccf686d8c5d256ed8fce";

// URL 2° por si falla
const URL_base = "https://laboratorio3-5459.restdb.io/rest/";
const apiKey = "64a57c2b86d8c50fe6ed8fa5";

// URL 3° por si falla
//const URL_base = "https://laboratorio3-5fc7.restdb.io/rest/";
//const apiKey = "64bdbc3386d8c5613ded91e7";

// Axios para la API de DB
const apiClient = axios.create({
  baseURL: URL_base,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-apikey": apiKey,
  },
});

// Axios para la API de Buenbit
const buenbitApi = axios.create({
  baseURL: "https://criptoya.com/api",
});

// Obtengo datos de Buenbit VER
export const getBuenbitData = async () => {
  try {
    const response = await buenbitApi.get("/buenbit");
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Buenbit API:", error);
    throw error;
  }
};

// Obtengo datos de CoinGecko
export const getCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    return response.data;
  } catch (error) {
    console.error("Error trying to recover:", error);
    throw error;
  }
};

// Creo una nueva transacción
export const createTransaction = async (transaction) => {
  try {
    const response = await apiClient.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Obtengo todas las transacciones
export const getTransactions = async () => {
  const userId = store.getters.getUser;
  try {
    const response = await apiClient.get(
      `/transactions?q={"user_id":"${userId}"}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Elimino una transacción por ID
export const deleteTransactionById = async (transactionId) => {
  try {
    const response = await apiClient.delete(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Actualizar una transacción
export const updateTransaction = async (transactionId, transaction) => {
  try {
    const response = await apiClient.put(
      `/transactions/${transactionId}`,
      transaction
    );
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

//Exporto
export default {
  getBuenbitData,
  getCryptoData,
  createTransaction,
  getTransactions,
  deleteTransactionById,
  updateTransaction,
};
