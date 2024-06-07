import axios from 'axios';

//3°
//const base_URL = 'https://criptoya.com/api/buenbit/';
const URL_base = 'https://laboratorio-36cf.restdb.io/rest/';
//const apiKey = '64a5ccf686d8c5d256ed8fce';

const apiClient = axios.create({
    baseURL: URL_base,
    headers: {
      'Content-Type': 'application/json', 
      'x-apikey': '64a5ccf686d8c5d256ed8fce'
    }
  });
  
  //Obteniendo datos de la API
  export const getCryptoData = async () => {
    try {
      const response = await apiClient.get(''); //Ver
      return response.data;
    } catch (error) {
      console.error('Error trying to recover:', error);
      throw error;  
    }
  };
  
  export default {
    getCryptoData
  };