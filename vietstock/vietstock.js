var request = require("request");
var dateFormat = require('dateformat');
const axios = require('axios')
const apiCall = require('../ultils/apiConcurrentlyCall')

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

var today = dateFormat(new Date(), "yyyy-mm-dd");

var dayMinus15 = new Date(); 
dayMinus15.setDate(dayMinus15.getDate() - 15);
dayMinus15 = dateFormat(dayMinus15, "yyyy-mm-dd");

function getStockData(stockID) {
    return apiCall.get(`https://finance.vietstock.vn/data/KQGDThongKeGiaStockPaging?page=1&pageSize=20&catID=1&stockID=${stockID}&fromDate=${dayMinus15}&toDate=${today}`, {
        headers: headers,
        responseType: 'json',
    })
}

function getData(body){
    try{
        open = []
        close = []
        high = []
        low = []
        body.forEach(element => {
            stockCode = element['StockCode']
            open.push(element['OpenPrice'])
            close.push(element['ClosePrice'])
            high.push(element['HighestPrice'])
            low.push(element['LowestPrice'])
        });
        
        var data = {
            'stockCode': stockCode,
            'price': body[0].ClosePrice,
            'change': body[0].Change,
            'perChange': body[0].PerChange,
        }
        for (let index = 1; index < 31; index++) {
            data[`dayInput${index}`] = {
                'open':open.slice(0,index).reverse(),
                'high':high.slice(0,index).reverse(),
                'close':close.slice(0,index).reverse(),
                'low':low.slice(0,index).reverse(),
             }
        }
        return data
    }catch(err){
        console.log(body)
    }
}

exports.getData = getData;
exports.getStockData = getStockData;

