// services/thirdPartyApiService.js
const axios = require('axios');

const fetch = require('node-fetch');


class ThirdPartyApiService {



  // Function to fetch API data
static async  fetchData() {
    try {
        const response = await axios.get('https://api.example.com/data');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate error to caller
    }
}



  static async fetchDataFromApi(req,res) {
    try {
      const options = {
        headers: {
          "Content-Type": "application/json",
          'x-access-token': 'coinranking159b8a3f419c9af1da37f3902d94bb17b1b7d82fc7054735',
        },
      };

      fetch("https://api.coinranking.com/v2/coins", options)
        .then((response) => response.json())
        .then((result) => res.json(result));
    } catch (error) {
      console.error('Error fetching data from third-party API:', error);
      throw error;
    }
  }
}

module.exports = ThirdPartyApiService;
