const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//creating a database schema
const patient_info = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        // required: true
    },
    lastname: {
        type: String,
        // required: true
    },
    dob: {
        type: String,
        // required: true
    },
    userage: {
        type: Number,
        // required: true
    },
    bloodgroup: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    aadharcard: {
        type: String,
        // required: true,
        unique:true
    },
    mobileno: {
        type: Number,
        required: true,
        unique: true
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
    confpass: {
        type: String,
        required: true,
    },
    emermobileno: {
        type: Number,
        // required: true,
        unique: true
    },
    familydoctormobile: {
        type: Number,
        // required: true,
        unique: true
    },
    address: {
        type: String,
        // required: true,
    },
    profile: {
        type: String,
        // required: true,
    },
    // tokens:[{
    //     token:{
    //         type: String,
    //         required: true,
    //     }
    // }]
})

//JSON web token
patient_info.methods.generateAuthToken = async function(register_patient){
    try{
        var token = jwt.sign({username: register_patient.username},"itisforpatientregistration",{expiresIn: '1h'});
        localStorage.setItem('rtoken',token);
        // next();  
    }catch(error){
        // res.send("This is Error is in Authantication "+error);
        console.log("This is Error is in Authantication "+error);
    }
}
//Hashing Password
patient_info.pre('save',async function(next){
    if(this.isModified("pass")){
        this.pass = await bcrypt.hash(this.pass,4);
        this.confpass = undefined;
    }
    next();
})

module.exports = mongoose.model('Patient',patient_info );