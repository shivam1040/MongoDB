const mongo = require("mongodb")
const client = mongo.MongoClient
const url = "mongodb://127.0.0.1:27017/shop"
let _db;
const initDb = cb => {
    if(_db){
        console.log("init already")
        return cb(null, _db)
    }
    client.connect("mongodb://127.0.0.1:27017/shop").then(c => {
        _db = c
        cb(null, _db)
    }).catch(e=>{
        cb(e)
    })
}

const getDb = () => {
    if(!_db)
        throw Error("uninit")
    return _db
}

module.exports = {
    initDb,
    getDb
}