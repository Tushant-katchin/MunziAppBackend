'use strict';

console.log('');
console.log('//Munzi Backend//');
console.log('');
require('dotenv').config();
var res = require('dotenv').config();
const appUtils = require('./lib/appUtils')
const market = require('./lib/Market/marketDao')
const MarketUtilities = require('./lib/Market/marketUtilities')
//Import Config
const config = require('./lib/config');
// const socket = require("socket.io");

 config.dbConfig((err) => {
  if (err) {
    // logger.error(err, 'exiting the app.');

    console.log({ err });
    return;
  }

  // load external modules
  const express = require('express');

  // init express app
  const app = express();

  // config express
  config.expressConfig(app);
  if (err) return res.json(err);

  // attach the routes to the app
  require('./lib/routes')(app);

setInterval(async () => {
 
   const marketdata = await appUtils.getCryptoData()
   let data
  if(marketdata){
      //console.log(marketdata)
      try{

        data = await market.saveMarketData(marketdata)
      }
      catch(e){
        console.log(e)
      }
      
  }
  else{

     data = await MarketUtilities.getCryptoData()
 let result 
// console.log(data)
 if(data){
  try{

    result = await market.saveMarketData2(data)
    //console.log(result)
  }catch(e){
    console.log(e)
  }
  
 }else{
  console.log('error fetching data')
}

  }
  //console.log(data)
}, 10000);

const port=2000
  // start server
  const server = app.listen(port, () => {
    console.log(`Express server listening on ${port}`);
    // logger.info(`Express server listening on ${config.cfg.port}, in ${config.cfg.TAG} mode`);
  });

 
});
