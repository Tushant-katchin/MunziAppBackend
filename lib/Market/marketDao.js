const mongoose = require('mongoose')
let BaseDao = require('../dao/BaseDao')
const constants = require('../constants')

const Market = require('../generic/models/marketModel')

const marketDao = new BaseDao(Market);

function saveMarketData(marketData){
    let query={
        Id:1
    }
   const data = marketDao.find(query)
   console.log(data)
   if(data){
    console.log(marketData.resp)
    let updateDetails = {
        Id:1,
        MarketData:marketData.resp
    }
    let options = {
        new: true
    }
   return marketDao.findOneAndUpdate(query, updateDetails, options)
   }
   else{
    console.log(marketData)

    let Details = {
        Id:1,
        MarketData:marketData.resp
    }
    //let marketObj= new Market(Details)
    return marketDao.save(Details)
   }
  
}

async function getData(){
    let query = {
        Id:1
    }
    const data = await marketDao.findOne(query)
    console.log(data)
    return data
  }

module.exports ={

    saveMarketData,

    getData

}