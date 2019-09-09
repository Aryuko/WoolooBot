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

client.on('chat', (channel, userstate, message, self) => {
    if(self) return;

    if(message.toLowerCase().includes("!pokemon")){
        // November 15, 2019
        let str = timeToString(new Date('2019-11-15T03:00:00').getTime() - new Date().getTime())
        client.say(channel, 'Pokémon Sword and Shield is released in ' + str)
    }
})

function timeToString (millisec) {
	var seconds = Math.floor(millisec / 1000);
	var minutes = Math.floor(millisec / (1000 * 60));
	var hours   = Math.floor(millisec / (1000 * 60 * 60));
	var days    = Math.floor(millisec / (1000 * 60 * 60 * 24));

	if      (seconds < 60)  { return seconds + " seconds"; }
	else if (minutes < 60)  { return minutes + " minutes"; }
	else if (hours < 24)    { return hours + " hours"; }
	else                    { return days + " days and " + hours % 24 + " hours" }
}