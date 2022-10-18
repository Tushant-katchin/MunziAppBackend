const { Kraken } = require('node-crypto-api');
const { Cexio } = require('node-crypto-api');
const { CoinMarketCap } = require('node-crypto-api');
const axios = require('axios');


 async function getCryptoData(){
    const kraken = new Kraken();
    const cexio = new Cexio();
    const coinMarketCap = new CoinMarketCap();
    let Data =[]
    let marketData ={

    }
    let response
    //3d8fb06b-f282-431a-91e9-89c932b60d26
    try {
       response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
          headers: {
            'X-CMC_PRO_API_KEY': '3d8fb06b-f282-431a-91e9-89c932b60d26',
          },
        });
      } catch(ex) {
        response = null;
        // error
        console.log(ex);
      }
      if (response) {
        // success
        
        const json = response.data.data;
        json.slice(0,5).map((e)=>{
            console.log(e)
            
        })
      }    
     
  

}
module.exports={

    getCryptoData
}