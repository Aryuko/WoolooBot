/** 
 * Codename:    Project Wooloo
 * Project:     WoolooBot
 * Repository:  https://github.com/Aryuko/WoolooBot
 * Author:      Aryuko
 * Version:     0.0.1
*/

const tmi = require('tmi.js')
const config = require('../config.js')
const MessageHandler = require('./MessageHandler.js')

const client = new tmi.client(config)
client.connect()
let messageHandler = new MessageHandler(client, config)

client.on('chat', (channel, userstate, message, self) => {
    if (!self && message.length > 1) {
        messageHandler.handleMessage(message, channel, userstate)
    }
})
