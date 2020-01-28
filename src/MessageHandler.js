const wh = require('webhook-discord')
const fetch = require('node-fetch')

module.exports = 
class MessageHandler {
    constructor (client, config) {
        this.client = client
        this.config = config

        this.discordHook = new wh.Webhook(config.webhookUrl)

        this.commandCooldowns = {}
        this.commandState = {
            summon: {
                present: [],
                lastSuccess: false
            }
        }
    }

    handleMessage (message, channel, userstate) {
        let input = this.parseInput(message)
        
        if(input && input.command) {
            console.log(input)
            switch (input.command) {
                case 'releasedate':
                case 'release':
                case 'rd':
                    this.releasedateCommand(input.args ? input.args[0] : '', channel)
                    break;
            
                case 'summon':
                    this.summonCommand(input.args ? input.args[0].toLowerCase() : '', channel, userstate.username)
                    break;

                case 'mimi':
                    this.client.say(channel, `Mimi is the cutest patoot ever and she deserves the comfiest wooloo hugs aryu5Love mimiscLove`)
                    break;

                default:
                    break;
            }
        } else { /* Add alternative command invocations? like the msg.includes of old */ }
    }

    parseInput(message) {
        let regex = new RegExp('\\' + this.config.commandPrefix + '(\\w+)(.*)', 'g')    // Capture one single word following the specified prefix
        let result = regex.exec(message)
        if (result) {
            let args = result[2].trim().match(/(?:[^\s"']+|["'][^"']*["'])+/g);         // Split words by spaces, except when enclosed in quotes: https://stackoverflow.com/a/16261693/5621850
            for (let index in args) { args[index].replace(/["']/g, '') }                // Remove quotes
            return {
                'command': result[1].toLowerCase(),
                'args': args
            }
        } else { return false }
    }

    /* commands */

    releasedateCommand(game, channel) {
        let now = new Date().getTime()
        if (!this.commandCooldowns.releasedate || (now - this.commandCooldowns.releasedate) > this.config.cooldown) {
            let releaseDate = false
            let gameString = false
            switch (game) {
                case 'cyberpunk':
                    // April 16, 2020
                    releaseDate = new Date('2020-04-16T03:00:00').getTime()
                    gameString = 'Cyberpunk 2077 is released in '
                    break;
                    
                    case 'ac':
                    case 'animal crossing':
                    // March 20, 2020
                    releaseDate = new Date('2020-03-20T03:00:00').getTime()
                    gameString = 'Animal Crossing: New Horizons is released in '
                    break;
                default:
                    this.client.say(channel, `Invalid game D: List of valid games: 'ac', 'cyberpunk'`)
                    return;
            }
            let timeString = this.timeToString(releaseDate - now, true)
            this.client.say(channel, gameString + timeString)
            this.commandCooldowns.releasedate = now
        }
    }

    summonCommand(user, channel, invoker) {
        let now = new Date().getTime()
        if(!this.commandCooldowns.summon || (now - this.commandCooldowns.summon) > this.config.cooldown) {
            switch (user) {
                case 'aryu':
                case '':
                    if (!('aryu' in this.commandState.summon.present)) {
                        this.fetchChatters(channel).then((res) => {
                            if(this.deepishContains(res.chatters, 'aryu')) {
                                // Aryu is in chat
                                this.client.say(channel, `Aryu is already in chat! Try using a ping: @Aryu aryu5Aww`)
                            } else {
                                // Aryu is not in chat
                                if(!this.commandCooldowns.successfulSummon || (now - this.commandCooldowns.successfulSummon) > this.config.summonCooldown) {
                                    this.client.say(channel, 'Attempting to summon Aryu 👀')
                                    this.summonAryu(channel, invoker)
                                    this.commandCooldowns.successfulSummon = now
                                } else {
                                    let timeString = this.timeToString(this.config.summonCooldown + this.commandCooldowns.successfulSummon - now)
                                    this.client.say(channel, `Hey, I think you should wait another ${timeString} before trying to summon again >:o I don't want to spam her!`)
                                }
                            }
                        })
                    }
                    break;

                default:
                    this.client.say(channel, 'I only have permission to summon Aryu :(')
                    break;
            }
            this.commandCooldowns.summon = now
        }
    }

    /* utils */

    deepishContains(object, key) {
        for (let k in object) {
            if(object[k].includes(key)) { return true }
        }
        return false
    }

    timeToString (millisec, withText = false) {
        var seconds = Math.floor(millisec / 1000)
        var minutes = Math.floor(millisec / (1000 * 60))
        var hours   = Math.floor(millisec / (1000 * 60 * 60))
        var days    = Math.floor(millisec / (1000 * 60 * 60 * 24))
        
        let str

        if      (seconds < 60)  { str = seconds + " seconds" }
        else if (minutes < 60)  { str = minutes + " minutes" }
        else if (hours < 24)    { str = hours + " hours" }
        else                    { str = days + " days and " + hours % 24 + " hours" }
        
        if(withText) {
            if      (days < 1)      { str += ", THAT'S SOOOON!! FeelsAmazingMan aryu5Aww FeelsAmazingMan aryu5Aww" }
            else if (days < 7)      { str += ", NOT LONG NOW! FeelsAmazingMan aryu5Aww" }
            else if (days < 14)     { str += ", less than two weeks!! PogChamp" }
            else if (days < 30)     { str += ", less than a month, not bad!" }
            else if (days < 60)     { str += ", still quite a long time FeelsBadMan" }
            else if (days < 75)     { str += ", that's over two months FeelsBadMan FeelsBadMan" }
            else if (days >= 75)    { str += ", that's a long time FeelsBadMan FeelsBadMan" }
        }

        return str
    }

    summonAryu(channel, username) {
        let msg = new wh.MessageBuilder()
            .setName("WoolooBot")
            .setColor("#6441A4")
            .setText("<@!106109569486315520>")
            .addField("Aryu, you are being summoned!", `${username} wants you you to join https://www.twitch.tv/${channel.replace(/#/, '')}`)
            .setTime()

            this.discordHook.send(msg)
    }

    /* twitch api */
    fetchChatters(channel) {
        return fetch(`http://tmi.twitch.tv/group/user/${channel.replace(/#/, '')}/chatters`)
        .then((response) => { 
            return response.json()
        })
    }
}