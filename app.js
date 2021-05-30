const express = require("express");
const path = require("path");
const bcrypt = require('bcryptjs');
const fs = require("fs");
const { dirname } = require("path");
const app = express();
const port = process.env.PORT || 80;
const jwt = require('jsonwebtoken');
const multer = require('multer');

if (typeof localStorage === "undefined" || localStorage === null) {
var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

require("./mongodb/index");
const Patient = require("./mongodb/registers");     //include index.js file which connect with database
const health_report = require("./mongodb/health_model");     
const doctor = require("./mongodb/doctor_detail");     
const appoint = require("./mongodb/appoint_model");     
const { json } = require("express");
const helpers = require('./helpers');
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
app.get('/dappoint',ckecking,async(req,res)=>{
    var log_user = req.user;
    const log_doctor = await doctor.findOne({username: log_user.username});
    const appoints = await appoint.find({doctor:log_doctor._id});
    try{
        var len = null;
        if(appoints != null) {
        len = Object.keys(appoints).length; 
        }else{ len = 0;}
        res.status(200).render('dappoints.pug',{record:appoints,log_doctor:log_doctor,len:len});
    }catch(error){
        console.log(error);
    }
})
app.get('/patient/myappoint',ckecking1,async(req,res)=>{
    const appoints = await appoint.find({account:req.user.uid});
    const log_user = await Patient.findOne({_id:req.user.uid});
    console.log(appoints);
    const doctors = [];
    for (const appoint of appoints) {  
        const appoint_doctor = await doctor.findOne({_id: appoint.doctor});
        doctors.push(appoint_doctor);
      }
    try{
        var len = null;
        if(appoints != null) {
        len = Object.keys(appoints).length; 
        }else{ len = 0;}
        console.log(doctors);
        res.status(200).render('myappoint.pug',{record:appoints,doctor:doctors,log_user:log_user,len:len});
    }catch(error){
        console.log(error);
    }
})
app.get('/doctor/information',ckecking,async(req,res)=>{
    var log_user = req.user;
    const print = await doctor.findOne({username: log_user.username});
    const imgp = print.profile;
    res.status(200).render('doctorSignInDone.pug',{record:print,imgp:imgp});
})
app.get('/patient/information',ckecking1,async(req,res)=>{
    const useremail = await Patient.findOne({_id: req.user.uid});
    // console.log(useremail);
    const hreport = await health_report.findOne({patient_id:useremail._id});
    // console.log(hreport);
    var data = null;
    var len = null;
    if(hreport != null) {
    data = hreport.toObject();
    len = Object.keys(data.meta).length; 
    }else{ len = 0;}
    res.status(200).render('PatientPersonalDetails.pug',{record:useremail,hdata:data,len:len});
})
app.get('/healthcard',ckecking1,async(req,res)=>{
    const useremail = await Patient.findOne({_id: req.user.uid});
    console.log(useremail);
    const imgp = useremail.profile;
    res.status(200).render('healthcard.pug',{record:useremail,imgp:imgp });
})
app.get('/test',(req,res)=>{
    res.status(200).render('test.pug');
})
app.get('/doctorgetpatient',ckecking2,async(req,res)=>{
    var log_user = req.user;
    // console.log(log_user);
    const print = await Patient.findOne({username: log_user.username});
    const hreport = await health_report.findOne({patient_id:print._id});
    var data = null;
    var len = null;
    if(hreport != null) {
    data = hreport.toObject();
    len = Object.keys(data.meta).length; 
    }else{ len = 0;}
    res.status(200).render('doctorgetpatient',{record:print,hdata:data,len:len});
})
app.get('/contact',(req,res)=>{
    res.status(200).render('contact.pug');
})
// app.get('/healthcard',ckecking1,async(req,res)=>{
//     var log_user = req.user;
//     const useremail = await Patient.findOne({username: log_user.username});
//     res.status(200).render('healthcard.pug',{record:useremail});
// })
// app.get('/patient/appoint',(req,res)=>{
//     res.status(200).render('appoint.pug');  
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
async function ckecking2 (req,res,next){
    var my_token = localStorage.getItem('dptoken');
    try{
        var tmp = jwt.verify(my_token,'itisfordoctortogetpatient');
        req.user = tmp;
    }catch(error){
        console.log(error);
        res.status(400).send('Invalid Token varification');
    }
    next();
};
async function ckecking1 (req,res,next){
    var my_token = localStorage.getItem('ptoken');
    try{
        var tmp = jwt.verify(my_token,'itisforpatient');
        req.user = tmp;
        // console.log(tmp);
    }catch(error){
        console.log(error);
        res.status(400).send('Invalid Token varification');
    }
    next();
};
async function ckecking3 (req,res,next){
    var my_token = localStorage.getItem('appoint');
    try{
        var tmp = jwt.verify(my_token,'itisforappointmentwithdoctor');
        req.user = tmp;
    }catch(error){
        console.log(error);
        res.status(400).send('Invalid Token varification');
    }
    next();
};
async function ckecking4 (req,res,next){
    var my_token = localStorage.getItem('rtoken');
    try{
        var tmp = jwt.verify(my_token,'itisforpatientregistration');
        req.user = tmp;
        console.log(tmp);
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
            const useremail = await Patient.findOne({username:username});
            const isMatch= await bcrypt.compare(password,useremail.pass);
            if(isMatch){
                var token = jwt.sign({uid: useremail._id},"itisforpatient",{expiresIn: '1h'});
                localStorage.setItem('ptoken',token);
                res.status(200).redirect('/patient/information');
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
            var token = jwt.sign({username: username},"hello_howareu",{expiresIn: '1h'});
            localStorage.setItem('my_token',token);
            res.status(200).redirect('/doctor/information');
        }else{
            res.send("Invalid Password");
        }
    }catch (error){
        console.log(error);
        res.status(400).send('Invalid Username/Email');
    }
})
app.post('/PatientRegister',async(req,res)=>{
    try{
        const pass = req.body.pass;
        const confpass = req.body.confpass;
        const imgpath = null;
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
            // console.log("Patient Data"+register_patient );
            await register_patient.generateAuthToken(register_patient);
            const register_p = await register_patient.save();
            // console.log("the token for new registration::"+ token);
            console.log("Data Entered Successfully");
            res.status(200).render('pr2');
        }
        else{
            res.send("Password Not Match....");
        }
    }catch (error){
        console.log("Error in data entering process");
        console.log(error);
    }
})
app.post('/patient/appointment',ckecking1,async(req,res)=>{
    try{
        const patient = await Patient.findOne({_id: req.user.uid});
        const book_appoint = new appoint({
            account: patient._id,
            name: req.body.name,
            age: req.body.age,
            city: req.body.city,
            date: req.body.date,
            contact: req.body.contact,
            })
            const print = await doctor.find({city: req.body.city});
            console.log(print);
            const register_p = await book_appoint.save();
            var token = jwt.sign({uid: register_p._id},"itisforappointmentwithdoctor",{expiresIn: '1h'});
            localStorage.setItem('appoint',token);
            if(print != null) {
                len = Object.keys(print).length; 
            }else{ len = 0;}
            res.status(200).render('appoint.pug',{obj:print,record:patient,len:len});
    }catch (error){
        console.log("Error in data entering process");
        console.log(error);
    }
})
app.post('/patient/feedback',ckecking1,async(req,res)=>{
    try{
            const print = await doctor.find({city: req.body.city});
            const patient = await Patient.findOne({_id: req.user.uid});
            if(print != null) {
                len = Object.keys(print).length; 
            }else{ len = 0;}
            res.status(200).render('feedback.pug',{record:patient,obj:print,len:len});
    }catch (error){
        console.log("Error in data entering process");
        console.log(error);
    }
})

// image upload testing
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'D:/Project/SDP/express_web/public/pictures/profiles/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        console.log(Date.now());
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
app.post('/upload-profile-pic', ckecking4,(req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
    
    upload(req, res, async(err) =>{
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        var pt = req.file.filename;
        var profile = "../pictures/profiles/" + pt.toString();
        console.log(pt);
        var log_user = req.user;
        const useremail = await Patient.findOne({username: log_user.username});
        // console.log(useremail);
        // const doc = await Patient.findOne({_id: "604dcce43073081c7cdd61ac" });
        await Patient.updateOne({_id: useremail._id}, { profile: profile });
        res.status(200).render('index');
        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" ><hr /><a href="./">Upload another image</a>`);
    });
});

app.post('/doctorgetpatient',async(req,res)=>{
    const username = req.body.username;
    const useremail = await Patient.findOne({username});
    if(useremail != null){
        var token = jwt.sign({username: useremail.username},"itisfordoctortogetpatient",{expiresIn: '1h'});
        localStorage.setItem('dptoken',token);
        res.status(200).redirect('/doctorgetpatient');
    }else{
        res.send("Invalid Username...");
    }
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
                req.user = useremail;
                res.status(200).redirect('/doctorgetpatient');
                // .render('doctor');
            }catch(error){
                console.log(error);
            }
        })
// app.post('/healthcard',async(req,res)=>{
//     const username = req.body.username;
//     // const useremail = await Patient.findOne({username});
//     res.status(200).render('healthcard.pug',{record:useremail,imgp:useremail.profile});
// })
app.post('/apt',ckecking3, async(req,res)=>{
    const aptid = req.user;
    const ans = req.body.did;
    appoint.findOneAndUpdate(
        { _id:aptid.uid }, 
        { doctor: ans } ,
        { upsert : true },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        }
        );
    res.status(200).redirect('/patient/information');
})
app.post('/modifyappoint',ckecking3, async(req,res)=>{
    const ans = req.user;
    const aptid = req.body.appoint_id;
    appoint.findOneAndDelete(
        { _id:aptid}, 
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        }
        );
    res.status(200).redirect('/dappoint');
})
app.post('/updateratings', async(req,res)=>{
    try{
    var count = Number(req.body.count);
    const log_doctor = await doctor.findOne({_id:req.body.doctor_id});
    var old_rating = log_doctor.rating;
    old_rating += count;
    var new_rating = old_rating/2;
    var nrt = new_rating.toFixed(1);
    console.log(count);
    doctor.findOneAndUpdate(
        { _id:req.body.doctor_id}, 
        { rating:nrt}, 
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("success");
            }
        }
    );
    res.redirect('/patient/information');
    }catch(error){
        console.log(error);
    }
})
//jsonWebtoken 
        
        
//START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
})
    