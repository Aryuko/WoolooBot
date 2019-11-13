const sqlite3 = require('sqlite3').verbose()

module.exports =
class Database {
    constructor() {
        this.db = new sqlite3.Database('db.db')

        this.setupTables()
    }

    setupTables() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE IF NOT EXISTS channels (channel TEXT PRIMARY KEY)')
            this.db.run('CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY, role INT)')
        })
    }

    insertValue(table, value) {
        this.db.serialize(() => {
            this.db.run(`INSERT INTO ${table} VALUES(?)`, [value], function (err) {
                if(err) { console.log(err.message) }
                else if (this.lastID) {
                    console.log(`${value} inserted into ${table}`)
                    // callback({})
                }
            })
        })
    }

    insertValues(table, arr) {
        let qArr = []
        for (let i in arr) {
            qArr.push('?')
        }
        let qString = qArr.join(', ')

        this.db.serialize(() => {
            this.db.run(`INSERT INTO ${table} VALUES(${qString})`, arr, function (err) {
                if(err) { console.log(err.message) }
                else if (this.lastID) {
                    console.log(`values inserted into ${table}`)
                    // callback({})
                }
            })
        })
    }

    getSingularsArray(table, callback) {
        this.db.serialize(() => {
            this.db.all(`SELECT * FROM ${table}`, function(err, rows) {
                let arr = rows.map((row) => row[Object.keys(row)])
                callback(arr)
            })
        })
    }

    getUser(user, callback) {
        this.db.serialize(() => {
            this.db.get(`SELECT * FROM users WHERE name = '${user}'`, function(err, row) {
                callback(row)
            })
        })
    }
}