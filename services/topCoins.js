const axios = require("axios");
let topcoins = [];

const fetchTopCoins = async () => {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/coins?limit=6`,
      {
        headers: { Authorization: `Bearer ${process.env.API_KEY}` },
      }
    );

    console.log("Topcoins api hitting at "+new Date());

    topcoins = response.data;
    return topcoins;
    
  } catch (error) {
    console.error("Error in top coins fetching data:", error);
  }
};

// Initial fetch of top coins
fetchTopCoins();

// Set interval to fetch top coins every 30 seconds
setInterval(fetchTopCoins, 24 * 60 * 60 * 1000);
// Export a function to get the current topcoins
module.exports = () => {
    return new Promise((resolve) => {
      // Resolve with the current topcoins data
      resolve(topcoins);
    });
  };
