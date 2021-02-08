
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
app = express().use(bodyParser.json());

var server = http.createServer(app);
var request = require("request");
const axios = require('axios')

var candelstickAnalysis = require("./candlestick-analysis/candlesAnalysis")
var telegram = require("./telegram/telegram");
var vietstock = require("./vietstock/vietstock")
var facebook = require("./facebook/message")

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");
app.use(express.static('./output'));

let stockList = require('./stock-code.json');


app.get('/stock', function (req, res) {
    console.log('stock code: ', req.query.stockCode);
    // console.log(jsonParser(req.query.stockCode))

    vietstock.getStockData(jsonParser(req.query.stockCode)).then((data) => {
        pattern = candelstickAnalysis.scanCandlestick(data)
        if(pattern.length > 0 ) telegram.sendMessage(data.stockCode, pattern);
        res.send({code: req.query.stockCode, pattern: pattern, url: 'https://stock-analysis-3k.herokuapp.com/' + req.query.stockCode + '.png'});
    });
});

function jsonParser(StockCode) {
    var array = stockList.data;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.StockCode == StockCode) return element.StockID;
    }
 }

server.listen(app.get('port'), app.get('ip'), function () {
    const getStockDataPromises = []

    for (let index = 0; index < stockList.data.length; index++) {
        var element = stockList.data[index]
        console.log('Working on ' + element.StockCode)
        getStockDataPromises.push(vietstock.getStockData(element.StockID))
    }

    Promise.all(getStockDataPromises).then(data => {
        data.forEach(item => {
            const exportedData = vietstock.getData(item.data[1])
            const pattern = candelstickAnalysis.scanCandlestick(exportedData)
            if(pattern.length > 0 ) telegram.sendMessage(exportedData.stockCode, pattern);
        })
    }).catch(err => console.log('Error: ', err))
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});