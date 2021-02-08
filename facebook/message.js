const PAGE_ACCESS_TOKEN = 'EAANjW5tGXRgBAISyPQXwqRe7ZAhS4ajCsbOtXZAHucYkTRLZCuZB8YHm0xxS0Ra5ZBlnbwOf3gciy6c06ZAMVWRjhQyabhUEEsh6CjjVBveGpRnqBgdqejhix78I1nzlHgYtF9sQe4EZCJdZBgglrmfEaEgBW8xpHnZC7oszKH5Pio29MFPvT8Gk2';
var request = require("request");

function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('body is: ', body)
            return body;
        } else {
            sendMessage(senderId, "Sending with error" + body)
            console.log(body)
        }
    });
}

function sendInternalMessage(message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
        },
        method: 'POST',
        json: {
            recipient: {
                id: 3206875339325393
            },
            message: {
                text: message
            },
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('body is: ', body)
            return body;
        } else {
            sendInternalMessage(3206875339325393, "Sending with error: \n" + JSON.stringify(body))
            console.log(body)
        }
    });
}

exports.sendInternalMessage = sendInternalMessage;
exports.sendMessage = sendMessage;