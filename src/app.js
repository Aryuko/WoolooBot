/** 
 * Codename:    Project Wooloo
 * Project:     WoolooBot
 * Repository:  https://github.com/Aryuko/WoolooBot
 * Author:      Aryuko
 * Version:     0.0.1
*/

const tmi = require('tmi.js')
const config = require('../config.js')

const client = new tmi.client(config)
client.connect()

var recentPokemonCommand = false
client.on('chat', (channel, userstate, message, self) => {
    let msg = message.toLowerCase()
    if(self) return;

    if(msg.includes('when') && (msg.includes('pokemon') || msg.includes('pokémon'))){
        let now = new Date().getTime()

        if(!recentPokemonCommand || (now - recentPokemonCommand) > config.cooldown) {
            // November 15, 2019
            let releaseDate = new Date('2019-11-15T03:00:00').getTime()
            let str = timeToString(releaseDate - now)
            client.say(channel, 'Pokémon Sword and Shield is released in ' + str)
            recentPokemonCommand = now
        }
    }
})

/* utils */
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