import { getCryptoPrice } from "@/services/apiService";

export async function calculatePrice(
  crypto_code,
  action,
  crypto_amount,
  exchange
) {
  if (crypto_code && crypto_amount && action) {
    try {
      const cryptoValue = await getCryptoPrice(crypto_code, action, exchange);
      const calculatedMoney = crypto_amount * cryptoValue;
      // error de consola el valor calculado es un número válido
      if (!isNaN(calculatedMoney)) {
        return calculatedMoney.toFixed(2);
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error al calcular el precio:", error);
      return "";
    }
  } else {
    return "";
  }
}
