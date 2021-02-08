var telegram = require('telegram-bot-api');
const HOST = 'https://stock-analysis-3k.herokuapp.com/'
const TOKEN = '1545978004:AAHpuhtFWib_TvR5hUZ-wz2vvOIA2v4n3Gw'
var CHAT_ID = -408895188
const fs = require('fs')

function sendMessage(data, pattern) {
    try {
        var captionText = `${data.stockCode} ${data.price}(${data.change} ${data.perChange}%) ${pattern}`;
        var api = new telegram({
            token: TOKEN,
            updates: {
                enabled: true,
                get_interval: 1000
            }
        });

        api.sendPhoto({
            chat_id: CHAT_ID,
            caption: captionText,
            photo: HOST + stockCode + '.png'
        })
            .then(function (data) {
                console.log('data: ', data);
            })
    } catch (err) {
        console.log(err);
    }
}

exports.sendMessage = sendMessage