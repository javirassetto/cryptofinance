import axios from "axios";

//3°
//const base_URL = 'https://criptoya.com/api/buenbit/';
//const api = "https://criptoya.com/api/btc/ars/0.5"
const URL_base = "https://laboratorio-36cf.restdb.io/rest/";
//const apiKey = '64a5ccf686d8c5d256ed8fce';

const apiClient = axios.create({
  baseURL: URL_base,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-apikey": "64a5ccf686d8c5d256ed8fce",
  },
});

//Obteniendo datos de la API
export const getCryptoData = async () => {
  try {
    const response = await apiClient.get(
      /*"https://criptoya.com/api/buenbit/"*/
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    return response.data;
  } catch (error) {
    console.error("Error trying to recover:", error);
    throw error;
  }
};

export default {
  getCryptoData,
};
