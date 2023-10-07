const mongoose = require('mongoose');  //import mongoose
const { Schema } = mongoose;

//Create a user Schema 
const UserSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique:true
    },
    password:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', UserSchema);   //save Schema as a model
module.exports = User;