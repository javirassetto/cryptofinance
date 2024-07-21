import axios from "axios";
import store from "@/store";

// URL base para la API de almacenamiento de datos
const URL_base = "https://laboratorio3-f36a.restdb.io/rest";

// Clave API para la API de almacenamiento de datos
const apiKey = "60eb09146661365596af552f";

// URL 2° por si falla
//const URL_base = "https://laboratorio3-5459.restdb.io/rest/";
//const apiKey = "64a57c2b86d8c50fe6ed8fa5";

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

// Axios para la API de CriptoYa
const apiCriptoya = "https://criptoya.com/api/";
// Obtengo el precio de los exchange - satoshitango por defecto
export const getCryptoPrice = async (
  crypto,
  action,
  amount,
  exchange = "satoshitango"
) => {
  try {
    const response = await axios.get(
      `${apiCriptoya}${exchange}/${crypto.toLowerCase()}/ars/${amount}`
    );
    return action === "purchase" ? response.data.ask : response.data.bid;
  } catch (error) {
    console.error("Error cuando buscando el precios de las crypto:", error);
    throw error;
  }
};

//-------------

// Obtengo datos de CoinGecko
export const getCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=ars&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    // const res = await response.data;
    // console.log(res);
    return response.data;
  } catch (error) {
    console.error("Error intentando traer datos:", error);
    throw error;
  }
};

// Creo una nueva transacción
export const createTransaction = async (transaction) => {
  try {
    const response = await apiClient.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Error creando transaccion:", error);
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
    console.error("Error buscando transacciones:", error);
    throw error;
  }
};

// Elimino una transacción por ID
export const deleteTransactionById = async (transactionId) => {
  try {
    const response = await apiClient.delete(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando transacciones:", error);
    throw error;
  }
};

// Actualizo una transacción
export const updateTransaction = async (transactionId, transaction) => {
  try {
    const response = await apiClient.put(
      `/transactions/${transactionId}`,
      transaction
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando transacciones:", error);
    throw error;
  }
};

//Exporto
export default {
  getCryptoPrice,
  getCryptoData,
  createTransaction,
  getTransactions,
  deleteTransactionById,
  updateTransaction,
};
