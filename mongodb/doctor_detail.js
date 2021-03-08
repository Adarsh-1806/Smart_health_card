const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//creating a database schema
const doctor_info = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    license_no: {
        type: Number,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobileno: {
        type: Number,
        required: true,
        unique: true
    },
    emermobileno: {
        type: Number,
        required: true,
        unique: true
    },
    bloodgroup: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    pass: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('doctor',doctor_info );