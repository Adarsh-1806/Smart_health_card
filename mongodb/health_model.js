const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//creating a database schema
const report = new mongoose.Schema({
    patient_id : {
        type: String,
        required: true,
    },
    meta  : {
        dt : {
            typr:Date,
        },
        disease  :{
            type: String,
        },
        medicine :{
            type: String,
        },
        doctor :{
            type : String,
        },
    }
})
module.exports = mongoose.model('health_report',report );

