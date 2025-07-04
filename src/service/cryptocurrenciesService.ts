import { api } from '../boot/axios'
import type BitcoinData from '../types/Coinbase'
import type { CryptoData } from '../types/CoinBaseId'


class CryptocurrenciesService {


  async GetCryptocurrencies(): Promise<BitcoinData[]> {
    
    try {
      const response = await api.get('https://api.coinbase.com/v2/assets/search', {
       withCredentials: false 
      })
      return response.data.data
    } catch (error: any) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            detail?: string;
            message?: string;
          };
        };
      }
      if (axiosError.response?.status === 422) {
        throw new Error(axiosError.response.data?.detail || 'Erro de validação')
      }

      throw new Error(axiosError.response?.data?.message || 'Erro de validação')
    }
  }

async GetCryptocurrenciesByid(symbol: string): Promise<CryptoData> {  // Note que agora retorna CryptoData em vez de CryptoData[]
  try {
    const response = await api.get(`https://api.coinbase.com/v2/assets/search?query=${symbol}`, {
      withCredentials: false 
    });
    
    // Verifica se há dados e pega o primeiro item
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];  // Retorna apenas o primeiro resultado
    } else {
      throw new Error('Nenhuma criptomoeda encontrada com esse símbolo');
    }
  } catch (error: any) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          detail?: string;
          message?: string;
        };
      };
    }
    
    if (axiosError.response?.status === 422) {
      throw new Error(axiosError.response.data?.detail || 'Erro de validação');
    }

    throw new Error(axiosError.response?.data?.message || 'Erro ao buscar criptomoeda');
  }
}
}

export default new CryptocurrenciesService()
