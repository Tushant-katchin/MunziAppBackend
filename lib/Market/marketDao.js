const mongoose = require('mongoose')
let BaseDao = require('../dao/BaseDao')
const constants = require('../constants')

const Market = require('../generic/models/marketModel')
const Market2 = require('../generic/models/marketModel2')
const marketDao = new BaseDao(Market);
const market2Dao = new BaseDao(Market2)
function saveMarketData(marketData){
    let query={
        Id:1
    }
   const data = marketDao.find(query)
  // console.log(data)
   if(data){
   // console.log(marketData.resp)
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
    //console.log(marketData)

    let Details = {
        Id:1,
        MarketData:marketData.resp
    }
    //let marketObj= new Market(Details)
    return marketDao.save(Details)
   }
  
}

async function saveMarketData2(marketData){
    let query={
        Id:1
    }
   const data = await market2Dao.find(query)
   //console.log(data)
   if(data.length!==0){
    //console.log(marketData)
    let updateDetails = {
        Id:1,
        MarketData:marketData
    }
    let options = {
        new: true
    }
   return market2Dao.findOneAndUpdate(query, updateDetails, options)
   }
   else{
    //console.log(marketData)

    let Details = {
        Id:1,
        MarketData:marketData
    }
    //let marketObj= new Market(Details)
    return market2Dao.save(Details)
   }
  
}

async function getData(){
    let query = {
        Id:1
    }
    const data = await marketDao.findOne(query)
    //console.log(data)
    return data
  }

module.exports ={

    saveMarketData,

    getData,

    saveMarketData2

}