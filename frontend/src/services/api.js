import axios from 'axios';

const API_BASE_URL = '/api';

export const stockAPI = {
  fetchStockData: async (symbol, period = '1mo') => {
    const response = await axios.post(`${API_BASE_URL}/stocks/fetch`, {
      symbol,
      period
    });
    return response.data;
  },

  getStocks: async () => {
    const response = await axios.get(`${API_BASE_URL}/stocks`);
    return response.data;
  },

  getStockPrices: async (symbol, limit = 30) => {
    const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}/prices?limit=${limit}`);
    return response.data;
  },

  predictStock: async (symbol, periods = 7) => {
    const response = await axios.get(`${API_BASE_URL}/stocks/${symbol}/predict?periods=${periods}`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
};
