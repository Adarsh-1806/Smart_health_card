const express = require("express");
const path = require("path");
const bcrypt = require('bcryptjs');
const fs = require("fs");
const { dirname } = require("path");
const app = express();
const port = process.env.PORT || 80;
const jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

require("./mongodb/index");
const Patient = require("./mongodb/registers");     //include index.js file which connect with database
const health_report = require("./mongodb/health_model");     //include index.js file which connect with database
const doctor = require("./mongodb/doctor_detail");     //include index.js file which connect with database
const { json } = require("express");
//EXPRESS SPECIFIC STUFF

// for saving static files
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,"./public")))



//PUG SPECIFIC STUFF
app.set('view engine','pug')    //set the template engine as pug
app.set('views',path.join(__dirname,'views'))   //set the view directory



//ENDPOINTS
app.get('/',(req,res)=>{
    res.status(200).render('index.pug');
})
app.get('/patient',(req,res)=>{
    res.status(200).render('patient.pug');
})
app.get('/PatientRegister',(req,res)=>{
    res.status(200).render('PatientRegister.pug');
})
app.get('/doctor',(req,res)=>{
    res.status(200).render('doctor.pug');
})
app.get('/doctorSignInDone',ckecking,async(req,res)=>{
    var log_user = req.user;
    const print = await doctor.findOne({username: log_user.username});
    res.status(200).render('doctorSignInDone.pug',{record:print});
})
app.get('/PatientDetailsUpdate',(req,res)=>{
    res.status(200).render('PatientDetailsUpdate.pug');
})
app.get('/PatientDetailsUpdateEnter',(req,res)=>{
    res.status(200).render('PatientDetailsUpdateEnter.pug');
})
app.get('/PatientDisease',(req,res)=>{
    res.status(200).render('PatientDisease.pug');
})
// app.get('/PatientPersonalDetails',ckecking,async(req,res)=>{
//     var log_user = req.user;
//     // console.log(log_user)
//     const print = await Patient.findOne({username: log_user.username});
//     // now for Health Report


//     res.status(200).render('PatientPersonalDetails',{record:print});
// })
app.get('*',(req,res)=>{
    res.send('Error 404');
})
async function ckecking (req,res,next){
    var my_token = localStorage.getItem('my_token');
    try{
        var tmp = jwt.verify(my_token,'hello_howareu');
        req.user = tmp;
    }catch(error){
        console.log(error);
        res.status(400).send('Invalid Token varification');
    }
    next();
};



// POSt Requests
app.post('/patient',async(req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.pass;
        const useremail = await Patient.findOne({username});
        const isMatch= await bcrypt.compare(password,useremail.pass);
        
        if(isMatch){
            const hreport = await health_report.findOne({patient_id:"sdhtrithsfb"});
            // console.log(hreport.toObject().length());
            // hdata:JSON.parse(hreport)}
            res.status(200).render('PatientPersonalDetails',{record:useremail,hdata:hreport.toObject()});
        }else{
            res.send("Invalid Password");
        }

    }catch (error){
        console.log(error);
        res.status(400).send('Invalid Username/Email');
    }
})
app.post('/doctor',async(req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const useremail = await doctor.findOne({username:username});
        if(useremail.pass == password){
            var token = jwt.sign({username: username},"hello_howareu",{expiresIn: '10h'});
            localStorage.setItem('my_token',token);
            res.status(200).redirect('/doctorSignInDone');
        }else{
            res.send("Invalid Password");
        }
    }catch (error){
        console.log("Khabar j nathi padti su error 6");
        console.log(error);
        res.status(400).send('Invalid Username/Email');
    }
})

app.post('/PatientRegister',async(req,res)=>{
    try{
        const pass = req.body.pass;
        const confpass = req.body.confpass;
        if(pass === confpass)
        {
            const register_patient = new Patient({
                firstname: req.body.firstname,
                middlename: req.body.middlename,
                lastname: req.body.lastname,
                dob: req.body.dob,
                userage: req.body.userage,
                bloodgroup: req.body.bloodgroup,
                gender: req.body.gender,
                email: req.body.email,
                aadharcard: req.body.aadharcard,
                mobileno: req.body.mobileno,
                username: req.body.username, 
                pass: req.body.pass, 
                confpass: req.body.confpass, 
                emermobileno: req.body.emermobileno, 
                familydoctormobile:req.body.familydoctormobile, 
                address: req.body.address, 
            })
            console.log("Patient Data"+register_patient );
            // const token = await register_patient.generateAuthToken();
            const register_p = await register_patient.save();
            // console.log("the token for new registration::"+ token);
            console.log("Data Entered Successfully");
            res.status(200).render('index');
        }
        else{
            res.send("Password Not Match....");
        }
    }catch (error){
        console.log("Error in data entering process");
        console.log(error);
    }
})
app.post('/doctorgetpatient',async(req,res)=>{
    const username = req.body.username;
    const useremail = await Patient.findOne({username});
    const hreport = await health_report.findOne({patient_id:useremail._id});
    var data = null;
    var len = null;
    if(hreport != null) {
        data = hreport.toObject();
        len = Object.keys(data.meta).length; 
    }else{ len = 0;}
    res.status(200).render('doctorgetpatient',{record:useremail,hdata:data,len:len});
})

app.post('/adddata',async(req,res)=>{
    console.log("Data Entering");
    try{
        const username = req.body.username;
        const useremail = await Patient.findOne({username});
        var objFriends = { dt: req.body.dt,
                disease: req.body.disease,
                medicine: req.body.medicine,
                doctor: req.body.doctor,};
        health_report.findOneAndUpdate(
            { patient_id: useremail._id }, 
            { $push: { meta: objFriends  } },
            { upsert : true },
           function (error, success) {
                 if (error) {
                     console.log(error);
                 } else {
                     console.log(success);
                 }
             }
        );
        console.log("Data Entered Successfully");
        res.status(200).render('doctor');
    }catch(error){
        console.log(error);
    }
})
//jsonWebtoken 

    
//START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
})