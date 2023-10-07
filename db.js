const mongoose  = require('mongoose');
require('dotenv').config()

const DB = process.env.DATABASE

const mongoURI = DB;

const connnectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongo successfully")
        console.log(DB)
    })
}

module.exports = connnectToMongo;       
