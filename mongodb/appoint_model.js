const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var DateOnly = require('mongoose-dateonly')(mongoose);
//creating a database schema
const appoint = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    date: {
        type: DateOnly,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    doctor: {
        type: String,
    },  
})
module.exports = mongoose.model('appoint',appoint );

