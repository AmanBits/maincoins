const axios = require('axios');
const coins =[];



const fetchAllCoins = async (req,res)=>{
    try {

        const response = await axios('')


        coins = response.data;


        return coins;
        
    } catch (error) {
        console.log("Error in all coins fetch in service"+error);
    }
}




fetchAllCoins();


setInterval(fetchAllCoins,1000);




module.exports = () =>{
    return new Promise((resolve)=>{
        resolve(coins);
    })
}