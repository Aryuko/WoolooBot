/** 
 * Codename:    Project Wooloo
 * Project:     WoolooBot
 * Repository:  https://github.com/Aryuko/WoolooBot
 * Author:      Aryuko
 * Version:     0.0.1
*/

const tmi = require('tmi.js')
const config = require('../config.js')
const fetch = require('node-fetch')
const wh = require('webhook-discord')

const discordHook = new wh.Webhook(config.webhookUrl)

const client = new tmi.client(config)
client.connect()

var recentPokemonCommand = false
var recentACCommand = false
var recentSummon = false

client.on('chat', (channel, userstate, message, self) => {
    if (self) { return }
    let msg = message.toLowerCase()

    if (msg.includes('when') && (msg.includes('pokemon') || msg.includes('pokémon'))){
        let now = new Date().getTime()

        if (!recentPokemonCommand || (now - recentPokemonCommand) > config.cooldown) {
            // November 15, 2019
            let releaseDate = new Date('2019-11-15T03:00:00').getTime()
            let str = timeToString(releaseDate - now)
            client.say(channel, 'Pokémon Sword and Shield is released in ' + str)
            recentPokemonCommand = now
        }
    } else if (msg.includes('when') && (msg.includes('animal crossing') || msg.includes('new horizons'))){
        let now = new Date().getTime()

        if (!recentACCommand || (now - recentACCommand) > config.cooldown) {
            // March 20, 2020
            let releaseDate = new Date('2020-03-20T03:00:00').getTime()
            let str = timeToString(releaseDate - now)
            client.say(channel, 'Animal Crossing: New Horizons is released in ' + str)
            recentACCommand = now
        }
    } else if (msg.includes('summon aryu') || msg.includes('aryu summon')) {
        let now = new Date().getTime()
        if(!recentSummon || (now - recentSummon) > config.cooldown) {
            if (typeof aryuPresent == 'undefined') {
                fetchChatters(channel).then((res) => {
                    if(deepishContains(res.chatters, 'aryu')) {
                        // Aryu is in chat
                        client.say(channel, `She's already in chat!`)
                    } else {
                        // Aryu is not in chat
                        client.say(channel, 'Attempting to summon Aryu 👀')

                        summonAryu(channel, userstate.username)
                    }
                })
            }
        }
    }
})

function summonAryu(channel, username) {
    let msg = new wh.MessageBuilder()
        .setName("WoolooBot")
        .setColor("#6441A4")
        .setText("<@!106109569486315520>")
        .addField("Aryu, you are being summoned!", `${username} wants you you to join https://www.twitch.tv/${channel.replace(/#/, '')}`)
        .setTime()

        discordHook.send(msg)
}

/* twitch api */
function fetchChatters(channel) {
    return fetch(`http://tmi.twitch.tv/group/user/${channel.replace(/#/, '')}/chatters`)
    .then((response) => { 
        return response.json()
     })
}

/* utils */

function deepishContains(object, key) {
    for (k in object) {
        if(object[k].includes(key)) { return true }
    }
    return false
}

function timeToString (millisec) {
	var seconds = Math.floor(millisec / 1000)
	var minutes = Math.floor(millisec / (1000 * 60))
	var hours   = Math.floor(millisec / (1000 * 60 * 60))
    var days    = Math.floor(millisec / (1000 * 60 * 60 * 24))
    
    let str

	if      (seconds < 60)  { str = seconds + " seconds" }
	else if (minutes < 60)  { str = minutes + " minutes" }
	else if (hours < 24)    { str = hours + " hours" }
    else                    { str = days + " days and " + hours % 24 + " hours" }
    
    if      (days < 1)      { str += ", THAT'S SOOOON!! FeelsAmazingMan FeelsAmazingMan FeelsAmazingMan" }
    else if (days < 7)      { str += ", NOT LONG NOW! FeelsAmazingMan" }
    else if (days < 14)     { str += ", less than two weeks!! PogChamp" }
    else if (days < 30)     { str += ", less than a month, not bad!" }
    else if (days < 60)     { str += ", still quite a long time FeelsBadMan" }
    else if (days > 60)     { str += ", that's over two months FeelsBadMan FeelsBadMan" }

    return str
}