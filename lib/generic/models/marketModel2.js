const mongoose = require('mongoose')
const constants = require('../../constants')
const appUtil = require('../../appUtils')



const Schema = new mongoose.Schema({
    Id:{type: Number, required: true},
    MarketData:[
        {
            name: {type:String},
            symbol: {type:String},
            circulating_supply: {type:Number},
            total_supply: {type:Number},
            quote: {
              USD: {
                price: {type:Number},
                volume_24h: {type:Number},
                volume_change_24h: {type:Number},
                percent_change_1h: {type:Number},
                percent_change_24h: {type:Number},
                percent_change_7d: {type:Number},
                percent_change_30d: {type:Number},
                percent_change_60d: {type:Number},
                percent_change_90d: {type:Number},
                market_cap: {type:Number},
                last_updated: {type:String}
              }
   }
}]
   
}, {
    versionKey: false,
    timeStamp: true,
    strict: true
})

module.exports = mongoose.model(constants.DB_MODEL_REF.MARKETDATA2, Schema);
